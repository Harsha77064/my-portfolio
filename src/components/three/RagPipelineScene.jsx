import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";

/*
 * A 3D picture of the RAG systems from my AI Engineer role: documents are
 * chunked into embeddings, stored in a vector database, retrieved into an
 * LLM (Gemini / GPT-4) and returned as a cited answer in under 2 seconds.
 * Glowing packets of data travel down the pipeline the whole time.
 */

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const PINK = "#f472b6";
const GREEN = "#4ade80";

// Where each stage sits; the data path runs through these points in order
const STAGES = {
  docs: new THREE.Vector3(-1.15, 3.0, 0),
  embed: new THREE.Vector3(1.05, 1.45, 0.2),
  vector: new THREE.Vector3(-1.0, -0.15, 0),
  llm: new THREE.Vector3(1.0, -1.85, 0.2),
  answer: new THREE.Vector3(-0.55, -3.45, 0.3),
};

// Repeatable pseudo-random numbers, so the embedding cloud looks the same on every render
const rand = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Label({ children, position, color = CYAN }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div
        className="rounded-full border bg-[#0b0f1a]/80 px-3 py-1 text-xs font-semibold whitespace-nowrap backdrop-blur"
        style={{ borderColor: `${color}80`, color }}
      >
        {children}
      </div>
    </Html>
  );
}

function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* 1. Documents: a fanned stack of pages that gently flip */
function Documents() {
  const pages = useRef([]);
  const texture = useMemo(
    () =>
      canvasTexture(160, 210, (g, w, h) => {
        g.fillStyle = "#e9edf7";
        g.fillRect(0, 0, w, h);
        g.fillStyle = "#6d28d9";
        g.fillRect(16, 18, 90, 12);
        g.fillStyle = "#94a3b8";
        for (let y = 46; y < h - 16; y += 14) g.fillRect(16, y, w - 32 - (y % 3) * 14, 6);
      }),
    []
  );
  useFrame((state) => {
    if (reduceMotion()) return;
    const t = state.clock.elapsedTime;
    pages.current.forEach((p, i) => {
      p.rotation.y = -0.5 + i * 0.28 + Math.sin(t * 1.2 + i) * 0.12;
      p.position.y = Math.sin(t * 1.5 + i * 0.8) * 0.06;
    });
  });
  return (
    <group position={STAGES.docs}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (pages.current[i] = el)} position={[i * 0.18 - 0.18, 0, -i * 0.1]} rotation={[0, -0.5 + i * 0.28, 0]}>
          <boxGeometry args={[0.62, 0.82, 0.015]} />
          <meshStandardMaterial map={texture} roughness={0.6} />
        </mesh>
      ))}
      <Label position={[0, -0.72, 0]} color="#e9edf7">500+ page corpus</Label>
    </group>
  );
}

/* 2. Embeddings: a slowly spinning cloud of vectors */
function Embeddings() {
  const group = useRef(null);
  const points = useMemo(() => {
    const out = [];
    for (let i = 0; i < 70; i++) {
      // three loose clusters, like semantically similar chunks
      const c = [new THREE.Vector3(-0.3, 0.2, 0), new THREE.Vector3(0.35, 0.15, 0.1), new THREE.Vector3(0, -0.3, -0.1)][i % 3];
      out.push({
        pos: c.clone().add(new THREE.Vector3((rand(i) - 0.5) * 0.5, (rand(i + 100) - 0.5) * 0.5, (rand(i + 200) - 0.5) * 0.5)),
        color: [CYAN, VIOLET, PINK][i % 3],
      });
    }
    return out;
  }, []);
  useFrame((_, delta) => {
    if (!reduceMotion()) group.current.rotation.y += delta * 0.5;
  });
  return (
    <group position={STAGES.embed}>
      <group ref={group}>
        {points.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <boxGeometry args={[0.055, 0.055, 0.055]} />
            <meshBasicMaterial color={p.color} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <Label position={[0, -0.72, 0]} color={VIOLET}>Embeddings</Label>
    </group>
  );
}

/* 3. Vector database: stacked disks with scanning rings */
function VectorDB() {
  const rings = useRef([]);
  useFrame((state) => {
    if (reduceMotion()) return;
    const t = state.clock.elapsedTime;
    rings.current.forEach((r, i) => {
      const k = (t * 0.6 + i / 3) % 1;
      r.position.y = -0.45 + k * 0.9;
      r.material.opacity = Math.sin(k * Math.PI) * 0.9;
    });
  });
  return (
    <group position={STAGES.vector}>
      {[-0.32, 0, 0.32].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.24, 48]} />
            <meshStandardMaterial color="#2e3a78" metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.121, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.44, 0.5, 48]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          {[-0.2, 0, 0.2].map((x) => (
            <mesh key={x} position={[x, 0, 0.47]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color={GREEN} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.01, 8, 64]} />
          <meshBasicMaterial color={CYAN} transparent toneMapped={false} />
        </mesh>
      ))}
      <Label position={[0, -0.78, 0]}>FAISS vector store</Label>
    </group>
  );
}

