import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { createWaterBackgroundMaterial } from "../shaders/waterBackgroundShader";

interface LoadingScreenProps {
  onComplete: () => void;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const LETTERS = "BELVO".split("");
const BG_IMAGE = "/splash-bg.jpg";
const IMG_ASPECT = 845 / 472;

function makeSpriteTexture(color: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.15, color.replace("1)", "0.85)"));
  g.addColorStop(0.4, color.replace("1)", "0.4)"));
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function computeParticleColors(
  home: Float32Array,
  N: number
): Float32Array {
  const colors = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const y = home[i * 3 + 1];
    const t = (y / 2.12) * 0.5 + 0.5;

    let r: number, g: number, b: number;
    if (t < 0.5) {
      const s = t * 2;
      r = 0.55 + s * (0.82 - 0.55);
      g = 0.25 + s * (0.55 - 0.25);
      b = 0.55 + s * (0.55 - 0.55);
    } else {
      const s = (t - 0.5) * 2;
      r = 0.82 + s * (0.90 - 0.82);
      g = 0.55 + s * (0.75 - 0.55);
      b = 0.55 - s * (0.55 - 0.43);
    }

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
  return colors;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"enter" | "text" | "exit" | "hidden">("enter");
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      doneRef.current();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = innerWidth;
    const h = innerHeight;
    const isMobile = w < 768;
    const sf = Math.min(1, Math.max(0.5, w / 1200));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = isMobile ? 6 : 4.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const particleTex = makeSpriteTexture("rgba(255,255,255,1)");

    // ── Water-distorted background image ──
    const loader = new THREE.TextureLoader();
    const bgTex = loader.load(BG_IMAGE);
    bgTex.colorSpace = THREE.SRGBColorSpace;

    const waterMat = createWaterBackgroundMaterial(bgTex, IMG_ASPECT);
    const bgSize = 2 * Math.tan((60 * Math.PI) / 360) * camera.position.z * 2.2;
    const bgGeo = new THREE.PlaneGeometry(bgSize * (w / h), bgSize);
    const bgMesh = new THREE.Mesh(bgGeo, waterMat);
    bgMesh.renderOrder = -1;
    bgMesh.frustumCulled = false;
    scene.add(bgMesh);

    // ── Sphere particles ──
    const N = 2800;
    const R = 2;
    const pos = new Float32Array(N * 3);
    const home = new Float32Array(N * 3);
    const init = new Float32Array(N * 3);
    const bDir = new Float32Array(N * 3);
    const bDel = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const theta = GOLDEN_ANGLE * i;
      const phi = Math.acos(1 - 2 * (i + 0.5) / N);
      const rr = R + (Math.random() - 0.5) * 0.12;
      const x = rr * Math.sin(phi) * Math.cos(theta);
      const y = rr * Math.cos(phi);
      const z = rr * Math.sin(phi) * Math.sin(theta);

      home[i * 3] = x;
      home[i * 3 + 1] = y;
      home[i * 3 + 2] = z;

      const sp = 10;
      init[i * 3] = (Math.random() - 0.5) * sp;
      init[i * 3 + 1] = (Math.random() - 0.5) * sp;
      init[i * 3 + 2] = (Math.random() - 0.5) * sp;

      const ln = Math.sqrt(x * x + y * y + z * z);
      let dx = x / ln + (Math.random() - 0.5) * 0.7;
      let dy = y / ln + (Math.random() - 0.5) * 0.7;
      let dz = z / ln + (Math.random() - 0.5) * 0.7;
      const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
      bDir[i * 3] = dx / dl;
      bDir[i * 3 + 1] = dy / dl;
      bDir[i * 3 + 2] = dz / dl;

      bDel[i] = Math.random() * 0.35;
      pos[i * 3] = init[i * 3];
      pos[i * 3 + 1] = init[i * 3 + 1];
      pos[i * 3 + 2] = init[i * 3 + 2];
    }

