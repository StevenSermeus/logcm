import { defineConfig } from "tsup";
import glob from "tiny-glob";

export default defineConfig({
  entry: await glob("./src/**/!(*.d|*.spec|*.test.ts|dev.ts).ts"),

  sourcemap: true,
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  ignoreWatch: ["**/node_modules/**"],
});
