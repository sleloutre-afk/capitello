/**
 * Import initial des feuilles de style, polices et fichiers du site
 * WordPress d'origine (../reference/original-site) :
 *  - src/styles/legacy/NN-*.css : les CSS d'origine, dans leur ordre de
 *    chargement, avec les URL réécrites en chemins locaux ;
 *  - public/fonts : polices Google auto-hébergées (plus d'appel à Google) ;
 *  - public/wp-content : images, PDF et vidéos référencés par les pages,
 *    aux mêmes adresses que sur l'ancien site.
 *
 *   node scripts/import/build-assets.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, statSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const REF = path.resolve(ROOT, '../reference/original-site')
const OUT_CSS = path.join(ROOT, 'src/styles/legacy')
const PUBLIC = path.join(ROOT, 'public')
const PAGES = ['home', 'le-mot-du-president', 'qui-sommes-nous', 'communiques-de-presse', 'dans-les-medias']
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

// Styles en ligne de WordPress sans effet sur le rendu du site public.
const SKIP_INLINE = new Set(['wp-emoji-styles-inline-css', 'wp-block-template-skip-link-inline-css'])

const refFile = (url) => {
  const u = new URL(url, 'https://capitello.fr')
  return path.join(REF, 'files', decodeURIComponent(u.pathname))
}
const localUrl = (css) => css.replace(/https?:\/\/(www\.)?capitello\.fr\/(wp-content|wp-includes)\//g, '/$2/')

/** Ordre de chargement des styles, fusionné sur les 5 pages. */
function collectStyles() {
  const order = []
  const byKey = new Map()
  for (const page of PAGES) {
    const $ = cheerio.load(readFileSync(path.join(REF, 'html', `fr-${page}.html`), 'utf8'))
    let last = -1
    $('link[rel="stylesheet"], style').each((_, el) => {
      let key, entry
      if (el.name === 'link') {
        const href = $(el).attr('href')
        if (href.includes('fonts.googleapis.com')) return
        key = new URL(href).pathname
        entry = { key, kind: 'file', href }
      } else {
        const id = $(el).attr('id') || ''
        const css = $(el).html()
        if (SKIP_INLINE.has(id)) return
        // Règle de « lazy-load » des images de fond d'Elementor : dépend de son
        // JS, sans effet visuel une fois la page chargée.
        if (css.includes('e-lazyloaded')) return
        key = id || 'inline-' + crypto.createHash('md5').update(css).digest('hex').slice(0, 8)
        entry = { key, kind: 'inline', css, id }
      }
      if (byKey.has(key)) {
        last = order.indexOf(key)
        return
      }
      byKey.set(key, entry)
      order.splice(last + 1, 0, key)
      last += 1
    })
  }
  return order.map((k) => byKey.get(k))
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

/** Télécharge les polices Google utilisées et renvoie le CSS @font-face local. */
async function googleFonts() {
  const sheets = [
    'https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap',
    'https://fonts.googleapis.com/css?family=Roboto:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&display=swap',
    'https://fonts.googleapis.com/css?family=Roboto+Slab:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&display=swap',
  ]
  mkdirSync(path.join(PUBLIC, 'fonts'), { recursive: true })
  let out = ''
  for (const sheet of sheets) {
    let css = await fetchText(sheet)
    const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]))]
    for (const url of urls) {
      const name = url.split('/').slice(-3).join('-')
      const dest = path.join(PUBLIC, 'fonts', name)
      if (!existsSync(dest)) {
        const res = await fetch(url, { headers: { 'User-Agent': UA } })
        if (!res.ok) throw new Error(`${res.status} ${url}`)
        writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
      }
      css = css.split(url).join(`/fonts/${name}`)
    }
    out += css + '\n'
  }
  return out
}

const used = new Set()
function trackUrls(text) {
  for (const m of text.matchAll(/\/wp-content\/[^\s"'()<>,]+/g)) used.add(decodeURIComponent(m[0].split('?')[0]))
}

async function main() {
  rmSync(OUT_CSS, { recursive: true, force: true })
  mkdirSync(OUT_CSS, { recursive: true })

  const files = []
  const write = (name, banner, css) => {
    const n = String(files.length).padStart(2, '0')
    const file = `${n}-${name}.css`
    css = localUrl(css)
      .replace(/@import\s+url\([^)]*fonts\.googleapis\.com[^)]*\);?/g, '')
      .replace(/\/\*# sourceURL=.*?\*\//g, '')
      // Règle vide sans sélecteur dans le CSS du kit Elementor (invalide).
      .replace(/\}\{\}/g, '}')
    trackUrls(css)
    writeFileSync(path.join(OUT_CSS, file), `/* Origine : ${banner} */\n${css.trim()}\n`)
    files.push(file)
  }

  write('google-fonts', 'Google Fonts (auto-hébergées dans /public/fonts)', await googleFonts())
  for (const entry of collectStyles()) {
    if (entry.kind === 'file') {
      const src = refFile(entry.href)
      const name = entry.key
        .replace(/^\/wp-(content|includes)\//, '')
        .replace(/\.(min\.)?css$/, '')
        .replace(/^plugins\//, '')
        .replace(/^uploads\/elementor\/css\//, 'elementor-')
        .replace(/\/(assets|dist|css|lib|conditionals|v8)(?=\/)/g, '')
        .replace(/[^a-z0-9]+/gi, '-')
      write(name, entry.key, readFileSync(src, 'utf8'))
    } else {
      const name = (entry.id || 'theme-custom').replace(/-inline-css$/, '').replace(/[^a-z0-9]+/gi, '-')
      write(name.startsWith('theme-custom') ? `custom-${entry.key.slice(-8)}` : name, `<style id="${entry.id}"> (en ligne)`, entry.css)
    }
  }
  writeFileSync(
    path.join(OUT_CSS, 'index.ts'),
    `// Feuilles de style reprises du site WordPress, dans leur ordre de chargement d'origine.\n${files
      .map((f) => `import './${f}'`)
      .join('\n')}\n`,
  )

  // Fichiers référencés par les pages (toutes langues) + tous les documents (PDF, vidéos, sons).
  for (const f of readdirSync(path.join(REF, 'html'))) {
    if (f.startsWith('._') || !f.endsWith('.html')) continue
    const html = readFileSync(path.join(REF, 'html', f), 'utf8')
    const body = localUrl(html.slice(html.indexOf('<body')))
    trackUrls(body)
  }
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith('._')) continue
      const full = path.join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.(pdf|mp4|mp3)$/i.test(name)) used.add('/' + path.relative(path.join(REF, 'files'), full))
    }
  }
  walk(path.join(REF, 'files/wp-content/uploads'))

  let copied = 0
  let bytes = 0
  const missing = []
  for (const url of used) {
    if (/\.(css|js)$/.test(url)) continue
    const src = path.join(REF, 'files', url)
    if (!existsSync(src) || !statSync(src).isFile()) {
      missing.push(url)
      continue
    }
    const dest = path.join(PUBLIC, url)
    mkdirSync(path.dirname(dest), { recursive: true })
    if (!existsSync(dest)) copyFileSync(src, dest)
    copied += 1
    bytes += statSync(src).size
  }
  console.log(`CSS : ${files.length} fichiers`)
  console.log(`Fichiers publics : ${copied} (${(bytes / 1e6).toFixed(0)} Mo)`)
  if (missing.length) console.log('Introuvables dans la copie de référence :\n  ' + missing.join('\n  '))
}

main()
