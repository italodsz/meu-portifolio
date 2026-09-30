/** Rastro da estrela cadente: gradiente ao longo do comprimento, cabeça mais brilhante. */
export const streakVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const streakFragment = /* glsl */ `
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float along = pow(vUv.x, 2.2);
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  across = pow(max(across, 0.0), 1.6);
  float head = smoothstep(0.9, 1.0, vUv.x) * 1.6;
  float alpha = (along + head) * across * uOpacity;
  gl_FragColor = vec4(uColor * (1.0 + head), alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
