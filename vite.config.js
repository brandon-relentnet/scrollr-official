import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        background: 'src/background/index.js',
        popup: resolve(__dirname, "popup.html"),
        content: resolve(__dirname, "content.html"),
      },
      output: {
        entryFileNames: (chunk) => {
          // If it's background, put it at the root, otherwise use assets
          return chunk.name === 'background'
            ? '[name].js'
            : 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
