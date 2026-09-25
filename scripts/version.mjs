#!/usr/bin/env node
// Sætter et nyt versionsnummer på stilark og program i docs/index.html,
// så browsere henter de nye filer efter hver ændring.
// Kør med: node scripts/version.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const fil = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'index.html')
const v = new Date().toISOString().replace(/\D/g, '').slice(0, 12)
const html = readFileSync(fil, 'utf8')
  .replace(/assets\/css\/style\.css(\?v=\d+)?/, 'assets/css/style.css?v=' + v)
  .replace(/assets\/js\/app\.js(\?v=\d+)?/, 'assets/js/app.js?v=' + v)
writeFileSync(fil, html)
console.log('Version ' + v)
