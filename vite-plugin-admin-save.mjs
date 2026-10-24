import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Dev-only Vite middleware that persists Admin edits to src/data/exhibits.json.
// In production builds this plugin is not registered (apply: 'serve'),
// so /api/admin/save is a 404 and no filesystem write path exists.
export default function adminSavePlugin() {
  return {
    name: 'admin-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/admin/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const payload = JSON.parse(body)
            const editedExhibit = payload.exhibit
            if (!editedExhibit || !editedExhibit.id) {
              throw new Error('Missing exhibit.id in payload')
            }

            const targetPath = resolve(process.cwd(), 'src/data/exhibits.json')
            if (!existsSync(targetPath)) {
              throw new Error('exhibits.json not found at ' + targetPath)
            }

            const current = JSON.parse(readFileSync(targetPath, 'utf8'))
            const idx = current.findIndex((ex) => ex.id === editedExhibit.id)
            if (idx >= 0) {
              current[idx] = editedExhibit
            } else {
              current.push(editedExhibit)
            }

            writeFileSync(targetPath, JSON.stringify(current, null, 2) + '\n')

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: String(err) }))
          }
        })
      })
    },
  }
}
