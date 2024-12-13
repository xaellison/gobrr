"use client";

import React, { useEffect, useRef, useState } from "react";

const MyAnimation = () => {
  const canvasRef = useRef(null);

  const [states, setData] = useState([]);

  useEffect(() => {
    // Fetch the JSON file in the client-side
    const fetchRectangles = async () => {
      try {
        const response = await fetch("/bubble_sort.json");
        if (!response.ok) {
          throw new Error("Failed to fetch bubble_sort.json");
        }
        const data = await response.json();
        setData(data['states']);
      
      } catch (error) {
        console.error("Error loading bubble_sort.json:", error);
      }
    };

    fetchRectangles();
  }, []);

  useEffect(() => {
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawRectangles = (t) => {
      if (states !== undefined && states.length > 0) { // prevents calls where state is null. not sure why
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const step_ms = 500

        let start_index = Math.floor(t / step_ms)
        let end_index = Math.ceil(t / step_ms)
        console.log(start_index)
        let objects_start = states[start_index]
        let objects_end = states[end_index]
        for (const key of Object.keys(objects_start)) {

          if (objects_start[key]['type'] == 'rect'){
            const rect_start = objects_start[key]['args']
            const rect_end = objects_end[key]['args']
      
            const x_start = rect_start.x
            const y_start = rect_start.y
            const w_start = rect_start.width
            const h_start = rect_start.height

            console.log(rect_start)

            const x_end = rect_end.x
            const y_end = rect_end.y
            const w_end = rect_end.width
            const h_end = rect_end.height

            let tween_start = (step_ms - t % step_ms) / step_ms
            let tween_end  = 1 -tween_start
            let x = x_start * tween_start + x_end * tween_end
            let y = y_start * tween_start + y_end * tween_end
            let width = w_start * tween_start + w_end * tween_end
            let height = h_start * tween_start + h_end * tween_end

            
            ctx.beginPath();
            ctx.rect(
              x * canvas.width,
              y * canvas.height, // Adjust y for canvas origin
              width * canvas.width,
              height * canvas.height
            );
            ctx.fillStyle = rect_end['color'];
            ctx.fill();

          }
        }
        requestAnimationFrame(drawRectangles); // fails without this
      }
    };

    requestAnimationFrame(drawRectangles);// fails without this
  }, [states]); // required to actually draw once states is async'ly set

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MyAnimation;
