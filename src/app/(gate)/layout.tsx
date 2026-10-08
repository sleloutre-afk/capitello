import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import './gate.css'

export const metadata: Metadata = {
  title: 'Accès au back-office — Capitello',
  robots: { index: false, follow: false },
}

/** Gabarit minimal de la page de contrôle anti-robots placée devant /BO. */
export default function GateLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        {/* Widget Cloudflare Turnstile, rendu par src/components/Turnstile.tsx. */}
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />
      </body>
    </html>
  )
}
