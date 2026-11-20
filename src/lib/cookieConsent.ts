'use client'

/**
 * Choix du visiteur sur les cookies — une seule catégorie facultative sur ce site : la mesure
 * d'audience (Google Analytics). Repris des sites Doxamed et Teledok, avec les exigences de la CNIL :
 * rien de facultatif n'est chargé avant un choix, refuser est aussi simple qu'accepter, et le choix
 * est redemandé après CONSENT_MAX_AGE_MS (6 mois, durée recommandée par la CNIL).
 */
export type CookieConsent = { analytics: boolean }

const STORAGE_KEY = 'capitello_cookie_consent'
const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000
export const CONSENT_UPDATED_EVENT = 'capitello-cookie-consent-updated'
/** Émis par le bouton de la page « Gestion des cookies » pour rouvrir le bandeau. */
export const OPEN_CONSENT_EVENT = 'capitello-cookie-consent-open'

type Stored = CookieConsent & { at: number }

/**
 * `null` tant qu'aucun choix valable n'existe (première visite, choix de plus de 6 mois, stockage
 * indisponible) : c'est le signal pour afficher le bandeau.
 */
export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Stored>
    if (typeof parsed?.analytics !== 'boolean' || typeof parsed?.at !== 'number') return null
    if (Date.now() - parsed.at > CONSENT_MAX_AGE_MS) return null
    return { analytics: parsed.analytics }
  } catch {
    return null
  }
}

/**
 * Enregistre le choix et prévient AnalyticsScripts, pour que la mesure démarre sans recharger la page.
 * Le retrait d'un accord donné supprime aussi les cookies de Google Analytics et recharge la page :
 * gtag.js ne sait pas s'arrêter proprement, et la CNIL attend que le retrait arrête réellement la mesure.
 */
export function setConsent(consent: CookieConsent) {
  if (typeof window === 'undefined') return
  const wasAllowed = getConsent()?.analytics === true
  try {
    const stored: Stored = { ...consent, at: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Stockage indisponible (navigation privée, stockage bloqué…) : le bandeau réapparaîtra à la
    // prochaine visite, ce qui reste acceptable.
  }
  if (wasAllowed && !consent.analytics) {
    deleteAnalyticsCookies()
    window.location.reload()
    return
  }
  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: consent }))
}

export function openConsentBanner() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}

/** GA4 dépose `_ga` et `_ga_<ID>` sur le domaine (.capitello.fr) : supprimés sur chaque variante possible. */
function deleteAnalyticsCookies() {
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (!name.startsWith('_ga')) continue
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
    }
  }
}
