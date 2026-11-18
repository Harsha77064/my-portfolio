import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <div className="h-screen bg-black">
      <h1 className="absolute z-10 w-full text-center text-3xl font-bold text-white mt-6">
        Portfolio is working
      </h1>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}