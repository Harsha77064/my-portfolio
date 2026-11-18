import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { profile } from "../constants";

gsap.registerPlugin(useGSAP);

function Shape() {
  const mesh = useRef(null);

  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.4;
  });

  return (
    <Float speed={2} floatIntensity={1.5}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#4c1d95"
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.25}
          flatShading
        />
      </mesh>
    </Float>
  );
}

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".hero-text", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative grid min-h-screen items-center px-6 pt-24 md:grid-cols-2 md:px-20"
    >
      <div>
        <p className="hero-text text-white/60">Hi, I'm</p>
        <h1 className="hero-text text-4xl font-bold md:text-6xl">{profile.name}</h1>
        <p className="hero-text mt-4 text-lg text-white/70 md:text-xl">{profile.title}</p>
        <div className="hero-text mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80"
          >
            View Projects
          </a>
          <a
            href={profile.resume}
            download
            className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
          >
            Download Resume
          </a>
        </div>
      </div>

      <div className="h-[320px] md:h-[500px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 3]} intensity={3} />
          <pointLight position={[-3, -2, 2]} intensity={40} color="#38bdf8" />
          <Shape />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </section>
  );
}