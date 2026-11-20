import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/*
 * A dotted globe with glowing arcs flying out from Hyderabad to tech hubs
 * around the world: "based in India, working with anyone, anywhere".
 */

const R = 2;
const HOME = { lat: 17.385, lon: 78.4867 }; // Hyderabad
const CITIES = [
  { lat: 37.77, lon: -122.42 }, // San Francisco
  { lat: 40.71, lon: -74.0 }, // New York
  { lat: 51.51, lon: -0.13 }, // London
  { lat: 52.52, lon: 13.4 }, // Berlin
  { lat: 25.2, lon: 55.27 }, // Dubai
  { lat: 1.35, lon: 103.82 }, // Singapore
  { lat: 35.68, lon: 139.69 }, // Tokyo
  { lat: -33.87, lon: 151.21 }, // Sydney
  { lat: 12.97, lon: 77.59 }, // Bengaluru
];

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function toVec({ lat, lon }, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

// Evenly spread dots over the sphere (Fibonacci lattice)
function useDots(count) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const t = golden * i;
      pos.set([Math.cos(t) * rad * R * 1.002, y * R * 1.002, Math.sin(t) * rad * R * 1.002], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
}

function useArcs() {
  return useMemo(() => {
    const start = toVec(HOME);
    return CITIES.map((city, i) => {
      const end = toVec(city);
      const lift = R + start.distanceTo(end) * 0.45;
      const mid = start.clone().add(end).normalize().multiplyScalar(lift);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const line = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      return { curve, line, end, offset: i / CITIES.length };
    });
  }, []);
}

function Arc({ arc }) {
  const comet = useRef(null);
  const ring = useRef(null);
  useFrame((state) => {
    const t = reduceMotion() ? 0.6 : (state.clock.elapsedTime * 0.35 + arc.offset) % 1;
    comet.current.position.copy(arc.curve.getPoint(t));
    // landing ripple at the destination
    const s = 1 + ((state.clock.elapsedTime * 0.8 + arc.offset) % 1) * 2.5;
    ring.current.scale.setScalar(s);
    ring.current.material.opacity = 0.9 - (s - 1) / 2.5;
  });
  const normal = arc.end.clone().normalize();
  return (
    <>
      <line geometry={arc.line}>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.45} toneMapped={false} />
      </line>
      <mesh ref={comet}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#e0f2fe" toneMapped={false} />
      </mesh>
      <mesh
        ref={ring}
        position={arc.end.clone().multiplyScalar(1.01)}
        quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)}
      >
        <ringGeometry args={[0.04, 0.055, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </>
  );
}

export default function GlobeScene() {
  const globe = useRef(null);
  const dots = useDots(2200);
  const arcs = useArcs();

  // Start with India facing the viewer
  const home = toVec(HOME);
  const startY = -Math.atan2(home.x, home.z);

  useFrame((state, delta) => {
    const g = globe.current;
    if (!reduceMotion()) g.rotation.y += delta * 0.08;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.25 - state.pointer.y * 0.2, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 3, 5]} intensity={1.6} color="#c4b5fd" />
      <group ref={globe} rotation={[0.25, startY, 0]}>
        <mesh>
          <sphereGeometry args={[R, 64, 64]} />
          <meshStandardMaterial color="#0d1330" emissive="#1e1b4b" emissiveIntensity={0.5} roughness={0.7} metalness={0.2} />
        </mesh>
        <points geometry={dots}>
          <pointsMaterial color="#7dd3fc" size={0.025} transparent opacity={0.55} sizeAttenuation toneMapped={false} />
        </points>
        {arcs.map((arc, i) => (
          <Arc key={i} arc={arc} />
        ))}
        {/* Home marker */}
        <mesh position={home.clone().multiplyScalar(1.01)}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#facc15" toneMapped={false} />
        </mesh>
      </group>
      {/* Soft atmosphere glow */}
      <mesh scale={1.12}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}
