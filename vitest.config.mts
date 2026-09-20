import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Astro compiles JSX for the app build; Vitest runs outside that pipeline and
  // needs its own transform for the component tests.
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // motion/react pulls framer-motion, which pnpm can resolve to a second
    // React instance — its hooks then read a null dispatcher. Pin both to one
    // copy so components using motion can be tested at all.
    dedupe: ["react", "react-dom"],
  },
  test: {
    // Pure-logic tests stay on the fast node environment. Component tests opt
    // into a DOM with a `@vitest-environment happy-dom` docblock — Vitest 4
    // removed `environmentMatchGlobs`, and the docblock is per-file explicit.
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./src/tests/setup.ts"],
  },
});
