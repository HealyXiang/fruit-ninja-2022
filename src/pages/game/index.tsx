import React, { useRef, useEffect } from "react";
import { Engine } from "./utils";
import "./style.scss";

export default function Game(): JSX.Element {
  const ref = useRef(null);
  // const canvas: HTMLCanvasElement | null = document.getElementById(
  //   "canvas"
  // ) as HTMLCanvasElement;
  // const ctx = canvas?.getContext("2d");

  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        console.log("canvas.width:", canvas.width);
        new Engine(ctx, canvas.width, canvas.height).start();
      }
    }
  }, []);
  return (
    <main>
      {/* Game Area */}
      <canvas id="canvas" width="300px" height="400px" ref={ref}>
        <p>Your browser does not support the canvas element!</p>
      </canvas>
    </main>
  );
}
