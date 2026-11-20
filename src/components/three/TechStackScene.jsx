import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Lightformer, Environment } from "@react-three/drei";
import Model from "./Model";
import { preloadModel } from "./models";

const techLogos = [
  { name: "python-transformed.glb", label: "Python" },
  { name: "react_logo-transformed.glb", label: "React" },
  { name: "node-transformed.glb", label: "Node.js" },
  { name: "git-svg-transformed.glb", label: "Git", tint: "#f05032" },
  { name: "three.js-transformed.glb", label: "Three.js", tint: "#e9e5ff" },
];

techLogos.forEach((l) => preloadModel(l.name));

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One logo: idles with a slow spin, and on hover grows and spins quickly
function TechLogo({ logo, x, index, onHover }) {
  const group = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const g = group.current;
    const target = hovered ? 1.35 : 1;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 8, delta));
    if (!reduceMotion()) g.rotation.y += delta * (hovered ? 3 : 0.6);
    else g.rotation.y = 0.4;
    // Lean slightly toward the mouse
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.3, 4, delta);
  });

  return (
    <group position={[x, 0, 0]}>
      <Float speed={2 + index * 0.3} floatIntensity={0.8} rotationIntensity={0.2}>
        <group
          ref={group}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            onHover(logo.label);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            onHover(null);
            document.body.style.cursor = "";
          }}
        >
          <Model name={logo.name} size={1.9} tint={logo.tint} />
        </group>
      </Float>
    </group>
  );
}

export default function TechStackScene({ onHover = () => {} }) {
  const width = useThree((s) => s.viewport.width);
  const spacing = 2.9;
  const rowWidth = spacing * (techLogos.length - 1) + 2;
  const fit = Math.min(1, width / rowWidth);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={2} />
      <pointLight position={[-6, 0, 3]} intensity={25} color="#8b5cf6" />
      <pointLight position={[6, 0, 3]} intensity={25} color="#38bdf8" />
      <Environment resolution={64} environmentIntensity={0.5}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} />
      </Environment>

      <group scale={fit}>
        {techLogos.map((logo, i) => (
          <TechLogo
            key={logo.name}
            logo={logo}
            index={i}
            x={(i - (techLogos.length - 1) / 2) * spacing}
            onHover={onHover}
          />
        ))}
      </group>
    </>
  );
}
