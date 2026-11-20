'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_UPDATED_EVENT, getConsent, type CookieConsent } from '@/lib/cookieConsent'

/**
 * Charge Google Analytics 4 seulement après acceptation de la mesure d'audience — jamais avant. Le
 * choix est suivi en direct : accepter dans le bandeau démarre la mesure sans recharger la page.
 * - cookie_expires : 12 mois (2 ans par défaut dans GA4), sous le plafond de 13 mois de la CNIL ;
 * - signaux Google et personnalisation publicitaire désactivés : la mesure ne sert qu'à l'audience.
 * Les pages vues lors d'une navigation interne sont comptées par la « mesure améliorée » de GA4.
 */
export function AnalyticsScripts({ gaId }: { gaId: string }) {
  const [consent, setLocalConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    setLocalConsent(getConsent())
    const onUpdate = (e: Event) => setLocalConsent((e as CustomEvent<CookieConsent>).detail)
    window.addEventListener(CONSENT_UPDATED_EVENT, onUpdate)
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, onUpdate)
  }, [])

  if (!consent?.analytics) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            cookie_expires: 31536000,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  )
}
