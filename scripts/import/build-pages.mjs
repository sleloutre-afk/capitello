/**
 * Import initial depuis la copie de référence du site WordPress
 * (../reference/original-site) : transforme le HTML rendu par Elementor en
 * composants React (src/components/sections/*.tsx) et extrait les textes
 * des 4 langues dans src/i18n/dictionaries/<langue>.json.
 *
 * Exécuté une fois pour amorcer le projet — les fichiers générés sont
 * ensuite maintenus à la main (ne pas relancer sans relire le diff).
 *
 *   node scripts/import/build-pages.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const REF = path.resolve(ROOT, '../reference/original-site/html')
const OUT_SECTIONS = path.join(ROOT, 'src/components/sections')
const OUT_DICT = path.join(ROOT, 'src/i18n/dictionaries')
const LOCALES = ['fr', 'en', 'es', 'zh']

const INLINE = new Set(['br', 'strong', 'b', 'em', 'i', 'u', 'span', 'a', 'sup', 'sub', 'small'])
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source'])
const FLEX_CLASSES = ['e-con', 'e-con-inner', 'swiper-wrapper']
const DROP_ATTRS = new Set(['data-id', 'data-element_type', 'data-widget_type', 'data-elementor-post-type'])
const ATTR_MAP = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  frameborder: 'frameBorder',
  srcset: 'srcSet',
  fetchpriority: 'fetchPriority',
  viewbox: 'viewBox',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  allowfullscreen: 'allowFullScreen',
}

/** Sections à générer : fichier source (page de référence), sélecteur racine, nom du composant. */
const SECTIONS = [
  { ns: 'headerHome', page: 'home', selector: 'body > header', component: 'HeaderHome' },
  { ns: 'headerInner', page: 'qui-sommes-nous', selector: 'body > header', component: 'HeaderInner' },
  { ns: 'footer', page: 'home', selector: 'body > footer', component: 'Footer' },
  { ns: 'home', page: 'home', selector: 'body > div[data-elementor-type="wp-page"]', component: 'HomeContent' },
  {
    ns: 'president',
    page: 'le-mot-du-president',
    selector: 'body > div[data-elementor-type="wp-page"]',
    component: 'PresidentContent',
  },
  {
    ns: 'about',
    page: 'qui-sommes-nous',
    selector: 'body > div[data-elementor-type="wp-page"]',
    component: 'AboutContent',
  },
  {
    ns: 'communiques',
    page: 'communiques-de-presse',
    selector: 'body > div[data-elementor-type="wp-page"]',
    component: 'CommuniquesContent',
    listWidget: '.elementor-widget-communique_widget',
  },
  {
    ns: 'medias',
    page: 'dans-les-medias',
    selector: 'body > div[data-elementor-type="wp-page"]',
    component: 'MediasContent',
    listWidget: '.elementor-widget-medias_widget',
  },
]

const docs = {}
function load(locale, page) {
  const key = `${locale}-${page}`
  if (!docs[key]) {
    const html = readFileSync(path.join(REF, `${key}.html`), 'utf8')
    docs[key] = cheerio.load(html, { decodeEntities: false })
  }
  return docs[key]
}

