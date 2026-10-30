import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base must stay absolute ('/'): BrowserRouter deep links like /archive/dream
// resolve against the site root, and a relative base would break them on any
// non-root path.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
})
