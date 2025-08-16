import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
      // interval: 1000, didn't work for the browser reload issue
    },
    // hmr: { didn't work for the browser reload issue
    //   overlay: true,
    //   clientPort: 3000, // Add this for Docker
    // },
  },
});
