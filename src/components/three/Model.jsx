import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

import { DRACO_PATH, modelUrl } from "./models";

/**
 * Loads a .glb from /public/models, centres it on the origin and scales it so
 * its largest side equals `size`. The source models all use different units,
 * so this keeps the scenes easy to lay out.
 */
export default function Model({ name, size = 1, tint, ...props }) {
  const { scene } = useGLTF(modelUrl(name), DRACO_PATH);

  const { object, scale, offset } = useMemo(() => {
    const object = scene.clone(true);
    // Optional flat colour for logos that are too dark against the page
    if (tint) {
      const material = new THREE.MeshStandardMaterial({
        color: tint,
        emissive: tint,
        emissiveIntensity: 0.35,
        metalness: 0.3,
        roughness: 0.35,
      });
      object.traverse((o) => {
        if (o.isMesh) o.material = material;
      });
    }
    const box = new THREE.Box3().setFromObject(object);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = size / Math.max(dims.x, dims.y, dims.z);
    return { object, scale, offset: center.multiplyScalar(-1) };
  }, [scene, size, tint]);

  return (
    <group {...props}>
      <group scale={scale}>
        <primitive object={object} position={offset} />
      </group>
    </group>
  );
}
