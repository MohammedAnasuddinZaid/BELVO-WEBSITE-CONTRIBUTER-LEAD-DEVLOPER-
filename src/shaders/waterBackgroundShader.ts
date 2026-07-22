import * as THREE from "three";

export function createWaterBackgroundMaterial(
  texture: THREE.Texture,
  imgAspect: number
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uImgAspect: { value: imgAspect },
      uScreenAspect: { value: window.innerWidth / window.innerHeight },
      uOpacity: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform float uImgAspect;
      uniform float uScreenAspect;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float imgRatio = uImgAspect;
        float screenRatio = uScreenAspect;
        float scale = screenRatio / imgRatio;

        vec2 adjustedUv = uv;
        if (scale > 1.0) {
          adjustedUv.x = (uv.x - 0.5) / scale + 0.5;
        } else {
          adjustedUv.y = (uv.y - 0.5) * scale + 0.5;
        }

        float waveX = sin(uv.y * 12.0 + uTime * 0.6) * 0.008;
        float waveY = sin(uv.x * 10.0 + uTime * 0.5) * 0.006;
        vec2 distorted = adjustedUv + vec2(waveX, waveY);

        float edge = smoothstep(0.0, 0.08, distorted.x) * smoothstep(1.0, 0.92, distorted.x) *
                     smoothstep(0.0, 0.08, distorted.y) * smoothstep(1.0, 0.92, distorted.y);

        vec4 color = texture2D(uTexture, distorted);
        gl_FragColor = vec4(color.rgb, uOpacity * edge);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}
