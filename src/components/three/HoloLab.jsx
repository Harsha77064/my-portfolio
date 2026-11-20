import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Neural network: glowing nodes in layers, with signals firing       */
/* forward along the connections like a live forward pass.            */
/* ------------------------------------------------------------------ */

const LAYERS = [3, 5, 5, 2];
const PULSES = 12;

export function NeuralNetwork(props) {
  const { nodes, layerIndex, edgeGeometry } = useMemo(() => {
    const nodes = [];
    const layerIndex = [];
    LAYERS.forEach((count, l) => {
      const ids = [];
      for (let i = 0; i < count; i++) {
        ids.push(nodes.length);
        nodes.push(new THREE.Vector3(l * 0.8 - 1.2, (i - (count - 1) / 2) * 0.42, 0));
      }
      layerIndex.push(ids);
    });
    const pts = [];
    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (const a of layerIndex[l]) for (const b of layerIndex[l + 1]) pts.push(nodes[a], nodes[b]);
    }
    return { nodes, layerIndex, edgeGeometry: new THREE.BufferGeometry().setFromPoints(pts) };
  }, []);

  const nodeRefs = useRef([]);
  const pulseRefs = useRef([]);
  const pulses = useRef(null);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const startPulse = (p) => {
    p.layer = 0;
    p.from = pick(layerIndex[0]);
    p.to = pick(layerIndex[1]);
    p.t = -Math.random() * 1.5; // stagger the starts
  };

  useFrame((_, delta) => {
    if (!pulses.current) {
      pulses.current = Array.from({ length: PULSES }, () => ({}));
      pulses.current.forEach(startPulse);
    }
    const still = reduceMotion();

    pulses.current.forEach((p, i) => {
      const mesh = pulseRefs.current[i];
      if (still) {
        mesh.visible = false;
        return;
      }
      p.t += delta * 1.6;
      if (p.t >= 1) {
        nodeRefs.current[p.to].scale.setScalar(1.9); // flash the node it reached
        if (p.layer + 2 < LAYERS.length) {
          p.layer += 1;
          p.from = p.to;
          p.to = pick(layerIndex[p.layer + 1]);
          p.t = 0;
        } else {
          startPulse(p);
        }
      }
      mesh.visible = p.t >= 0;
      if (p.t >= 0) mesh.position.lerpVectors(nodes[p.from], nodes[p.to], p.t);
    });

    nodeRefs.current.forEach((n) => n.scale.setScalar(THREE.MathUtils.damp(n.scale.x, 1, 5, delta)));
  });

  return (
    <group {...props}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={CYAN} transparent opacity={0.22} toneMapped={false} />
      </lineSegments>
      {nodes.map((pos, i) => (
        <mesh key={i} ref={(el) => (nodeRefs.current[i] = el)} position={pos}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color={i >= nodes.length - LAYERS.at(-1) ? VIOLET : CYAN} toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: PULSES }, (_, i) => (
        <mesh key={i} ref={(el) => (pulseRefs.current[i] = el)} visible={false}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#ecfeff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic screens drawn with a 2D canvas (no font downloads).    */
/* ------------------------------------------------------------------ */

function drawFrame(g, w, h, title) {
  g.fillStyle = "rgba(10, 30, 60, 0.55)";
  g.fillRect(0, 0, w, h);
  g.strokeStyle = CYAN;
  g.lineWidth = 3;
  g.strokeRect(2, 2, w - 4, h - 4);
  g.fillStyle = "rgba(34, 211, 238, 0.18)";
  g.fillRect(2, 2, w - 4, 44);
  g.fillStyle = "#e0fbff";
  g.font = "bold 24px Consolas, ui-monospace, monospace";
  g.fillText(title, 16, 32);
}

function makeTexture(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const drawTraining = (g, w, h) => {
  drawFrame(g, w, h, "model.fit()   epoch 48/50");
  // grid
  g.strokeStyle = "rgba(34, 211, 238, 0.15)";
  g.lineWidth = 1;
  for (let x = 40; x < w; x += 50) g.strokeRect(x, 60, 0, h - 120);
  for (let y = 80; y < h - 50; y += 40) g.strokeRect(30, y, w - 60, 0);
  // loss (falling) and accuracy (rising) curves
  const curve = (fn, color) => {
    g.strokeStyle = color;
    g.lineWidth = 4;
    g.beginPath();
    for (let i = 0; i <= 100; i++) {
      const x = 30 + (i / 100) * (w - 60);
      const y = fn(i / 100);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  };
  const top = 70;
  const span = h - 140;
  curve((t) => top + span * (1 - Math.exp(-4 * t) * 0.9 - 0.05 + Math.sin(t * 40) * 0.01), CYAN);
  curve((t) => top + span * (Math.exp(-4 * t) * 0.85 + 0.05 + Math.sin(t * 50) * 0.012), VIOLET);
  g.font = "bold 22px Consolas, ui-monospace, monospace";
  g.fillStyle = CYAN;
  g.fillText("val_acc 0.942", 30, h - 22);
  g.fillStyle = VIOLET;
  g.fillText("loss 0.081", w - 180, h - 22);
};

const drawCode = (g, w, h) => {
  drawFrame(g, w, h, "rag_pipeline.py");
  const lines = [
    ["#c4b5fd", "docs = load_corpus(\"./papers\")"],
    ["#e0fbff", "index = FAISS.from_documents("],
    ["#e0fbff", "    docs, embeddings)"],
    ["#c4b5fd", "llm = Gemini(model=\"pro\")"],
    ["#e0fbff", "qa = RetrievalQA(llm, index)"],
    ["#67e8f9", "qa.ask(\"What changed in v2?\")"],
    ["#86efac", "> answered in 1.4s  [3 cites]"],
  ];
  g.font = "20px Consolas, ui-monospace, monospace";
  lines.forEach(([color, text], i) => {
    g.fillStyle = "rgba(224, 251, 255, 0.35)";
    g.fillText(String(i + 1).padStart(2, " "), 14, 82 + i * 30);
    g.fillStyle = color;
    g.fillText(text, 50, 82 + i * 30);
  });
};

function HoloPanel({ draw, size, width, height, ...props }) {
  const texture = useMemo(() => makeTexture(draw, width, height), [draw, width, height]);
  const mat = useRef(null);
  useFrame((state) => {
    if (reduceMotion()) return;
    // faint hologram flicker
    mat.current.opacity = 0.82 + Math.sin(state.clock.elapsedTime * 9) * 0.04 + (Math.random() < 0.01 ? -0.3 : 0);
  });
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial
          ref={mat}
          map={texture}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function HoloPanels() {
  return (
    <>
      <Float speed={1.6} floatIntensity={0.5} rotationIntensity={0.1}>
        <HoloPanel draw={drawTraining} width={512} height={320} size={[1.9, 1.19]} position={[-2.35, 1.35, 0.1]} rotation={[0, 0.45, 0]} />
      </Float>
      <Float speed={1.3} floatIntensity={0.5} rotationIntensity={0.1}>
        <HoloPanel draw={drawCode} width={512} height={290} size={[1.75, 0.99]} position={[-2.2, -0.35, 0.5]} rotation={[0, 0.5, 0]} />
      </Float>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hover platform with turning light rings                             */
/* ------------------------------------------------------------------ */

export function Platform(props) {
  const inner = useRef(null);
  const outer = useRef(null);
  useFrame((_, delta) => {
    if (reduceMotion()) return;
    inner.current.rotation.z += delta * 0.6;
    outer.current.rotation.z -= delta * 0.3;
  });
  return (
    <group {...props}>
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 0.14, 64]} />
        <meshStandardMaterial color="#141830" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.02, 8, 96]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <mesh ref={inner}>
          <ringGeometry args={[0.85, 0.9, 64, 1, 0, Math.PI * 1.5]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.8} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={outer}>
          <ringGeometry args={[1.02, 1.06, 64, 1, 0, Math.PI * 0.7]} />
          <meshBasicMaterial color={VIOLET} transparent opacity={0.9} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        {/* soft glow pool under the feet */}
        <mesh>
          <circleGeometry args={[0.8, 48]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.12} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
