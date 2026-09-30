import { noiseGLSL } from "./noise";

/**
 * Lua procedural em duas etapas:
 * 1. "bake": um shader calcula uma vez o relevo (crateras + mares + detalhe) e grava num cubemap.
 * 2. render: a lua lê o cubemap (com mipmaps) e calcula a normal por diferenças finitas.
 * Assim o relevo fica suave e barato de desenhar a cada frame.
 */

export const bakeVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const bakeFragment = /* glsl */ `
varying vec3 vDir;

${noiseGLSL}

// Uma camada de crateras: cada célula 3D pode ter uma cratera (bacia + borda elevada).
float craterLayer(vec3 p, float density) {
  vec3 cell = floor(p);
  vec3 f = fract(p);
  float h = 0.0;
  for (int x = -1; x <= 1; x++)
  for (int y = -1; y <= 1; y++)
  for (int z = -1; z <= 1; z++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 rnd = hash33(cell + o);
    if (rnd.x > density) continue;
    vec3 center = o + hash33(cell + o + 17.0);
    float r = mix(0.18, 0.5, rnd.y * rnd.y);
    float d = length(f - center) / r;
    if (d > 1.5) continue;
    float depth = mix(0.45, 1.0, rnd.z);
    float bowl = d < 1.0 ? (d * d - 1.0) * depth * mix(0.6, 1.0, smoothstep(0.0, 0.5, d)) : 0.0;
    float rim = exp(-pow((d - 1.0) * 4.5, 2.0)) * mix(0.15, 0.4, rnd.z);
    h += (bowl + rim) * r;
  }
  return h;
}

void main() {
  vec3 p = normalize(vDir);
  float maria = smoothstep(-0.1, 0.5, fbm(p * 1.2 + vec3(3.1, 1.7, 0.4)));
  float detail = fbm(p * 9.0);
  float craters =
      craterLayer(p * 2.0, 0.24) +
      craterLayer(p * 4.6, 0.3) * 0.5 +
      craterLayer(p * 10.0, 0.34) * 0.22 +
      craterLayer(p * 21.0, 0.3) * 0.08;
  float height = craters + detail * 0.035 - maria * 0.05;
  // R = altura, G = mares (albedo escuro), B = crateras (para clarear bordas).
  gl_FragColor = vec4(height, maria, craters, 1.0);
}
`;

export const moonVertex = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

void main() {
  vObjPos = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const moonFragment = /* glsl */ `
uniform samplerCube uRelief;
uniform mat3 uModelRot;
uniform float uEps;
uniform vec3 uLightDir;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform vec3 uShadow;
uniform vec3 uRim;
uniform float uRimStrength;
uniform float uBump;
uniform float uFade;

varying vec3 vObjPos;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

void main() {
  vec3 p = normalize(vObjPos);
  vec3 up = abs(p.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(up, p));
  vec3 t2 = cross(p, t1);

  vec4 relief = texture(uRelief, p);
  float h = relief.r;
  float h1 = texture(uRelief, normalize(p + t1 * uEps)).r;
  float h2 = texture(uRelief, normalize(p + t2 * uEps)).r;
  vec3 objNormal = normalize(p - uBump * (((h1 - h) / uEps) * t1 + ((h2 - h) / uEps) * t2));
  vec3 bumped = normalize(uModelRot * objNormal);

  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 lightDir = normalize(uLightDir);

  // Fase lunar: terminador suave na normal geométrica + sombreamento do relevo.
  float terminator = smoothstep(-0.08, 0.35, dot(normal, lightDir));
  float diffuse = clamp(dot(bumped, lightDir), 0.0, 1.0);
  float light = terminator * mix(0.25, 1.0, diffuse) * 1.2;

  float albedo = mix(1.0, 0.5, relief.g) + clamp(relief.b, -0.2, 0.3) * 0.25;
  vec3 surface = mix(uColorLow, uColorHigh, clamp(albedo, 0.0, 1.0));
  vec3 color = surface * light + uShadow * (1.0 - terminator);

  // Rim light vermelho (fresnel), mais forte no lado iluminado.
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);
  color += uRim * fresnel * uRimStrength * mix(0.55, 1.0, terminator);

  gl_FragColor = vec4(color * uFade, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Halo atmosférico atrás da lua (esfera maior, só as faces de trás). */
export const haloVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const haloFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uStrength;
uniform float uEdge;
varying vec3 vNormal;
varying vec3 vViewPos;
void main() {
  // Faces de trás: -dot(n, v) vai de 0 (borda externa do halo) a uEdge (borda da lua).
  vec3 viewDir = normalize(-vViewPos);
  float x = clamp(-dot(normalize(vNormal), viewDir) / uEdge, 0.0, 1.0);
  float intensity = pow(x, 3.0);
  gl_FragColor = vec4(uColor * intensity * uStrength, intensity * uStrength);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
