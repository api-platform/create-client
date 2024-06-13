import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/cli.ts"],
  splitting: true,
  clean: true,
  minify: !options.watch,
  outDir: "dist",
  dts: true,
  target: "node18",
  shims: true,
  format: ["cjs", "esm"],
}));
