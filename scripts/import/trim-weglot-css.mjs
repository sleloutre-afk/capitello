/**
 * Import initial (après build-assets.mjs) : ne garde des CSS Weglot que les
 * règles des 4 langues du site et auto-héberge leurs drapeaux
 * (public/flags) au lieu de les charger depuis cdn.weglot.com.
 *
 *   node scripts/import/trim-weglot-css.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const DIR = path.join(ROOT, 'src/styles/legacy')
const KEEP = new Set(['fr', 'en', 'es', 'zh'])

mkdirSync(path.join(ROOT, 'public/flags'), { recursive: true })
for (const file of readdirSync(DIR).filter((f) => /weglot/.test(f) && !f.startsWith('._'))) {
  const css = readFileSync(path.join(DIR, file), 'utf8')
  const [banner, ...rest] = css.split('\n')
  const body = rest.join('\n')
  // Découpe en règles de premier niveau (les blocs @media sont gardés entiers).
  const rules = []
  let depth = 0
  let start = 0
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '{') depth++
    else if (body[i] === '}' && --depth === 0) {
      rules.push(body.slice(start, i + 1))
      start = i + 1
    }
  }
  const kept = rules.filter((rule) => {
    const selector = rule.slice(0, rule.indexOf('{'))
    if (selector.trim().startsWith('@')) return true
    const selectors = selector.split(',').filter((s) => {
      const langs = [...s.matchAll(/\.wg-([a-z0-9-]+)/g)].map((m) => m[1])
      return langs.every((l) => KEEP.has(l))
    })
    return selectors.length > 0
  })
  let out = kept
    .map((rule) => {
      const idx = rule.indexOf('{')
      const selectors = rule
        .slice(0, idx)
        .split(',')
        .filter((s) => [...s.matchAll(/\.wg-([a-z0-9-]+)/g)].every((m) => KEEP.has(m[1])))
      return rule.trim().startsWith('@') ? rule : selectors.join(',') + rule.slice(idx)
    })
    .join('\n')
  for (const url of new Set([...out.matchAll(/https:\/\/cdn\.weglot\.com\/flags\/([a-z_]+)\/([a-z-]+\.svg)/g)].map((m) => m[0]))) {
    const name = url.split('/').slice(-2).join('-')
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    writeFileSync(path.join(ROOT, 'public/flags', name), Buffer.from(await res.arrayBuffer()))
    out = out.split(url).join(`/flags/${name}`)
  }
  writeFileSync(path.join(DIR, file), `${banner}\n${out.trim()}\n`)
  console.log(file, css.length, '→', out.length)
}
