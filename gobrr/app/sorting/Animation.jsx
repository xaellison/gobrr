"use client";

import React, { useEffect, useRef, useState } from "react";

const MyAnimation = ({ path }) => {
  const canvasRef = useRef(null);

  const [states, setStates] = useState([]);
  const [speed, setSpeed] = useState("medium"); // default speed

  let variable_time = useRef(0.0);
  let prev_t = useRef(0.0);

  let mylist = [];

  const speedFactors = {
    slow: 10,
    medium: 1,
    fast: 0.1,
  };

  useEffect(() => {
    // Fetch the JSON file
    const fetchRectangles = async () => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error("Failed to fetch path");
        }
        const data = await response.json();
        setStates(data["states"]);
      } catch (error) {
        console.error("Error loading states:", error);
      }
    };

    fetchRectangles();
  }, [path]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId; // To manage requestAnimationFrame cleanup

    const drawRectangles = (t) => {
      console.log("real time", t)
      console.log("variable time", variable_time.current)
      mylist.push(1)
      console.log(mylist.len)
      variable_time.current = variable_time.current + ((t - prev_t.current) / speedFactors[speed]);
      prev_t.current = t;

      if (states.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Step delay adjusted by speed factor
        const baseStepMs = 800;
        const stepMs = baseStepMs;// * speedFactors[speed];
        const N_states = states.length;

        let loop_t = variable_time.current % (stepMs * (N_states - 1));
        let start_index = Math.floor(loop_t / stepMs);
        let end_index = Math.ceil(loop_t / stepMs);
        console.log("indices ", start_index, end_index)
        let objects_start = states[start_index];
        let objects_end = states[end_index];

        for (const key of Object.keys(objects_start)) {
          if (objects_start[key]["type"] === "rect") {
            const rect_start = objects_start[key]["args"];
            const rect_end = objects_end[key]["args"];

            const x_start = rect_start.x;
            const y_start = rect_start.y;
            const w_start = rect_start.width;
            const h_start = rect_start.height;

            const x_end = rect_end.x;
            const y_end = rect_end.y;
            const w_end = rect_end.width;
            const h_end = rect_end.height;

            // Logistic tween for smooth transitions
            let tween_start =
              1 /
              (1 +
                Math.exp(
                  ((loop_t % stepMs) - stepMs / 2) / (0.05 * stepMs)
                ));
            let tween_end = 1 - tween_start;

            let x = x_start * tween_start + x_end * tween_end;
            let y = y_start * tween_start + y_end * tween_end;
            let width = w_start * tween_start + w_end * tween_end;
            let height = h_start * tween_start + h_end * tween_end;

            ctx.beginPath();
            ctx.rect(
              x * canvas.width,
              y * canvas.height,
              width * canvas.width,
              height * canvas.height
            );
            ctx.fillStyle = rect_end["color"];
            ctx.fill();
          }
        }

        animationFrameId = requestAnimationFrame(drawRectangles);
      }
    };

    animationFrameId = requestAnimationFrame(drawRectangles);

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [states, speed]); // Redraw when states or speed changes

  return (
    <div>
      {/* Dropdown for speed control */}
      <div style={{ top: 10, left: 10, zIndex: 10 }}>
        <label htmlFor="speed-select" style={{ marginRight: "8px" }}>
          Speed:
        </label>
        <select
          id="speed-select"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        >
          <option value="slow">Slow</option>
          <option value="medium">Medium</option>
          <option value="fast">Fast</option>
        </select>
      </div>
      {/* Canvas */}
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default MyAnimation;
