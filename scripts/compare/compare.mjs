/**
 * Contrôle de fidélité : compare le site d'origine (capitello.fr) et le
 * nouveau site (localhost) élément par élément — position, taille et
 * styles calculés de chaque bloc — et enregistre des captures pleine page
 * côte à côte dans ../reference/compare.
 *
 *   node scripts/compare/compare.mjs [filtre]     (ex. « home », « fr-home-mobile »)
 *   LOCALES=en,es,zh VIEWPORTS=desktop,mobile node scripts/compare/compare.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.resolve(ROOT, '../reference/compare')
const ORIGINAL = 'https://capitello.fr'
const LOCAL = process.env.LOCAL_URL || 'http://localhost:3084'
const filter = process.argv[2] || ''

const PAGES = {
  home: '/',
  president: '/le-mot-du-president/',
  about: '/qui-sommes-nous/',
  communiques: '/communiques-de-presse/',
  medias: '/dans-les-medias/',
}
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1100, height: 800 },
  tablet: { width: 820, height: 1100 },
  mobile: { width: 390, height: 844 },
}
const LOCALES = (process.env.LOCALES || 'fr').split(',')
const ONLY_VIEWPORTS = process.env.VIEWPORTS ? process.env.VIEWPORTS.split(',') : Object.keys(VIEWPORTS)
const STYLE_PROPS = [
  'display', 'position', 'color', 'backgroundColor', 'backgroundImage', 'fontFamily', 'fontSize', 'fontWeight',
  'lineHeight', 'letterSpacing', 'textTransform', 'textAlign', 'textDecorationLine', 'opacity', 'borderRadius',
  'borderTopWidth', 'borderBottomWidth', 'borderTopColor', 'paddingTop', 'paddingLeft', 'marginTop', 'marginBottom',
  'zIndex', 'boxShadow', 'filter', 'objectFit',
]

async function snapshot(page, url, shot) {
  await page.goto(url, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1500)
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
      iframe { visibility: hidden !important; }`,
  })
  // Fait défiler la page pour déclencher le chargement différé des images.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    await document.fonts.ready
    // Charge toutes les images (y compris « lazy »), avec un délai maximal.
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'))
    await Promise.race([
      Promise.all(
        [...document.images].map((img) => (img.complete ? null : new Promise((r) => ((img.onload = r), (img.onerror = r))))),
      ),
      new Promise((r) => setTimeout(r, 15000)),
    ])
  })
  await page.waitForTimeout(500)
  const data = await page.evaluate((props) => {
    const out = {}
    const seen = {}
    const add = (key, el) => {
      seen[key] = (seen[key] || 0) + 1
      const k = seen[key] > 1 ? `${key}#${seen[key]}` : key
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const style = {}
      for (const p of props) style[p] = cs[p]
      style.backgroundImage = style.backgroundImage.replace(/https?:\/\/[^/]+/g, '')
      out[k] = {
        rect: [r.x + window.scrollX, r.y + window.scrollY, r.width, r.height].map((n) => Math.round(n)),
        style,
        text: el.children.length === 0 ? el.textContent.trim().slice(0, 80) : undefined,
      }
    }
    // Les carrousels défilent tout seuls : leurs diapositives ne sont pas comparables.
    const skip = (el) => el.closest('.swiper-wrapper')
    document.querySelectorAll('[class*="elementor-element-"]').forEach((el) => {
      if (skip(el)) return
      const id = el.className.match(/elementor-element-(\w+)/)[1]
      add(id, el)
      const inner = el.querySelector(':scope > .elementor-widget-container > *')
      if (inner && !inner.className?.includes?.('elementor-element-')) add(id + '>inner', inner)
      el.querySelectorAll(':scope > .elementor-widget-container a, :scope > .elementor-widget-container img').forEach((x) => {
        if (x.closest('[class*="elementor-element-"]') === el) add(`${id}>${x.tagName.toLowerCase()}`, x)
      })
    })
    for (const sel of ['.communique-item', '.media-item', '.communique-thumbnail img', '.media-thumbnail img',
      '.communique-title', '.media-title', '.communique-date', '.media-date', '.communique-file-button',
      '.media-file-button', '.tag', '.communique-search', '.medias-search', '.communique-year select',
      '.medias-year select', '.page-custom-title', '.country-selector', '.wgcurrent', 'header', 'footer', 'body']) {
      document.querySelectorAll(sel).forEach((el) => add(sel, el))
    }
    return { elements: out, height: document.documentElement.scrollHeight }
  }, STYLE_PROPS)
  await page.screenshot({ path: shot, fullPage: true })
  return data
}

function diff(a, b) {
  const issues = []
  for (const key of Object.keys(a.elements)) {
    const x = a.elements[key]
    const y = b.elements[key]
    if (!y) {
      if (x.style.display !== 'none' && x.rect[2] > 0) issues.push({ key, kind: 'absent du nouveau site', original: x.rect })
      continue
    }
    const hidden = x.rect[2] === 0 && x.rect[3] === 0 && y.rect[2] === 0 && y.rect[3] === 0
    if (hidden) continue
    const delta = x.rect.map((n, i) => Math.abs(n - y.rect[i]))
    if (Math.max(...delta) > 1) issues.push({ key, kind: 'géométrie', original: x.rect, nouveau: y.rect, text: x.text })
    for (const p of Object.keys(x.style)) {
      if (x.style[p] !== y.style[p]) issues.push({ key, kind: `style ${p}`, original: x.style[p], nouveau: y.style[p] })
    }
    if (x.text !== y.text) issues.push({ key, kind: 'texte', original: x.text, nouveau: y.text })
  }
  for (const key of Object.keys(b.elements)) if (!a.elements[key]) issues.push({ key, kind: 'en trop sur le nouveau site' })
  return issues
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
let total = 0
for (const locale of LOCALES) {
  for (const [name, route] of Object.entries(PAGES)) {
    for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
      const id = `${locale}-${name}-${vpName}`
      if (!ONLY_VIEWPORTS.includes(vpName)) continue
      if (filter && !id.includes(filter)) continue
      const prefix = locale === 'fr' ? '' : `/${locale}`
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
      const page = await context.newPage()
      const original = await snapshot(page, ORIGINAL + prefix + route, path.join(OUT, `${id}-original.png`))
      const local = await snapshot(page, LOCAL + prefix + route.replace(/\/$/, '') || '/', path.join(OUT, `${id}-nouveau.png`))
      await context.close()
      const issues = diff(original, local)
      total += issues.length
      writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(issues, null, 1))
      console.log(`${id}: ${Object.keys(original.elements).length} éléments, ${issues.length} écarts, hauteur ${original.height} / ${local.height}`)
      const byKind = {}
      for (const i of issues) byKind[i.kind] = (byKind[i.kind] || 0) + 1
      if (issues.length) console.log('   ', JSON.stringify(byKind))
    }
  }
}
await browser.close()
console.log(`Total : ${total} écarts`)
