import { noiseGLSL } from "./noise";

/** Névoa vermelha muito sutil atrás das estrelas. */
export const nebulaVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nebulaFragment = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;

${noiseGLSL}

void main() {
  vec2 uv = vUv * vec2(3.2, 2.0);
  float t = uTime * 0.012;
  float n = fbm(vec3(uv, t));
  float n2 = fbm(vec3(uv * 2.1 + n, t * 1.7 + 4.0));
  float cloud = smoothstep(0.05, 0.85, n * 0.6 + n2 * 0.5 + 0.2);
  // Some nas bordas do plano.
  vec2 e = smoothstep(vec2(0.0), vec2(0.25), vUv) * smoothstep(vec2(0.0), vec2(0.25), 1.0 - vUv);
  float alpha = cloud * e.x * e.y * uOpacity;
  gl_FragColor = vec4(uColor * cloud, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
