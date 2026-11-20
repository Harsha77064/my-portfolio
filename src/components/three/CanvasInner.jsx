import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

// The three.js renderer itself; split out so it downloads only when a scene is near the screen
export default function CanvasInner({ children, visible, camera, fallback = null, ...props }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={visible ? "always" : "never"}
      camera={camera}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Dev only: lets the browser console grab a frame of each scene
      onCreated={
        import.meta.env.DEV ? (state) => (window.__scenes = [...(window.__scenes || []), state]) : undefined
      }
      {...props}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </Canvas>
  );
}
