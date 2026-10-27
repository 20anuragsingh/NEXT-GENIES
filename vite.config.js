import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_URL || 'https://nextgenies-com-161441.hostingersite.com'

  const apiProxy = {
    '/api': {
      target,
      changeOrigin: true,
      secure: false,
    },
    '/uploads': {
      target,
      changeOrigin: true,
      secure: false,
    },
  }

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: apiProxy,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      proxy: apiProxy,
    },
  }
})
