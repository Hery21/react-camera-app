import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir, depth = 0) {
  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      console.log(' '.repeat(depth * 2) + '📁 ' + file + '/')
      walk(fullPath, depth + 1)
    } else {
      const sizeKb = (stat.size / 1024).toFixed(1)
      console.log(' '.repeat(depth * 2) + '📄 ' + file + ' (' + sizeKb + ' KB)')
    }
  }
}

console.log('=== Public Assets ===')
walk('public')
