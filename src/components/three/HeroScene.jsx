import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, Sparkles, Stars } from "@react-three/drei";
import SciFiEngineer from "./SciFiEngineer";
import { HoloPanels, NeuralNetwork, Platform } from "./HoloLab";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Camera drifts gently toward the mouse for a parallax feel
function CameraRig() {
  const target = new THREE.Vector3();
  useFrame((state, delta) => {
    if (reduceMotion()) return;
    target.set(state.pointer.x * 1.1, 0.9 + state.pointer.y * 0.5, 9);
    state.camera.position.lerp(target, 1 - Math.exp(-2.5 * delta));
    state.camera.lookAt(0, 0.15, 0);
  });
  return null;
}

// Everything rises and grows in once the intro loader has gone
function Intro({ delay, children }) {
  const group = useRef(null);
  const start = useRef(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const shown = reduceMotion() || state.clock.elapsedTime - start.current > delay ? 1 : 0;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, shown, 4, delta));
    g.position.y = THREE.MathUtils.damp(g.position.y, shown ? 0 : -2, 3, delta);
  });

  return (
    <group ref={group} scale={0} position={[0, -2, 0]}>
      {children}
    </group>
  );
}

export default function HeroScene({ delay = 0 }) {
  // Shrink everything on narrow canvases so the holograms never leave the frame
  const width = useThree((s) => s.viewport.width);
  const fit = Math.min(1, width / 7.6);

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} />
      {/* Coloured rim lights outline the figure from behind */}
      <pointLight position={[-3, 2.5, -2.5]} intensity={45} color="#8b5cf6" />
      <pointLight position={[3, 1.5, -2.5]} intensity={45} color="#22d3ee" />
      <pointLight position={[0, -1.6, 1.5]} intensity={8} color="#22d3ee" />
      {/* Studio-style reflections built locally, so no HDR file is downloaded */}
      <Environment resolution={128} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 5]} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, 1]} scale={[3, 6, 1]} color="#8b5cf6" />
        <Lightformer form="rect" intensity={2.5} position={[5, 1, 1]} scale={[3, 6, 1]} color="#22d3ee" />
      </Environment>

      <group scale={fit}>
        <Intro delay={delay}>
          <SciFiEngineer rotation={[0, -0.2, 0]} />
          <Platform position={[0, -2.2, 0]} />
          <HoloPanels />
          <Float speed={1.4} floatIntensity={0.4} rotationIntensity={0.15}>
            <NeuralNetwork position={[2.35, 1.1, 0.2]} rotation={[0, -0.45, 0]} scale={0.95} />
          </Float>
        </Intro>
        <ContactShadows position={[0, -2.3, 0]} opacity={0.55} scale={8} blur={2.5} far={3} />
      </group>

      <Sparkles count={70} scale={[9, 6, 6]} size={2.5} speed={0.4} color="#a5f3fc" />
      <Stars radius={60} depth={30} count={1500} factor={3} fade speed={0.6} />
    </>
  );
}
