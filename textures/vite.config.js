export default {
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true,
  },
  build: {
    emptyOutDir: true,
    outDir: "../dist",
    sourcemap: true,
  },
};
