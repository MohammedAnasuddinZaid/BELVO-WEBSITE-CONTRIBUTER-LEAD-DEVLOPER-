import { useEffect, useRef } from "react";

export default function GrainOverlay({ opacity = 0.03, blend = "overlay" }: { opacity?: number; blend?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 256;
    const h = 256;
    canvas.width = w;
    canvas.height = h;

    let animId: number;
    let lastFrame = 0;
    const FPS = 8;
    const interval = 1000 / FPS;

    const draw = (now: number) => {
      const elapsed = now - lastFrame;
      if (elapsed >= interval) {
        lastFrame = now - (elapsed % interval);
        const imgData = ctx.createImageData(w, h);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const v = Math.random() * 255;
          imgData.data[i] = v;
          imgData.data[i + 1] = v;
          imgData.data[i + 2] = v;
          imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity,
        mixBlendMode: blend as any,
        imageRendering: "pixelated",
      }}
    />
  );
}
