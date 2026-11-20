'use client'

import { useEffect, useState } from 'react'
import { CONSENT_UPDATED_EVENT, OPEN_CONSENT_EVENT, getConsent, openConsentBanner, setConsent } from '@/lib/cookieConsent'
import type { CookieTexts } from '@/i18n/ui'

/**
 * Bandeau de consentement à la mesure d'audience, affiché tant que le visiteur n'a pas choisi (puis de
 * nouveau 6 mois plus tard, ou depuis la page « Gestion des cookies »). « Refuser » et « Accepter » ont
 * volontairement la même taille et le même style, côte à côte : la CNIL considère comme non valable un
 * refus plus difficile à trouver ou moins visible que l'acceptation. Textes : src/i18n/ui.ts.
 */
export function CookieBanner({ t, policyHref }: { t: CookieTexts; policyHref: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getConsent() === null)
    const onUpdate = () => setVisible(getConsent() === null)
    const onOpen = () => setVisible(true)
    window.addEventListener(CONSENT_UPDATED_EVENT, onUpdate)
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen)
    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, onUpdate)
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen)
    }
  }, [])

  if (!visible) return null

  const choose = (analytics: boolean) => {
    setConsent({ analytics })
    setVisible(false)
  }

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-t" aria-describedby="cookie-banner-d">
      <div className="cookie-banner-in">
        {/* Deux biscuits Capitello, purement décoratifs, comme sur les bandeaux de Doxamed et Teledok. */}
        <div className="cookie-banner-pics" aria-hidden="true">
          <img src="/images/cookie-capitello.svg" alt="" className="cookie-banner-pic1" />
          <img src="/images/cookie-capitello.svg" alt="" className="cookie-banner-pic2" />
        </div>
        <div>
          <p className="cookie-banner-t" id="cookie-banner-t">
            {t.title}
          </p>
          <p className="cookie-banner-d" id="cookie-banner-d">
            {t.text} <a href={policyHref}>{t.learnMore}</a>
          </p>
        </div>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" onClick={() => choose(false)}>
          {t.refuse}
        </button>
        <button type="button" onClick={() => choose(true)}>
          {t.accept}
        </button>
      </div>
    </div>
  )
}

/**
 * Bouton de la page « Gestion des cookies » qui rouvre le bandeau, pour modifier ou retirer son choix à
 * tout moment (le lien « Gestion des cookies » du pied de page mène à cette page).
 */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" className="cookie-settings-btn" onClick={openConsentBanner}>
      {label}
    </button>
  )
}
