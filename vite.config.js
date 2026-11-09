import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      inspector: true,
      // Force runes mode for our own components, but leave node_modules alone.
      dynamicCompileOptions({ filename }) {
        if (!filename.includes("node_modules")) {
          return { runes: true };
        }
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
    },
  },
});
