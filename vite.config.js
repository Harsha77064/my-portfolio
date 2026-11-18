import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site from https://harsha77064.github.io/my-portfolio/,
// so production builds need that sub-path. Local dev stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/my-portfolio/" : "/",
  plugins: [react(), tailwindcss()],
}));
