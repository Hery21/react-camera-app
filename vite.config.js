import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import adminSavePlugin from './vite-plugin-admin-save.mjs'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    adminSavePlugin(),
    legacy({
      // Emit a SystemJS legacy bundle for browsers that cannot parse modern
      // ES2020 syntax. iOS 12 / Safari 12 gets the legacy chunk via
      // <script nomodule>, modern browsers get the standard ESM chunk.
      targets: ['ios >= 12', 'safari >= 12'],
      renderLegacyChunks: true,
    }),
  ],
})
