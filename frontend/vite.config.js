import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars for the current mode (development | production)
  // The second argument is the project root; the third restricts to VITE_ prefixed vars.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    define: {
      // Statically replace import.meta.env.VITE_API_URL at build time.
      // In development Vite does this automatically; the define ensures parity
      // and makes the substitution explicit and auditable.
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
  }
})
