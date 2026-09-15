import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // @vitejs/plugin-react resolves its own nested `vite` types, which don't
  // structurally match the top-level `vite` types vitest/config re-exports;
  // the cast is a type-only workaround for that dependency skew.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see comment above
  plugins: [react()] as any,
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
