import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["export/index.ts"],
    outDir: "dist",
    format: ["cjs", "esm"],
    dts: false,
    treeshake: true,
    clean: true,
  },
]);
