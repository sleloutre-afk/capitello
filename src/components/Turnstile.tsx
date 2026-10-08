'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; language?: string }) => string
      remove: (widgetId: string) => void
    }
  }
}

/**
 * Affiche un widget Cloudflare Turnstile dès que son script est chargé
 * (voir src/app/(gate)/layout.tsx). Le widget ajoute lui-même au
 * formulaire un champ caché `cf-turnstile-response` contenant le jeton.
 */
export default function Turnstile({ siteKey }: { siteKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let pollTimer: ReturnType<typeof setInterval> | undefined

    function render() {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, { sitekey: siteKey, language: 'fr' })
    }

    if (window.turnstile) {
      render()
    } else {
      pollTimer = setInterval(() => {
        if (window.turnstile) {
          clearInterval(pollTimer)
          render()
        }
      }, 100)
    }

    return () => {
      cancelled = true
      if (pollTimer) clearInterval(pollTimer)
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current)
    }
  }, [siteKey])

  return <div ref={containerRef} className="cf-turnstile" />
}
