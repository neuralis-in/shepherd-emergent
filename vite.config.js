import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - set to '/' for custom domain or '/<repo-name>/' for github.io
  // Using mode-based detection: production builds for GH Pages use /shepherd/, dev uses /
  base: '/shepherd/',
})
