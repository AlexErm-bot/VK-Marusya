import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import path from 'node:path'

const styleDir = fileURLToPath(new URL("./src/style", import.meta.url))

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "mixins" as *;`,
        loadPaths: [path.resolve(__dirname, 'src/style')],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})