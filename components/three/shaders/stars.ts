/** Estrelas em Points: 3 camadas de profundidade, cintilação individual e parallax. */
export const starsVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aSpeed;
attribute float aLayer;
attribute vec3 aColor;

uniform float uTime;
uniform float uPixelRatio;
uniform float uTwinkle;
uniform vec2 uParallax;
uniform float uScroll;

varying vec3 vColor;
varying float vTwinkle;

void main() {
  // Camadas próximas se movem mais (parallax).
  float depth = aLayer < 0.5 ? 1.0 : (aLayer < 1.5 ? 0.55 : 0.25);
  vec3 p = position;
  p.xy += uParallax * depth * 2.6;
  p.y += uScroll * depth * 9.0;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float twinkle = 1.0;
  if (uTwinkle > 0.5) {
    float s = sin(uTime * aSpeed + aPhase);
    twinkle = 0.62 + 0.38 * s * abs(s);
  }
  vTwinkle = twinkle;
  vColor = aColor;
  gl_PointSize = aSize * uPixelRatio * (0.85 + 0.15 * twinkle);
}
`;

export const starsFragment = /* glsl */ `
uniform float uOpacity;
uniform float uLightMode;
uniform vec3 uLightColor;

varying vec3 vColor;
varying float vTwinkle;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 4.0);
  float alpha = (core * 0.28 + glow) * vTwinkle * uOpacity;
  vec3 color = mix(vColor * (0.7 + glow * 0.9), uLightColor, uLightMode);
  gl_FragColor = vec4(color, alpha * mix(1.0, 0.55, uLightMode));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
