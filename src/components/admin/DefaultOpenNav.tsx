'use client'

import { useEffect, useRef } from 'react'
import { useNav, usePreferences } from '@payloadcms/ui'

/**
 * Barre latérale ouverte par défaut.
 *
 * Payload la referme de plusieurs façons au chargement :
 *  - un effet qui la ferme systématiquement sur tout écran ≤ 1440px, une
 *    fois les breakpoints résolus ;
 *  - le chargement asynchrone de la préférence utilisateur `nav.open` sur
 *    les écrans > 1440px (si elle a été repliée une fois, elle le reste).
 *
 * On contre les deux : on (re)fixe la préférence à `open: true`, puis on
 * force `setNavOpen(true)` à plusieurs instants pour passer après la vague
 * d'effets de Payload. Le tout ne s'exécute qu'une fois par montage — si
 * l'utilisateur replie ensuite la nav via le chevron, c'est respecté.
 *
 * Sur mobile (< 768px) la nav est une modale plein écran : on n'y touche
 * pas.
 *
 * Monté via `admin.components.beforeNavLinks` (payload.config.ts) ; rend
 * `null`.
 */
export function DefaultOpenNav() {
  const { setNavOpen } = useNav()
  const { setPreference } = usePreferences()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current || typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 768px)').matches) return
    ran.current = true

    // Respectée par le rendu serveur et par le chargement de préférence
    // sur grand écran au prochain passage.
    void setPreference('nav', { open: true }, true)

    // Les effets de Payload qui referment la nav (résolution des
    // breakpoints ≤1440px, chargement async de la préférence) peuvent
    // arriver à des instants variables selon la vitesse d'hydratation —
    // on la ré-ouvre en boucle pendant une courte fenêtre, puis on
    // s'arrête pour ne plus contrarier un repli manuel.
    const start = Date.now()
    const iv = window.setInterval(() => {
      setNavOpen(true)
      if (Date.now() - start > 2500) window.clearInterval(iv)
    }, 60)
    return () => window.clearInterval(iv)
  }, [setNavOpen, setPreference])

  return null
}

export default DefaultOpenNav
