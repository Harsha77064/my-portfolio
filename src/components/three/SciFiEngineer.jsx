import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/*
 * An original sci-fi "AI engineer" android, built entirely from three.js
 * primitives: white armour over a dark suit, a glass visor with a glowing eye
 * strip, a pulsing chest core and a data halo. The head follows the mouse,
 * the right hand swipes through a hologram and the left holds a data tablet.
 */

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useMaterials() {
  return useMemo(
    () => ({
      armor: new THREE.MeshPhysicalMaterial({
        color: "#e9edf7",
        metalness: 0.3,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
      suit: new THREE.MeshStandardMaterial({ color: "#1a1e33", metalness: 0.65, roughness: 0.42 }),
      coat: new THREE.MeshPhysicalMaterial({
        color: "#10131f",
        metalness: 0.35,
        roughness: 0.55,
        sheen: 0.45,
        sheenColor: new THREE.Color("#6d5bd0"),
        side: THREE.DoubleSide,
      }),
      joint: new THREE.MeshStandardMaterial({ color: "#2b3150", metalness: 0.8, roughness: 0.3 }),
      visor: new THREE.MeshPhysicalMaterial({
        color: "#04050c",
        metalness: 0.9,
        roughness: 0.04,
        clearcoat: 1,
        side: THREE.DoubleSide,
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: CYAN,
        emissive: CYAN,
        emissiveIntensity: 3,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
      violet: new THREE.MeshStandardMaterial({
        color: VIOLET,
        emissive: VIOLET,
        emissiveIntensity: 2.5,
        toneMapped: false,
      }),
    }),
    []
  );
}

// A capsule hanging down from its pivot (the joint sits at the origin)
function Limb({ length, radius, material }) {
  return (
    <mesh material={material} position={[0, -length / 2 - radius * 0.6, 0]}>
      <capsuleGeometry args={[radius, length, 8, 16]} />
    </mesh>
  );
}

// A long open-front coat: a flared lathe from the waist to the knees with
// glowing trim down both front edges and along the hem
const COAT_TOP = 0.5;
const COAT_BOTTOM = -1.3;
const COAT_GAP = 0.42; // half-angle of the open front, in radians

function useCoat() {
  return useMemo(() => {
    const profile = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      // narrow at the waist, flaring out toward the hem
      profile.push(new THREE.Vector2(0.33 + t * t * 0.3, COAT_TOP + (COAT_BOTTOM - COAT_TOP) * t));
    }
    const shell = new THREE.LatheGeometry([...profile].reverse(), 48, COAT_GAP, Math.PI * 2 - COAT_GAP * 2);
    const edge = (sign) => {
      const pts = profile.map((p) => new THREE.Vector3(Math.sin(sign * COAT_GAP) * p.x, p.y, Math.cos(COAT_GAP) * p.x));
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.014, 6);
    };
    const hemPts = [];
    for (let i = 0; i <= 48; i++) {
      const a = COAT_GAP + (i / 48) * (Math.PI * 2 - COAT_GAP * 2);
      hemPts.push(new THREE.Vector3(Math.sin(a) * 0.63, COAT_BOTTOM, Math.cos(a) * 0.63));
    }
    const hem = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPts), 64, 0.014, 6);
    return { shell, left: edge(-1), right: edge(1), hem };
  }, []);
}

