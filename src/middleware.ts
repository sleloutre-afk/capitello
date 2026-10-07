import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from './lib/locales'

/**
 * Langues : le français est servi sans préfixe (/qui-sommes-nous), les
 * autres sous /en, /es, /zh — comme sur le site d'origine. En interne,
 * toutes les pages vivent sous src/app/(site)/[locale].
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]

  // /fr/... n'existe pas publiquement : redirigé vers l'URL sans préfixe.
  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || '/'
    return NextResponse.redirect(url, 308)
  }
  if ((LOCALES as readonly string[]).includes(first)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Tout sauf le BO, l'API, les fichiers internes de Next et les fichiers statiques.
  matcher: ['/((?!BO|api|_next|wp-content|fonts|flags|media|.*\\.[a-zA-Z0-9]+$).*)'],
}
