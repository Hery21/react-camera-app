import react from '@vitejs/plugin-react'
import adminSavePlugin from './vite-plugin-admin-save.mjs'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminSavePlugin()],
})
