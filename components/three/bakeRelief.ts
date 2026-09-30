import {
  BackSide,
  CubeCamera,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLCubeRenderTarget,
  type WebGLRenderer,
} from "three";
import { bakeFragment, bakeVertex } from "./shaders/moon";

/**
 * Calcula o relevo da lua uma única vez, na GPU, e grava num cubemap com mipmaps.
 * O cubemap não tem emenda (ao contrário de uma textura equiretangular).
 */
export function bakeRelief(gl: WebGLRenderer, size: number): WebGLCubeRenderTarget {
  const target = new WebGLCubeRenderTarget(size, {
    type: HalfFloatType,
    format: RGBAFormat,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  });

  const scene = new Scene();
  const geometry = new SphereGeometry(1, 64, 32);
  const material = new ShaderMaterial({
    vertexShader: bakeVertex,
    fragmentShader: bakeFragment,
    side: BackSide,
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new Mesh(geometry, material));

  const camera = new CubeCamera(0.01, 10, target);
  const previousToneMapping = gl.toneMapping;
  camera.update(gl, scene);
  gl.toneMapping = previousToneMapping;

  geometry.dispose();
  material.dispose();
  return target;
}