/* 4. LLM core: a glowing crystal inside a wireframe shell with orbit rings */
function LlmCore() {
  const shell = useRef(null);
  const core = useRef(null);
  const orbit = useRef(null);
  useFrame((state, delta) => {
    if (reduceMotion()) return;
    const t = state.clock.elapsedTime;
    shell.current.rotation.y += delta * 0.4;
    shell.current.rotation.x += delta * 0.2;
    core.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    orbit.current.rotation.z += delta * 0.9;
  });
  return (
    <group position={STAGES.llm}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.8} flatShading toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.56, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <group rotation={[1.2, 0.3, 0]}>
        <group ref={orbit}>
          <mesh>
            <torusGeometry args={[0.8, 0.012, 8, 80]} />
            <meshBasicMaterial color={PINK} toneMapped={false} />
          </mesh>
          <mesh position={[0.8, 0, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#fdf2f8" toneMapped={false} />
          </mesh>
        </group>
      </group>
      <pointLight color={VIOLET} intensity={6} distance={3} />
      <Label position={[0, -0.9, 0]} color={VIOLET}>Gemini · GPT-4</Label>
    </group>
  );
}

/* 5. Answer: a holographic card with the result */
function Answer() {
  const texture = useMemo(
    () =>
      canvasTexture(420, 200, (g, w, h) => {
        g.fillStyle = "rgba(10, 40, 30, 0.6)";
        g.fillRect(0, 0, w, h);
        g.strokeStyle = GREEN;
        g.lineWidth = 4;
        g.strokeRect(2, 2, w - 4, h - 4);
        g.fillStyle = GREEN;
        g.font = "bold 34px Consolas, ui-monospace, monospace";
        g.fillText("✓ Answer  1.4s", 22, 56);
        g.fillStyle = "rgba(220, 252, 231, 0.75)";
        for (let y = 86; y < 150; y += 20) g.fillRect(22, y, w - 60 - (y % 40), 9);
        g.fillStyle = CYAN;
        g.font = "22px Consolas, ui-monospace, monospace";
        g.fillText("[1] [2] [3] cited sources", 22, h - 22);
      }),
    []
  );
  return (
    <group position={STAGES.answer}>
      <Float speed={2} floatIntensity={0.4} rotationIntensity={0.2}>
        <mesh rotation={[0, 0.3, 0]}>
          <planeGeometry args={[1.5, 0.71]} />
          <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </Float>
      <Label position={[0, -0.6, 0]} color={GREEN}>Under 2 seconds</Label>
    </group>
  );
}

/* The data path and the packets travelling along it */
function DataFlow() {
  const { curve, tube } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(Object.values(STAGES), false, "catmullrom", 0.5);
    return { curve, tube: new THREE.TubeGeometry(curve, 200, 0.012, 6, false) };
  }, []);
  const packets = useRef([]);
  const COUNT = 14;
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    packets.current.forEach((p, i) => {
      const k = reduceMotion() ? i / COUNT : (t * 0.09 + i / COUNT) % 1;
      p.position.copy(curve.getPointAt(k));
      // packets change colour as they move through the pipeline
      p.material.color.set(k < 0.25 ? "#e9edf7" : k < 0.5 ? VIOLET : k < 0.75 ? CYAN : GREEN);
    });
  });
  return (
    <>
      <mesh geometry={tube}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.25} toneMapped={false} />
      </mesh>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} ref={(el) => (packets.current[i] = el)}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

export default function RagPipelineScene() {
  const group = useRef(null);
  const { width, height } = useThree((s) => s.viewport);
  const fit = Math.min(1, height / 8.4, width / 4.4);

  // Lean the whole pipeline gently toward the mouse
  useFrame((state, delta) => {
    if (reduceMotion()) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.35, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.12, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 6]} intensity={2} />
      <pointLight position={[-3, 0, 3]} intensity={20} color={CYAN} />
      <group ref={group} scale={fit}>
        <Documents />
        <Embeddings />
        <VectorDB />
        <LlmCore />
        <Answer />
        <DataFlow />
      </group>
    </>
  );
}