    const particleColors = computeParticleColors(home, N);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.058 * sf,
      map: particleTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    // ── Outer glow halo ──
    const gN = 400;
    const gPos = new Float32Array(gN * 3);
    for (let i = 0; i < gN; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const r = 2.6 + Math.random() * 1.8;
      gPos[i * 3] = r * Math.sin(p) * Math.cos(t);
      gPos[i * 3 + 1] = r * Math.cos(p);
      gPos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
    }
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
    const gMat = new THREE.PointsMaterial({
      color: 0xd49a9a,
      size: 0.025 * sf,
      map: particleTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const gMesh = new THREE.Points(gGeo, gMat);
    scene.add(gMesh);

    // ── Central flash ──
    const fc = document.createElement("canvas");
    fc.width = 128;
    fc.height = 128;
    const fctx = fc.getContext("2d")!;
    const fg = fctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    fg.addColorStop(0, "rgba(255,235,200,1)");
    fg.addColorStop(0.2, "rgba(255,220,180,0.7)");
    fg.addColorStop(1, "rgba(255,200,150,0)");
    fctx.fillStyle = fg;
    fctx.fillRect(0, 0, 128, 128);
    const flashTex = new THREE.CanvasTexture(fc);
    const flashMat = new THREE.SpriteMaterial({
      map: flashTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flash = new THREE.Sprite(flashMat);
    flash.scale.set(0.5 * sf, 0.5 * sf, 1);
    scene.add(flash);

    // ── Animation loop ──
    const start = performance.now();
    let animId: number;

    function tick() {
      const elapsed = (performance.now() - start) / 1000;
      const p = geo.attributes.position.array as Float32Array;

      waterMat.uniforms.uTime.value = elapsed;

      if (elapsed < 1.5) {
        const t = elapsed / 1.5;
        const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        for (let i = 0; i < N; i++) {
          p[i * 3] = init[i * 3] + (home[i * 3] - init[i * 3]) * ease;
          p[i * 3 + 1] = init[i * 3 + 1] + (home[i * 3 + 1] - init[i * 3 + 1]) * ease;
          p[i * 3 + 2] = init[i * 3 + 2] + (home[i * 3 + 2] - init[i * 3 + 2]) * ease;
        }
        geo.attributes.position.needsUpdate = true;
        mat.opacity = ease * 0.95;
        gMat.opacity = ease * 0.12;
        waterMat.uniforms.uOpacity.value = ease;
        mesh.rotation.y = elapsed * 0.25;
        gMesh.rotation.y = elapsed * 0.18;
      } else if (elapsed < 3.5) {
        const rt = elapsed - 1.5;
        mesh.rotation.y = rt * 0.45;
        gMesh.rotation.y = rt * 0.32;
        mat.opacity = 0.95;
        gMat.opacity = 0.12;
        waterMat.uniforms.uOpacity.value = 1;
        const breathe = 1 + Math.sin(rt * 1.8) * 0.025;
        mesh.scale.set(breathe, breathe, breathe);
        const bgBreathe = 1 + Math.sin(rt * 0.5) * 0.008;
        bgMesh.scale.set(bgBreathe, bgBreathe, 1);
      } else if (elapsed < 3.8) {
        const t = (elapsed - 3.5) / 0.3;
        const s = 1 - t * 0.08;
        mesh.scale.set(s, s, s);
        mat.opacity = 0.95 - t * 0.15;
        gMat.opacity = 0.12 - t * 0.05;
        waterMat.uniforms.uOpacity.value = 1 - t * 0.1;
      } else if (elapsed < 4.8) {
        const t = (elapsed - 3.8) / 1.0;
        for (let i = 0; i < N; i++) {
          const d = bDel[i];
          const pt = Math.min(1, Math.max(0, (t - d * 0.4) / (1 - d * 0.4)));
          const dist = pt * pt * 9;
          p[i * 3] = home[i * 3] + bDir[i * 3] * dist;
          p[i * 3 + 1] = home[i * 3 + 1] + bDir[i * 3 + 1] * dist;
          p[i * 3 + 2] = home[i * 3 + 2] + bDir[i * 3 + 2] * dist;
        }
        geo.attributes.position.needsUpdate = true;
        mat.opacity = Math.max(0, 0.85 - t * 0.85);
        gMat.opacity = Math.max(0, 0.12 - t * 0.12);
        waterMat.uniforms.uOpacity.value = Math.max(0, 0.9 - t * 0.9);
        mesh.rotation.y += 0.03;
        gMesh.rotation.y += 0.02;
        mesh.scale.set(1, 1, 1);

        if (t < 0.3) {
          flashMat.opacity = Math.sin(t / 0.3 * Math.PI) * 0.9;
          flash.scale.set(0.5 + t * 4, 0.5 + t * 4, 1);
        } else {
          flashMat.opacity = Math.max(0, flashMat.opacity - 0.04);
        }
      } else {
        mat.opacity = Math.max(0, mat.opacity - 0.03);
        gMat.opacity = Math.max(0, gMat.opacity - 0.02);
        flashMat.opacity = Math.max(0, flashMat.opacity - 0.04);
        waterMat.uniforms.uOpacity.value = Math.max(0, waterMat.uniforms.uOpacity.value - 0.03);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    // ── Phase transitions ──
    const t1 = setTimeout(() => setPhase("text"), 1500);
    const t2 = setTimeout(() => setPhase("exit"), 3800);
    const t3 = setTimeout(() => {
      setPhase("hidden");
      doneRef.current();
    }, 5000);

    const onResize = () => {
      const nw = innerWidth;
      const nh = innerHeight;
      camera.aspect = nw / nh;
      camera.position.z = nw < 768 ? 6 : 4.5;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      waterMat.uniforms.uScreenAspect.value = nw / nh;
    };
    addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      gGeo.dispose();
      gMat.dispose();
      flashMat.dispose();
      flashTex.dispose();
      particleTex.dispose();
      bgGeo.dispose();
      waterMat.dispose();
      bgTex.dispose();
      scene.clear();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        backgroundColor: "#04000e",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "none",
        }}
      />

      {phase !== "enter" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              color: "#f5f0eb",
              letterSpacing: "clamp(0.03em, 1.5vw, 0.08em)",
              textShadow:
                "0 2px 24px rgba(0,0,0,0.25), 0 0 60px rgba(0,0,0,0.1)",
              perspective: "800px",
            }}
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -40 }}
                animate={
                  phase === "exit"
                    ? { opacity: 0, y: -120, rotateX: 60, scale: 0.6, filter: "blur(8px)" }
                    : { opacity: 1, y: [0, -6, 0], rotateX: [0, 1, 0], scale: [1, 1.015, 1], filter: "blur(0px)" }
                }
                transition={
                  phase === "exit"
                    ? {
                        duration: 0.6,
                        delay: 0.03 * i,
                        ease: [0.55, 0, 1, 0.45],
                      }
                    : {
                        duration: 3.5,
                        delay: 0.15 + i * 0.12,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }
                }
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={
              phase === "exit"
                ? { opacity: 0, y: -80, filter: "blur(10px)" }
                : { opacity: 1, y: [0, -3, 0], filter: "blur(0px)" }
            }
            transition={
              phase === "exit"
                ? { duration: 0.9, delay: 0.1, ease: [0.55, 0, 1, 0.45] }
                : { duration: 4, delay: 0.9, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1rem, 3vw, 1.8rem)",
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "clamp(0.12em, 2vw, 0.25em)",
              marginTop: "1.5rem",
              fontWeight: 300,
              textTransform: "uppercase",
              textShadow: "0 2px 16px rgba(0,0,0,0.15)",
            }}
          >
            A Perfect Agency For Your Brand
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={
              phase === "exit"
                ? { scaleX: 0, opacity: 0 }
                : { scaleX: 1, opacity: [0.3, 0.6, 0.3] }
            }
            transition={
              phase === "exit"
                ? { duration: 0.7, ease: [0.55, 0, 1, 0.45] }
                : { duration: 3, delay: 1.6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }
            style={{
              height: 1,
              width: "clamp(80px, 15vw, 180px)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              marginTop: "2rem",
              transformOrigin: "center",
            }}
          />
        </div>
      )}

      {phase === "exit" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 20%, #04000e 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}