// A small canvas-drawn bar chart for the hand-held tablet
function useTabletTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 160;
    const g = c.getContext("2d");
    g.fillStyle = "rgba(8, 20, 40, 0.75)";
    g.fillRect(0, 0, 256, 160);
    g.strokeStyle = CYAN;
    g.lineWidth = 4;
    g.strokeRect(2, 2, 252, 156);
    g.fillStyle = CYAN;
    g.font = "bold 20px Consolas, ui-monospace, monospace";
    g.fillText("ACCURACY", 14, 30);
    [0.45, 0.6, 0.55, 0.75, 0.82, 0.94].forEach((v, i) => {
      g.fillStyle = i === 5 ? VIOLET : CYAN;
      g.fillRect(18 + i * 38, 145 - v * 100, 24, v * 100);
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

export default function SciFiEngineer(props) {
  const m = useMaterials();
  const tablet = useTabletTexture();
  const coat = useCoat();

  const body = useRef(null);
  const chest = useRef(null);
  const head = useRef(null);
  const core = useRef(null);
  const halo = useRef(null);
  const rShoulder = useRef(null);
  const rElbow = useRef(null);
  const lShoulder = useRef(null);
  const eye = useRef(null);
  const coatRef = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const still = reduceMotion();
    const damp = (cur, target, speed = 4) => THREE.MathUtils.damp(cur, target, speed, delta);

    // Head and upper body turn toward the mouse
    const px = still ? 0 : state.pointer.x;
    const py = still ? 0 : state.pointer.y;
    head.current.rotation.y = damp(head.current.rotation.y, px * 0.7);
    head.current.rotation.x = damp(head.current.rotation.x, -py * 0.35);
    chest.current.rotation.y = damp(chest.current.rotation.y, px * 0.18, 2);

    if (still) return;

    // Idle: hover bob and breathing
    body.current.position.y = Math.sin(t * 1.2) * 0.05;
    chest.current.scale.y = 1 + Math.sin(t * 1.6) * 0.012;

    // Right arm swipes through the hologram
    rShoulder.current.rotation.x = -1.15 + Math.sin(t * 0.9) * 0.12;
    rShoulder.current.rotation.z = 0.42 + Math.sin(t * 0.9 + 0.6) * 0.22;
    rElbow.current.rotation.x = -0.55 + Math.sin(t * 1.8) * 0.12;

    // Left arm sways slightly while holding the tablet
    lShoulder.current.rotation.z = -0.18 + Math.sin(t * 0.8) * 0.03;

    // Coat sways a little, as if in a light breeze
    coatRef.current.rotation.y = Math.sin(t * 0.7) * 0.04;
    coatRef.current.rotation.x = Math.sin(t * 1.1) * 0.02;

    // Chest core pulses, halo turns, eye strip flickers
    const pulse = 1 + Math.sin(t * 3) * 0.12;
    core.current.scale.setScalar(pulse);
    halo.current.rotation.z += delta * 0.5;
    eye.current.visible = Math.sin(t * 0.7) > -0.995; // occasional blink
  });

  return (
    <group {...props}>
      <group ref={body}>
        {/* ---------- Legs ---------- */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.22 * s, -0.12, 0]} rotation={[0, 0, s * 0.03]}>
            <Limb length={0.62} radius={0.17} material={m.suit} />
            <mesh material={m.armor} position={[0, -0.45, 0.06]} scale={[1, 1.4, 0.8]}>
              <sphereGeometry args={[0.17, 24, 16]} />
            </mesh>
            <group position={[0, -0.98, 0]}>
              <mesh material={m.armor} position={[0, 0.02, 0.1]}>
                <sphereGeometry args={[0.14, 20, 16]} />
              </mesh>
              <Limb length={0.58} radius={0.15} material={m.armor} />
              <mesh material={m.cyan} position={[0, -0.45, 0.15]}>
                <boxGeometry args={[0.04, 0.32, 0.02]} />
              </mesh>
              <mesh material={m.suit} position={[0, -0.98, 0.07]}>
                <boxGeometry args={[0.3, 0.2, 0.5]} />
              </mesh>
              <mesh material={m.armor} position={[0, -0.9, 0.2]}>
                <boxGeometry args={[0.28, 0.08, 0.22]} />
              </mesh>
            </group>
          </group>
        ))}

        {/* ---------- Long coat ---------- */}
        <group ref={coatRef}>
          <mesh geometry={coat.shell} material={m.coat} />
          <mesh geometry={coat.left} material={m.violet} />
          <mesh geometry={coat.right} material={m.violet} />
          <mesh geometry={coat.hem} material={m.cyan} />
        </group>

        {/* ---------- Hips and belt ---------- */}
        <mesh material={m.suit} position={[0, -0.02, 0]} scale={[0.9, 0.55, 0.65]}>
          <sphereGeometry args={[0.42, 32, 16]} />
        </mesh>
        <mesh material={m.armor} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.72, 1]}>
          <torusGeometry args={[0.36, 0.05, 12, 48]} />
        </mesh>
        <mesh material={m.cyan} position={[0, 0.12, 0.27]}>
          <boxGeometry args={[0.14, 0.07, 0.03]} />
        </mesh>
        <mesh material={m.joint} position={[0, 0.38, 0]} scale={[1, 1, 0.75]}>
          <capsuleGeometry args={[0.29, 0.22, 8, 24]} />
        </mesh>

        {/* ---------- Upper body (turns slightly with the mouse) ---------- */}
        <group ref={chest} position={[0, 0.95, 0]}>
          <mesh material={m.armor} scale={[1.12, 1, 0.72]}>
            <capsuleGeometry args={[0.36, 0.36, 12, 32]} />
          </mesh>
          {/* Chest core */}
          <group position={[0, 0.08, 0.27]}>
            <mesh material={m.joint} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 32]} />
            </mesh>
            <group ref={core}>
              <mesh material={m.cyan} position={[0, 0, 0.03]}>
                <torusGeometry args={[0.11, 0.022, 12, 40]} />
              </mesh>
              <mesh material={m.cyan} position={[0, 0, 0.03]}>
                <sphereGeometry args={[0.055, 16, 16]} />
              </mesh>
            </group>
          </group>
          {/* Armour seams */}
          {[-1, 1].map((s) => (
            <mesh key={s} material={m.violet} position={[0.3 * s, -0.05, 0.19]} rotation={[0, 0, s * 0.15]}>
              <boxGeometry args={[0.025, 0.4, 0.02]} />
            </mesh>
          ))}
          {/* Collar */}
          <mesh material={m.joint} position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.06, 12, 32]} />
          </mesh>
          {/* Back pack with vents */}
          <mesh material={m.suit} position={[0, 0.05, -0.27]}>
            <boxGeometry args={[0.5, 0.55, 0.18]} />
          </mesh>
          {[-0.15, 0, 0.15].map((x) => (
            <mesh key={x} material={m.cyan} position={[x, 0.05, -0.37]}>
              <boxGeometry args={[0.05, 0.4, 0.02]} />
            </mesh>
          ))}

          {/* Right arm: raised, swiping the hologram */}
          <group ref={rShoulder} position={[0.52, 0.34, 0]} rotation={[-1.15, 0, 0.42]}>
            <mesh material={m.armor} position={[0.03, 0.06, 0]} scale={[1.15, 0.8, 1.1]}>
              <sphereGeometry args={[0.17, 24, 16]} />
            </mesh>
            <Limb length={0.42} radius={0.12} material={m.suit} />
            <group ref={rElbow} position={[0, -0.66, 0]} rotation={[-0.55, 0, 0]}>
              <mesh material={m.joint}>
                <sphereGeometry args={[0.12, 16, 16]} />
              </mesh>
              <Limb length={0.38} radius={0.12} material={m.armor} />
              <mesh material={m.cyan} position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.135, 0.015, 8, 32]} />
              </mesh>
              <mesh material={m.suit} position={[0, -0.66, 0]} scale={[0.9, 1.2, 0.6]}>
                <sphereGeometry args={[0.12, 16, 16]} />
              </mesh>
              {/* Glowing fingertip */}
              <mesh material={m.cyan} position={[0, -0.8, 0]}>
                <sphereGeometry args={[0.03, 12, 12]} />
              </mesh>
            </group>
          </group>

          {/* Left arm: bent, holding a data tablet */}
          <group ref={lShoulder} position={[-0.52, 0.34, 0]} rotation={[-0.25, 0, -0.18]}>
            <mesh material={m.armor} position={[-0.03, 0.06, 0]} scale={[1.15, 0.8, 1.1]}>
              <sphereGeometry args={[0.17, 24, 16]} />
            </mesh>
            <Limb length={0.42} radius={0.12} material={m.suit} />
            <group position={[0, -0.66, 0]} rotation={[-1.25, 0, 0.15]}>
              <mesh material={m.joint}>
                <sphereGeometry args={[0.12, 16, 16]} />
              </mesh>
              <Limb length={0.38} radius={0.12} material={m.armor} />
              <mesh material={m.suit} position={[0, -0.66, 0]} scale={[0.9, 1.2, 0.6]}>
                <sphereGeometry args={[0.12, 16, 16]} />
              </mesh>
              {/* Tablet in the hand, tilted toward the viewer */}
              <group position={[0.05, -0.72, 0.12]} rotation={[-0.5, 0, 0]}>
                <mesh material={m.joint}>
                  <boxGeometry args={[0.5, 0.025, 0.34]} />
                </mesh>
                <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.46, 0.3]} />
                  <meshBasicMaterial map={tablet} toneMapped={false} />
                </mesh>
              </group>
            </group>
          </group>

          {/* ---------- Neck and head (follows the mouse) ---------- */}
          <mesh material={m.joint} position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.11, 0.13, 0.22, 20]} />
          </mesh>
          <group ref={head} position={[0, 0.64, 0]} scale={0.84}>
            <group position={[0, 0.3, 0]} scale={[1, 1.12, 1.05]}>
              <mesh material={m.armor}>
                <sphereGeometry args={[0.34, 40, 32]} />
              </mesh>
              {/* Glass visor across the face */}
              <mesh material={m.visor}>
                <sphereGeometry args={[0.352, 40, 24, Math.PI / 2 - 0.95, 1.9, 0.95, 0.75]} />
              </mesh>
              {/* Glowing eye strip */}
              <mesh ref={eye} material={m.cyan}>
                <sphereGeometry args={[0.358, 40, 4, Math.PI / 2 - 0.7, 1.4, 1.28, 0.07]} />
              </mesh>
              {/* Crest ridge */}
              <mesh material={m.armor} position={[0, 0.3, 0.02]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.5]}>
                <capsuleGeometry args={[0.04, 0.2, 6, 12]} />
              </mesh>
              {/* Ear pods */}
              {[-1, 1].map((s) => (
                <group key={s} position={[0.34 * s, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh material={m.joint}>
                    <cylinderGeometry args={[0.11, 0.11, 0.1, 24]} />
                  </mesh>
                  <mesh material={s > 0 ? m.cyan : m.violet} position={[0, 0.055 * -s, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.07, 0.015, 8, 24]} />
                  </mesh>
                </group>
              ))}
              {/* Antenna */}
              <mesh material={m.joint} position={[0.3, 0.32, -0.05]} rotation={[0, 0, -0.35]}>
                <cylinderGeometry args={[0.012, 0.012, 0.36, 8]} />
              </mesh>
              <mesh material={m.violet} position={[0.36, 0.49, -0.05]}>
                <sphereGeometry args={[0.035, 12, 12]} />
              </mesh>
            </group>
            {/* Data halo behind the head */}
            <group position={[0, 0.34, -0.3]} rotation={[0.2, 0, 0]}>
              <group ref={halo}>
                <mesh material={m.violet}>
                  <torusGeometry args={[0.56, 0.012, 8, 64, Math.PI * 1.5]} />
                </mesh>
                <mesh material={m.cyan} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.64, 0.008, 8, 64, Math.PI * 0.8]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
