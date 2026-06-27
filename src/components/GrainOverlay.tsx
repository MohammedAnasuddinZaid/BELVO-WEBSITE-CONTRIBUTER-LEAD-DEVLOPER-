import { useEffect, useRef } from "react";

export default function GrainOverlay({ opacity = 0.03, blend = "overlay" }: { opacity?: number; blend?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const w = 256;
    const h = 256;
    canvas.width = w;
    canvas.height = h;

    const draw = () => {
      const imgData = ctx.createImageData(w, h);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = v;
        imgData.data[i + 1] = v;
        imgData.data[i + 2] = v;
        imgData.data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
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
