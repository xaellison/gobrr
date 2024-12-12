"use client";

import React, { useEffect, useRef } from "react";

const MyAnimation = () => {
  const canvasRef = useRef(null);

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
      ctx.arc(x, y, 150, 0, Math.PI * 2);
      ctx.fillStyle = "green";
      ctx.fill();
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MyAnimation;
