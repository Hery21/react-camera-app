import { exhibits } from '../src/data/exhibits.js'
import { writeFileSync } from 'node:fs'

writeFileSync('src/data/exhibits.json', JSON.stringify(exhibits, null, 2) + '\n')
console.log('Migrated ' + exhibits.length + ' exhibits to src/data/exhibits.json')
