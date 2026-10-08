import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'
import { BO_GATE_COOKIE, BO_GATE_MAX_AGE_SECONDS, createBoGateCookieValue } from '@/lib/boGate'

/** Vérifie le jeton du captcha de /bo-verify et pose le cookie d'accès au BO. */
export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null)
  const token = typeof data?.token === 'string' ? data.token : null

  const ok = await verifyTurnstile(token)
  if (!ok) return NextResponse.json({ success: false }, { status: 403 })

  const res = NextResponse.json({ success: true })
  res.cookies.set(BO_GATE_COOKIE, await createBoGateCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: BO_GATE_MAX_AGE_SECONDS,
  })
  return res
}
