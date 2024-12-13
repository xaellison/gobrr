"use client";

import React, { useEffect, useRef, useState } from "react";

const MyAnimation = () => {
  const canvasRef = useRef(null);

  const [rectangles, setRectangles] = useState([]);

  useEffect(() => {
    console.log("!")
    // Fetch the JSON file in the client-side
    const fetchRectangles = async () => {
      try {
        const response = await fetch("/bubble_sort.json");
        if (!response.ok) {
          throw new Error("Failed to fetch rectangles.json");
        }
        const data = await response.json();
        setRectangles(data);
      } catch (error) {
        console.error("Error loading rectangles.json:", error);
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
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      rectangles.forEach((state) => {
        Object.values(state).forEach((rect) => {
          const { x, y, width, height } = rect.args;
          ctx.beginPath();
          ctx.rect(
            x * canvas.width + Math.sin(t / 1000) * 200,
            y * canvas.height, // Adjust y for canvas origin
            width * canvas.width,
            height * canvas.height
          );
          ctx.fillStyle = "green";
          ctx.fill();
        });
      });
      requestAnimationFrame(drawRectangles);
    };

    requestAnimationFrame(drawRectangles);
  }, [rectangles]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MyAnimation;
