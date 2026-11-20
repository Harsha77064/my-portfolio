import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PresentationControls,
  Sparkles,
} from "@react-three/drei";
import Model from "./Model";
import { preloadModel } from "./models";

preloadModel("computer-optimized-transformed.glb");

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Two glowing rings that circle the computer like a signal going out
function SignalRings() {
  const a = useRef(null);
  const b = useRef(null);
  useFrame((state, delta) => {
    if (reduceMotion()) return;
    a.current.rotation.z += delta * 0.6;
    b.current.rotation.z -= delta * 0.4;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    a.current.scale.setScalar(pulse);
  });
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -1.75, 0]}>
      <mesh ref={a}>
        <torusGeometry args={[2.1, 0.03, 16, 120]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.8} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[2.5, 0.018, 16, 120, Math.PI * 1.4]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function ContactScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <pointLight position={[-4, 1, 3]} intensity={30} color="#8b5cf6" />
      <pointLight position={[4, 2, -2]} intensity={20} color="#38bdf8" />
      <Environment resolution={64} environmentIntensity={0.5}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} />
      </Environment>

      {/* Drag to turn the computer; it springs back when released */}
      <PresentationControls
        global={false}
        cursor
        snap
        speed={1.5}
        polar={[-0.2, 0.3]}
        azimuth={[-0.9, 0.9]}
      >
        <Float speed={2} floatIntensity={0.6} rotationIntensity={0.15}>
          <group rotation={[0.12, 0.75, 0]}>
            <Model name="computer-optimized-transformed.glb" size={3.8} />
          </group>
        </Float>
      </PresentationControls>

      <SignalRings />
      <Sparkles count={40} scale={[7, 4, 7]} size={3} speed={0.5} color="#c4b5fd" />
      <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={9} blur={2.5} far={3} />
    </>
  );
}
