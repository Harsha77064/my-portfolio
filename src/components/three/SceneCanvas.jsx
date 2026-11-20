import { lazy, Suspense, useRef } from "react";
import { useInView } from "motion/react";

const CanvasInner = lazy(() => import("./CanvasInner"));

/**
 * A three.js canvas that only mounts once it's near the screen and stops
 * rendering while it's scrolled away, so several 3D scenes on one page
 * don't fight over the GPU.
 */
export default function SceneCanvas({ children, className = "", ...props }) {
  const box = useRef(null);
  // `once` keeps this true after the first time, so the canvas stays mounted
  const mounted = useInView(box, { margin: "300px 0px", once: true });
  const visible = useInView(box, { margin: "100px 0px" });

  return (
    <div ref={box} className={className}>
      {mounted && (
        <Suspense fallback={null}>
          <CanvasInner visible={visible} {...props}>
            {children}
          </CanvasInner>
        </Suspense>
      )}
    </div>
  );
}
