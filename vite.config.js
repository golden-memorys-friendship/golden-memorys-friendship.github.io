import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bond: resolve(__dirname, 'bond.html'),
        memories: resolve(__dirname, 'memories.html'),
        connect: resolve(__dirname, 'connect.html')
      }
    }
  }
})
