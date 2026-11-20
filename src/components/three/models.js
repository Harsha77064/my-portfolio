import { useGLTF } from "@react-three/drei";

// The .glb files are Draco-compressed; the decoder is served from /public/draco
export const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;

export const modelUrl = (name) => `${import.meta.env.BASE_URL}models/${name}`;

// Start downloading a model before its scene mounts
export function preloadModel(name) {
  useGLTF.preload(modelUrl(name), DRACO_PATH);
}
