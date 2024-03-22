import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [vue({ source: ['src'] })],
  ssr: {
    external: ['mock-aws-s3', 'aws-sdk', 'nock', 'argon2']
  }
})
