import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // 3000 is reserved for another local app — Quizzy always develops on 3001.
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    // react's vite plugin must come after start's vite plugin
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});

