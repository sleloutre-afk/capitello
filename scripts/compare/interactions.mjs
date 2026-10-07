/**
 * Contrôle de fidélité des interactions : rejoue les mêmes gestes sur le
 * site d'origine et sur le nouveau site (défilement de l'accueil, menu
 * burger, sélecteur de langue, carrousels, filtres) et compare l'état
 * obtenu. Captures dans ../reference/compare/interactions.
 *
 *   node scripts/compare/interactions.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.resolve(ROOT, '../reference/compare/interactions')
const SITES = { original: 'https://capitello.fr', nouveau: process.env.LOCAL_URL || 'http://localhost:3084' }
mkdirSync(OUT, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

/** Chaque scénario renvoie un état sérialisable, comparé entre les deux sites. */
const SCENARIOS = {
  async 'accueil : en-tête après défilement'(page, base, shot) {
    await page.setViewportSize(DESKTOP)
    await page.goto(base + '/', { waitUntil: 'load' })
    await page.waitForTimeout(1500)
    const read = () =>
      page.evaluate(() => {
        const nav = document.querySelector('.navbar-capitello.elementor-hidden-tablet')
        const visible = (sel) => [...nav.querySelectorAll(sel)].map((el) => getComputedStyle(el).display)
        return {
          fond: getComputedStyle(nav).backgroundColor,
          logoBlanc: visible('.white-logo'),
          logoNoir: visible('.black-logo'),
          texte: getComputedStyle(nav.querySelector('.text-color-change p')).color,
        }
      })
    const haut = await read()
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(600)
    const defile = await read()
    await page.screenshot({ path: shot })
    await page.mouse.wheel(0, -400)
    await page.waitForTimeout(600)
    return { haut, defile, retour: await read() }
  },

  async 'mobile : menu burger (accueil)'(page, base, shot) {
    await page.setViewportSize(MOBILE)
    await page.goto(base + '/', { waitUntil: 'load' })
    await page.waitForTimeout(1500)
    const read = () =>
      page.evaluate(() => {
        const menu = document.getElementById('burger-content')
        const r = menu.getBoundingClientRect()
        return {
          menu: getComputedStyle(menu).display,
          rect: [r.x, r.y, r.width, r.height].map(Math.round),
          fermer: getComputedStyle(document.getElementById('close-menu')).display,
          corps: document.body.style.overflow,
          liens: [...menu.querySelectorAll('a')].map((a) => [a.textContent.trim(), new URL(a.href).pathname.replace(/\/$/, '')]),
        }
      })
    const ferme = await read()
    await page.locator('.open-menu:visible').first().click()
    await page.waitForTimeout(400)
    const ouvert = await read()
    await page.screenshot({ path: shot })
    await page.locator('#close-menu').click()
    await page.waitForTimeout(400)
    return { ferme, ouvert, refermé: await read() }
  },

  async 'mobile : menu burger (page intérieure)'(page, base, shot) {
    await page.setViewportSize(MOBILE)
    await page.goto(base + '/qui-sommes-nous/', { waitUntil: 'load' })
    await page.waitForTimeout(1500)
    await page.locator('.open-menu:visible').first().click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: shot })
    const ouvert = await page.evaluate(() => ({
      menu: getComputedStyle(document.getElementById('burger-content')).display,
      fond: getComputedStyle(document.querySelector('.navbar-capitello.elementor-hidden-desktop')).backgroundColor,
    }))
    await page.locator('#close-menu').click()
    await page.waitForTimeout(400)
    const ferme = await page.evaluate(() => ({
      menu: getComputedStyle(document.getElementById('burger-content')).display,
      fond: getComputedStyle(document.querySelector('.navbar-capitello.elementor-hidden-desktop')).backgroundColor,
    }))
    return { ouvert, ferme }
  },

  async 'sélecteur de langue'(page, base, shot) {
    await page.setViewportSize(DESKTOP)
    await page.goto(base + '/le-mot-du-president/', { waitUntil: 'load' })
    await page.waitForTimeout(2500)
    const read = () =>
      page.evaluate(() => {
        const el = document.querySelector('.country-selector')
        const r = el.getBoundingClientRect()
        return {
          classes: el.className.split(/\s+/).filter(Boolean).sort().join(' '),
          rect: [r.x, r.y, r.width, r.height].map(Math.round),
          langues: [...el.querySelectorAll('li a')].map((a) => {
            const b = a.getBoundingClientRect()
            return [a.textContent.trim(), new URL(a.href).pathname.replace(/\/$/, ''), Math.round(b.y), Math.round(b.height)]
          }),
        }
      })
    const ferme = await read()
    await page.locator('.country-selector label').click()
    await page.waitForTimeout(500)
    const ouvert = await read()
    await page.screenshot({ path: shot, clip: { x: 1100, y: 600, width: 340, height: 300 } })
    return { ferme, ouvert }
  },

  async 'carrousel (qui sommes-nous)'(page, base, shot) {
    await page.setViewportSize(DESKTOP)
    await page.goto(base + '/qui-sommes-nous/', { waitUntil: 'load' })
    await page.waitForTimeout(2500)
    const widget = page.locator('.elementor-widget-n-carousel').first()
    await widget.scrollIntoViewIfNeeded()
    await widget.hover()
    await page.waitForTimeout(800)
    const read = () =>
      widget.evaluate((el) => {
        const r = el.getBoundingClientRect()
        const slides = [...el.querySelectorAll('.swiper-slide')]
        const active = el.querySelector('.swiper-slide-active')
        return {
          taille: [r.width, r.height].map(Math.round),
          diapositives: slides.length,
          largeur: Math.round(slides[0].getBoundingClientRect().width),
          active: active?.getAttribute('data-slide'),
          puces: el.querySelectorAll('.swiper-pagination-bullet').length,
          fleches: [...el.querySelectorAll('.elementor-swiper-button')].map((b) => {
            const x = b.getBoundingClientRect()
            return [Math.round(x.x - r.x), Math.round(x.y - r.y), Math.round(x.width)]
          }),
        }
      })
    const avant = await read()
    await widget.screenshot({ path: shot })
    await widget.locator('.elementor-swiper-button-next').click()
    await page.waitForTimeout(900)
    const apres = await read()
    // La diapositive de départ dépend du moment (défilement automatique) : on compare l'avancement.
    const pas = (Number(apres.active) - Number(avant.active) + 100) % (avant.puces || 1)
    delete avant.active
    delete apres.active
    return { avant, apres, pas }
  },

  async 'filtres (communiqués)'(page, base) {
    await page.setViewportSize(DESKTOP)
    await page.goto(base + '/communiques-de-presse/', { waitUntil: 'load' })
    await page.waitForTimeout(1000)
    const read = () =>
      page.evaluate(() => ({
        url: location.pathname.replace(/\/$/, '') + location.search,
        indication: document.querySelector('#search').placeholder,
        saisie: document.querySelector('#search').value,
        annee: document.querySelector('.communique-year select').value,
        titres: [...document.querySelectorAll('.communique-title')].map((t) => t.textContent.trim().slice(0, 50)),
        vide: document.querySelector('.elementor-widget-communique_widget .elementor-widget-container > p')?.textContent ?? null,
      }))
    await Promise.all([page.waitForNavigation(), page.selectOption('.communique-year select', '2025')])
    await page.waitForTimeout(800)
    const annee = await read()
    await page.fill('#search', 'gare')
    await Promise.all([page.waitForNavigation(), page.press('#search', 'Enter')])
    await page.waitForTimeout(800)
    const recherche = await read()
    await page.goto(base + '/communiques-de-presse/?search=zzzzqqq&communique_year=', { waitUntil: 'load' })
    return { annee, recherche, vide: await read() }
  },
}

const browser = await chromium.launch()
let failures = 0
for (const [name, run] of Object.entries(SCENARIOS)) {
  const states = {}
  for (const [site, base] of Object.entries(SITES)) {
    const context = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 })
    const page = await context.newPage()
    const file = path.join(OUT, `${name.replace(/[^a-z0-9]+/gi, '-')}-${site}.png`)
    try {
      states[site] = await run(page, base, file)
    } catch (error) {
      states[site] = { erreur: String(error).split('\n')[0] }
    }
    await context.close()
  }
  const same = JSON.stringify(states.original) === JSON.stringify(states.nouveau)
  if (!same) failures += 1
  console.log(`${same ? 'OK  ' : 'DIFF'} ${name}`)
  if (!same) {
    console.log('  original:', JSON.stringify(states.original))
    console.log('  nouveau :', JSON.stringify(states.nouveau))
  }
}
await browser.close()
console.log(failures ? `${failures} scénario(s) différent(s)` : 'Toutes les interactions concordent')
