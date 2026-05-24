import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { routeStubs } from "./vite-plugins/route-stubs";
import { getAllPrerenderRoutes } from "./src/lib/seo";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), routeStubs(getAllPrerenderRoutes())],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
