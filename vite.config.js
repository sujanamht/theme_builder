import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function writeThemePlugin() {
  return {
    name: 'write-theme',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/write-theme', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const themePath = path.resolve(__dirname, 'src/data/theme.json')
            fs.writeFileSync(themePath, body, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: e.message }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), writeThemePlugin()],
})
