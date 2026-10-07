/**
 * Import initial : extrait les 126 publications (communiqués + médias) des
 * pages de référence, dans les 4 langues, vers
 * scripts/seed-data/publications.json (chargé ensuite dans le BO par
 * `npm run seed`).
 *
 *   node scripts/import/extract-publications.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const REF = path.resolve(ROOT, '../reference/original-site')
const LOCALES = ['fr', 'en', 'es', 'zh']
const localUrl = (url) => url.replace(/https?:\/\/(www\.)?capitello\.fr\/(wp-content|wp-includes)\//g, '/$2/')
// Fusionne les blancs ordinaires ; conserve les espaces insécables (U+00A0).
const clean = (s) => s.replace(/[ \t\r\n]+/g, ' ').replace(/^ +| +$/g, '')

const posts = [1, 2].flatMap((n) => JSON.parse(readFileSync(path.join(REF, `api/posts-${n}.json`), 'utf8')))
const decode = (html) => cheerio.load(`<i>${html}</i>`)('i').text()
// Catégories WordPress : 12 = communiqué, 13 = dans les médias (voir api/categories.json).
const categories = JSON.parse(readFileSync(path.join(REF, 'api/categories.json'), 'utf8'))
const catSlug = Object.fromEntries(categories.map((c) => [c.id, c.slug]))

const TYPES = [
  { type: 'communique', page: 'communiques-de-presse', prefix: 'communique', category: 'communique-de-presse' },
  { type: 'media', page: 'dans-les-medias', prefix: 'media', category: 'dans-les-medias' },
]

const out = []
const tags = {}
const footerHrefs = new Set()
{
  const $ = cheerio.load(readFileSync(path.join(REF, 'html/fr-home.html'), 'utf8'))
  $('footer a[href$=".pdf"][target="_blank"]').each((_, a) => {
    if ($(a).closest('.elementor-widget-heading').length) footerHrefs.add(localUrl($(a).attr('href')))
  })
}

for (const { type, page, prefix, category } of TYPES) {
  const perLocale = {}
  for (const locale of LOCALES) {
    const $ = cheerio.load(readFileSync(path.join(REF, `html/${locale}-${page}.html`), 'utf8'))
    perLocale[locale] = $(`.${prefix}-item`)
      .toArray()
      .map((el) => {
        const $el = $(el)
        const img = $el.find(`.${prefix}-thumbnail img`)
        return {
          title: clean($el.find(`.${prefix}-title`).text()),
          dateLabel: clean($el.find(`.${prefix}-date`).text()),
          summary: $el
            .find(`.${prefix}-content p`)
            .toArray()
            .map((p) => clean($(p).html() || ''))
            .filter(Boolean)
            .join('\n\n'),
          tags: $el
            .find('.tag')
            .toArray()
            .map((t) => clean($(t).text())),
          thumbnail: localUrl(img.attr('src') || ''),
          width: Number(img.attr('width')) || null,
          height: Number(img.attr('height')) || null,
          href: localUrl($el.find(`a.${prefix}-file-button`).attr('href') || ''),
        }
      })
  }
  const candidates = posts.filter((p) => p.categories.some((c) => catSlug[c] === category))
  const taken = new Set()
  perLocale.fr.forEach((item, i) => {
    const post = candidates.find((p) => !taken.has(p.id) && clean(decode(p.title.rendered)) === item.title)
    if (!post) throw new Error(`Article WordPress introuvable : ${item.title}`)
    taken.add(post.id)
    const isVideo = type === 'media' && item.tags.length > 0
    const entry = {
      wpId: post.id,
      slug: post.slug,
      type,
      // Date et heure de publication WordPress (heure de Paris) : l'heure départage
      // les publications d'un même jour, dans le même ordre que sur le site d'origine.
      date: post.date,
      title: {},
      summary: {},
      tags: [],
      isVideo,
      thumbnail: item.thumbnail,
      thumbnailWidth: item.width,
      thumbnailHeight: item.height,
      href: item.href,
      showInFooter: type === 'communique' && footerHrefs.has(item.href),
    }
    // Weglot affiche la plupart des dates chinoises avec des espaces
    // (« 2025 年 6 月 5 日 ») : on garde le libellé d'origine quand il diffère
    // du format standard, pour un affichage strictement identique.
    const zhLabel = perLocale.zh[i].dateLabel
    const zhStandard = new Intl.DateTimeFormat('zh-CN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.date + 'Z'))
    if (zhLabel !== zhStandard) entry.zhDateLabel = zhLabel
    for (const locale of LOCALES) {
      const loc = perLocale[locale][i]
      entry.title[locale] = loc.title
      if (loc.summary) entry.summary[locale] = loc.summary
    }
    if (type === 'communique') {
      item.tags.forEach((name, t) => {
        const key = name.toLowerCase()
        tags[key] ||= Object.fromEntries(
          LOCALES.map((l) => {
            return [l, perLocale[l][i].tags[t]]
          }),
        )
        entry.tags.push(key)
      })
    }
    out.push(entry)
  })
  console.log(`${type}: ${perLocale.fr.length} publications`)
}

writeFileSync(
  path.join(ROOT, 'scripts/seed-data/publications.json'),
  JSON.stringify({ tags, publications: out }, null, 2) + '\n',
)
console.log('tags:', JSON.stringify(tags))
console.log('pied de page:', out.filter((p) => p.showInFooter).map((p) => p.title.fr))
