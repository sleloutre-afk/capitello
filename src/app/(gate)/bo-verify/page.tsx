'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Turnstile from '@/components/Turnstile'
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile'

/**
 * Contrôle anti-robots devant /BO (voir src/middleware.ts) — une
 * vérification humaine, pas une connexion. Le middleware y renvoie tout
 * visiteur sans cookie `bo_gate` (src/lib/boGate.ts) ; une fois le captcha
 * passé, le cookie est posé pour 30 jours et le visiteur repart vers la
 * page demandée.
 */
function VerifyForm() {
  const redirectParam = useSearchParams().get('redirect')
  // Uniquement un chemin du back-office ("/BO", "/BO/…") : sans ce filtre,
  // /bo-verify?redirect=https://… servirait à rediriger vers un site tiers
  // après un vrai captcha passé sur notre domaine. Sont écartés aussi
  // "//exemple.com" et "/\exemple.com" (lus comme des adresses externes).
  const redirectTo =
    redirectParam && /^\/BO(?:[/?#]|$)/.test(redirectParam) && !/\\|\/\//.test(redirectParam) ? redirectParam : '/BO'
  const [failed, setFailed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [turnstileKey, setTurnstileKey] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const token = new FormData(e.currentTarget).get('cf-turnstile-response')
    setSubmitting(true)
    setFailed(false)
    try {
      const res = await fetch('/api/bo-verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        window.location.href = redirectTo
        return
      }
    } catch {
      // traité ci-dessous
    }
    setSubmitting(false)
    setFailed(true)
    setTurnstileKey((k) => k + 1) // un jeton ne sert qu'une fois : nouveau widget pour réessayer
  }

  return (
    <main className="gate">
      <div className="gate__card">
        <img className="gate__logo" src="/wp-content/uploads/2025/02/logo-capitello-black.svg" width={240} height={37} alt="Capitello Group" />
        <h1 className="gate__title">Accès au back-office</h1>
        <p className="gate__text">Une vérification rapide avant d’accéder à la page de connexion.</p>
        <form onSubmit={handleSubmit} className="gate__form">
          {TURNSTILE_SITE_KEY && <Turnstile key={turnstileKey} siteKey={TURNSTILE_SITE_KEY} />}
          {failed && <p className="gate__error">Vérification échouée, réessayez.</p>}
          <button type="submit" disabled={submitting} className="gate__button">
            Continuer
          </button>
        </form>
      </div>
    </main>
  )
}

export default function BoVerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
