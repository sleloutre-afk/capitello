/**
 * Cookie prouvant qu'un navigateur a déjà passé le captcha de /bo-verify :
 * le contrôle anti-robots placé devant /BO (voir src/middleware.ts). Rien
 * à retenir ni à transmettre pour les utilisateurs du BO — une simple
 * vérification humaine, valable 30 jours. Le cookie est signé (HMAC avec
 * PAYLOAD_SECRET) : il ne peut pas être fabriqué à la main.
 */
export const BO_GATE_COOKIE = 'bo_gate'

const DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 jours
export const BO_GATE_MAX_AGE_SECONDS = DURATION_MS / 1000

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(process.env.PAYLOAD_SECRET || ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createBoGateCookieValue(): Promise<string> {
  const expiry = Date.now() + DURATION_MS
  return `${expiry}.${await hmac(String(expiry))}`
}

export async function isValidBoGateCookie(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const [expiry, signature] = value.split('.')
  if (!expiry || !signature) return false
  if (!Number.isFinite(Number(expiry)) || Date.now() > Number(expiry)) return false
  return (await hmac(expiry)) === signature
}
