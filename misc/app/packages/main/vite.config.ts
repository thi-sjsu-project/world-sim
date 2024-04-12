import { builtinModules } from "module";
import { defineConfig } from "vite";
import typescript from "rollup-plugin-typescript2";
import react from "@vitejs/plugin-react";
import pkg from "../../package.json";

export default defineConfig({
  root: __dirname,
  build: {
    outDir: "../../dist/main",
    lib: {
      entry: "index.ts",
      formats: ["cjs"],
      fileName: () => "[name].cjs",
    },
    minify: process.env./* from mode option */ NODE_ENV === "production",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "electron",
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {}),
      ],
      plugins: [
        react(),
        typescript(),
      ]
    },
  },
});