const localUrl = (url) => url.replace(/https?:\/\/(www\.)?capitello\.fr\/(wp-content|wp-includes)\//g, '/$2/')

const elementChildren = (node) => (node.children || []).filter((c) => c.type === 'tag')
const hasOwnText = (node) => (node.children || []).some((c) => c.type === 'text' && c.data.trim() !== '')
const allInline = (node) =>
  elementChildren(node).every((c) => INLINE.has(c.name) && allInline(c))
const textOf = ($, node) => $(node).text()

/** Chemin structurel (indices parmi les enfants éléments) depuis la racine de section. */
function pathFrom(root, node) {
  const p = []
  let cur = node
  while (cur !== root) {
    const parent = cur.parent
    p.unshift(elementChildren(parent).indexOf(cur))
    cur = parent
  }
  return p
}
function resolve(root, p) {
  let cur = root
  for (const i of p) {
    cur = elementChildren(cur)[i]
    if (!cur) return null
  }
  return cur
}

function styleToObject(style) {
  const obj = {}
  for (const decl of style.split(';')) {
    const idx = decl.indexOf(':')
    if (idx === -1) continue
    const prop = decl.slice(0, idx).trim()
    const value = decl.slice(idx + 1).trim()
    if (!prop) continue
    obj[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value
  }
  return obj
}

function generate(section) {
  const $ = load('fr', section.page)
  const root = $(section.selector).get(0)
  if (!root) throw new Error(`racine introuvable pour ${section.ns}`)
  const others = Object.fromEntries(
    LOCALES.filter((l) => l !== 'fr').map((l) => {
      const $l = load(l, section.page)
      return [l, { $: $l, root: $l(section.selector).get(0) }]
    }),
  )
  const dict = Object.fromEntries(LOCALES.map((l) => [l, {}]))
  const usedKeys = new Map()
  let usesLink = false

  function nearestId(node) {
    let cur = node
    while (cur && cur !== root.parent) {
      const id = cur.attribs?.['data-id']
      if (id) return id
      cur = cur.parent
    }
    return 'x'
  }
  function newKey(node) {
    const base = `e${nearestId(node)}`
    const n = (usedKeys.get(base) || 0) + 1
    usedKeys.set(base, n)
    return n === 1 ? base : `${base}_${n}`
  }

  /** Enregistre le texte (ou HTML en ligne) du nœud dans les 4 dictionnaires. */
  function register(node, asHtml) {
    const key = newKey(node)
    const p = pathFrom(root, node)
    const read = ($x, n) => {
      if (!n) return null
      const raw = asHtml ? localUrl($x(n).html()) : textOf($x, n)
      // Les blancs ordinaires sont fusionnés ; les espaces insécables (U+00A0) sont conservées.
      return raw.replace(/[ \t\r\n]+/g, ' ')
    }
    dict.fr[key] = read($, node)
    for (const l of Object.keys(others)) {
      const n = resolve(others[l].root, p)
      const value = read(others[l].$, n)
      if (value === null) console.warn(`[${section.ns}] ${l}: nœud introuvable pour ${key}`)
      dict[l][key] = value ?? dict.fr[key]
    }
    return key
  }

  function attrs(node) {
    const out = []
    for (const [name, rawValue] of Object.entries(node.attribs || {})) {
      if (DROP_ATTRS.has(name)) continue
      if (name === 'data-settings' && !/elementor-widget-n-carousel/.test(node.attribs.class || '')) continue
      if (name === 'data-elementor-id' || name === 'data-elementor-type') {
        out.push(`${name}="${rawValue}"`)
        continue
      }
      let value = rawValue
      const jsxName = ATTR_MAP[name] || name
      if (name === 'style') {
        out.push(`style={${JSON.stringify(styleToObject(value))}}`)
        continue
      }
      if (name === 'hidden' || name === 'allowfullscreen') {
        out.push(jsxName)
        continue
      }
      if (name === 'src' || name === 'srcset' || name === 'data') value = localUrl(value)
      if (name === 'href') {
        value = localUrl(value)
        if (/^\/(?!\/|wp-content|wp-includes)/.test(value)) {
          usesLink = true
          const clean = value.length > 1 ? value.replace(/\/$/, '') : value
          out.push(`href={l(${JSON.stringify(clean)})}`)
          continue
        }
      }
      if (name === 'width' || name === 'height' || name === 'tabindex') {
        out.push(/^\d+$/.test(value) ? `${jsxName}={${value}}` : `${jsxName}="${value}"`)
        continue
      }
      if (name === 'data-settings') {
        out.push(`data-settings={${JSON.stringify(value)}}`)
        continue
      }
      out.push(value.includes('"') ? `${jsxName}={${JSON.stringify(value)}}` : `${jsxName}="${value}"`)
    }
    return out.length ? ' ' + out.join(' ') : ''
  }

  function isFlexParent(node) {
    const cls = (node.attribs?.class || '').split(/\s+/)
    return FLEX_CLASSES.some((c) => cls.includes(c))
  }

  function emit(node, depth) {
    const pad = '  '.repeat(depth)
    const tag = node.name
    const cls = node.attribs?.class || ''

    if (section.listWidget && $(node).is(section.listWidget)) {
      return `${pad}<${tag}${attrs(node)}>\n${pad}  <div className="elementor-widget-container">{children}</div>\n${pad}</${tag}>\n`
    }
    if (tag === 'svg') {
      return `${pad}${svg(node)}\n`
    }
    if (VOID.has(tag)) return `${pad}<${tag}${attrs(node)} />\n`

    const kids = elementChildren(node)
    const isEditor =
      cls.split(/\s+/).includes('elementor-widget-container') &&
      /elementor-widget-text-editor/.test(node.parent?.attribs?.class || '')

    // Bloc de texte : contenu purement « en ligne » → une entrée de dictionnaire.
    if (hasOwnText(node) || isEditor) {
      const hasText = $(node).text().trim() !== ''
      if (hasText && (isEditor || allInline(node))) {
        if (kids.length === 0) {
          const key = register(node, false)
          return `${pad}<${tag}${attrs(node)}>{t.${key}}</${tag}>\n`
        }
        const key = register(node, true)
        return `${pad}<${tag}${attrs(node)} dangerouslySetInnerHTML={{ __html: t.${key} }} />\n`
      }
    }
    if (kids.length === 0 && !hasOwnText(node)) {
      return `${pad}<${tag}${attrs(node)}></${tag}>\n`
    }

    let inner = ''
    const children = node.children || []
    const flex = isFlexParent(node)
    children.forEach((child, i) => {
      if (child.type === 'tag') inner += emit(child, depth + 1)
      else if (child.type === 'text') {
        if (child.data.trim() === '') {
          // Un blanc entre deux éléments en ligne se voit ; ailleurs il est sans effet.
          const prev = children[i - 1]
          const next = children[i + 1]
          if (!flex && prev?.type === 'tag' && next?.type === 'tag' && INLINE.has(prev.name) && INLINE.has(next.name)) {
            inner += `${pad}  {' '}\n`
          }
        } else {
          console.warn(`[${section.ns}] texte hors bloc ignoré : ${JSON.stringify(child.data.trim().slice(0, 60))}`)
        }
      }
    })
    return `${pad}<${tag}${attrs(node)}>\n${inner}${pad}</${tag}>\n`
  }

  function svg(node) {
    const kids = elementChildren(node)
    if (kids.length === 0) return `<${node.name}${attrs(node)} />`
    return `<${node.name}${attrs(node)}>${kids.map(svg).join('')}</${node.name}>`
  }

  const jsx = emit(root, 2)
  const props = ['t']
  if (usesLink) props.push('l')
  if (section.listWidget) props.push('children')
  const propType = section.listWidget ? 'SectionProps & { children: ReactNode }' : 'SectionProps'
  const source = `${section.listWidget ? "import type { ReactNode } from 'react'\n" : ''}import type { SectionProps } from '@/i18n'

export function ${section.component}({ ${props.join(', ')} }: ${propType}) {
  return (
${jsx.replace(/\n$/, '')}
  )
}
`
  // --dict-only : ne régénère que les dictionnaires (les composants ont été retouchés à la main).
  if (!process.argv.includes('--dict-only')) writeFileSync(path.join(OUT_SECTIONS, `${section.component}.tsx`), source)
  return dict
}

mkdirSync(OUT_SECTIONS, { recursive: true })
mkdirSync(OUT_DICT, { recursive: true })
const all = Object.fromEntries(LOCALES.map((l) => [l, {}]))
for (const section of SECTIONS) {
  const dict = generate(section)
  for (const l of LOCALES) all[l][section.ns] = dict[l]
  console.log(`${section.component}: ${Object.keys(dict.fr).length} textes`)
}
// Entrées devenues dynamiques (pied de page : « Dernières publications » vient du BO).
for (const l of LOCALES) for (const key of ['ec726c85', 'eee55d2a', 'e7aa2943', 'e891ff67']) delete all[l].footer[key]
for (const l of LOCALES) {
  writeFileSync(path.join(OUT_DICT, `${l}.json`), JSON.stringify(all[l], null, 2) + '\n')
}
