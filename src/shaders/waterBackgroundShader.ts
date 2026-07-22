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
        float imageAspect = uImgAspect;
        float screenAspect = uScreenAspect;
        float scale = screenAspect / imageAspect;

        vec2 adjustedUv = uv;
        if (scale > 1.0) {
          adjustedUv.x = (uv.x - 0.5) / scale + 0.5;
        } else {
          adjustedUv.y = (uv.y - 0.5) * scale + 0.5;
        }

        float waveX = sin(adjustedUv.y * 20.0 + uTime * 0.5) * 0.004;
        float waveY = sin(adjustedUv.x * 16.0 + uTime * 0.4) * 0.003;
        vec2 distorted = adjustedUv + vec2(waveX, waveY);

        vec4 color = texture2D(uTexture, distorted);
        gl_FragColor = vec4(color.rgb, uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}
