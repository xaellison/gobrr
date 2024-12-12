"use client";

import React, { useEffect, useRef, useState } from "react";

const MyAnimation = () => {
  const canvasRef = useRef(null);
  const [circleSize, setCircleSize] = useState(1); // Default size

  useEffect(() => {
    // Fetch the JSON file to get the circle size
    const fetchParameters = async () => {
      try {
        const response = await fetch("/parameter.json"); // Adjust path if necessary
        if (!response.ok) {
          throw new Error("Failed to fetch parameter.json");
        }
        const data = await response.json();
        setCircleSize(data.circleSize);
      } catch (error) {
        console.error("Error loading parameter.json:", error);
      }
    };

    fetchParameters();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      const x = canvas.width / 2 + Math.sin(-t / 1000) * 200;
      const y = canvas.height / 2 + Math.cos(-t / 1000) * 200;
      ctx.beginPath();
      ctx.arc(x, y, circleSize, 0, Math.PI * 2);
      ctx.fillStyle = "green";
      ctx.fill();
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, [circleSize]); // Redraw when circleSize changes

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MyAnimation;
