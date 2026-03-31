#!/usr/bin/env bun
/**
 * Batch-append i18n entries to en-US.json (or any locale file).
 *
 * Usage:
 *   bun scripts/append-i18n.ts '{"key.one":"Value one","key.two":"Value two"}'
 *   bun scripts/append-i18n.ts --file entries.json
 *   bun scripts/append-i18n.ts --locale zh-CN '{"key.one":"值一"}'
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const args = process.argv.slice(2)

let locale = 'en-US'
let input: Record<string, string> = {}

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--locale' && args[i + 1]) {
    locale = args[++i]
  } else if (args[i] === '--file' && args[i + 1]) {
    const raw = readFileSync(resolve(args[++i]), 'utf-8')
    Object.assign(input, JSON.parse(raw))
  } else if (args[i].startsWith('{')) {
    Object.assign(input, JSON.parse(args[i]))
  }
}

if (Object.keys(input).length === 0) {
  console.error('No entries provided. Pass a JSON object or --file <path>.')
  process.exit(1)
}

const localePath = resolve(__dirname, '..', 'src', 'i18n', 'locales', `${locale}.json`)
const existing: Record<string, string> = JSON.parse(readFileSync(localePath, 'utf-8') || '{}')

const merged = { ...existing, ...input }

// Sort keys alphabetically for consistent diffs
const sorted: Record<string, string> = {}
for (const key of Object.keys(merged).sort()) {
  sorted[key] = merged[key]
}

writeFileSync(localePath, JSON.stringify(sorted, null, 2) + '\n', 'utf-8')

const newCount = Object.keys(input).filter(k => !(k in existing)).length
const updateCount = Object.keys(input).filter(k => k in existing).length
console.log(`✓ ${locale}: +${newCount} new, ${updateCount} updated, ${Object.keys(sorted).length} total`)
