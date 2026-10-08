/**
 * Captcha Cloudflare Turnstile placé devant le back-office (voir
 * src/middleware.ts et src/app/(gate)/bo-verify).
 *
 * Il n'est actif que si les deux clés sont renseignées
 * (NEXT_PUBLIC_TURNSTILE_SITE_KEY et TURNSTILE_SECRET_KEY) : sans elles —
 * en local, par exemple — le BO reste accessible directement.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export function isTurnstileConfigured(): boolean {
  return Boolean(TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)
}

/** Vérifie auprès de Cloudflare le jeton renvoyé par le widget. */
export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[turnstile] Échec de la vérification', err)
    return false
  }
}
