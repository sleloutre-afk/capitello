import type { Locale } from '@/lib/locales'

/** Libellés d'interface hors pages Elementor : titres d'onglet, listes de publications. */
export const UI: Record<
  Locale,
  {
    siteName: string
    titles: { president: string; about: string; communiques: string; medias: string }
    headings: { communiques: string; medias: string }
    search: string
    results: (count: number) => string
    allYears: string
    noResults: string
    readRelease: string
    learnMore: string
    watchVideo: string
    video: string
  }
> = {
  fr: {
    siteName: 'Capitello',
    titles: {
      president: 'Le mot du président – Capitello',
      about: 'Qui sommes-nous ? – Capitello',
      communiques: 'Communiqués de presse – Capitello',
      medias: 'Dans les médias – Capitello',
    },
    headings: { communiques: 'Communiqués de presse', medias: 'Dans les médias' },
    search: 'RECHERCHE',
    results: (n) => `(${n} résultats)`,
    allYears: 'Toutes les années',
    noResults: 'Aucun communiqué de presse trouvé.',
    readRelease: 'LIRE LE COMMUNIQUÉ DE PRESSE',
    learnMore: 'EN SAVOIR PLUS',
    watchVideo: 'VOIR LA VIDÉO',
    video: 'VIDÉO',
  },
  en: {
    siteName: 'Capitello',
    titles: {
      president: 'A word from the president - Capitello',
      about: 'Who we are - Capitello',
      communiques: 'Press releases - Capitello',
      medias: 'In the media - Capitello',
    },
    headings: { communiques: 'Press releases', medias: 'In the media' },
    search: 'SEARCH',
    results: (n) => `(${n} results)`,
    allYears: 'All years',
    noResults: 'No press releases found.',
    readRelease: 'READ THE PRESS RELEASE',
    learnMore: 'LEARN MORE',
    watchVideo: 'WATCH VIDEO',
    video: 'VIDEO',
  },
  es: {
    siteName: 'Capitello',
    titles: {
      president: 'Palabras del Presidente - Capitello',
      about: 'Quiénes somos - Capitello',
      communiques: 'Comunicados de prensa - Capitello',
      medias: 'En los medios - Capitello',
    },
    headings: { communiques: 'Comunicados de prensa', medias: 'En los medios de comunicación' },
    search: 'BUSCAR',
    results: (n) => `(${n} resultados)`,
    allYears: 'Todos los años',
    noResults: 'No se ha encontrado ningún comunicado de prensa.',
    readRelease: 'LEER EL COMUNICADO DE PRENSA',
    learnMore: 'SABER MÁS',
    watchVideo: 'VER EL VÍDEO',
    video: 'VÍDEO',
  },
  zh: {
    siteName: '卡皮特罗',
    titles: {
      president: '主席的话 - 卡皮特罗',
      about: '我们是谁- 卡皮特罗',
      communiques: '新闻稿 - Capitello',
      medias: '媒体报道 - Capitello',
    },
    headings: { communiques: '新闻稿', medias: '媒体' },
    search: '搜索',
    results: (n) => `(${n} 条结果)`,
    allYears: '所有岁月',
    noResults: '未找到任何新闻稿。',
    readRelease: '阅读新闻稿',
    learnMore: '了解更多',
    watchVideo: '观看视频',
    video: '视频',
  },
}

/** Bandeau de consentement aux cookies (src/components/CookieBanner.tsx). */
export type CookieTexts = {
  title: string
  text: string
  learnMore: string
  refuse: string
  accept: string
  /** Bouton de la page « Gestion des cookies » qui rouvre le bandeau. */
  settings: string
}

export const COOKIE_TEXTS: Record<Locale, CookieTexts> = {
  fr: {
    title: 'Un petit cookie ?',
    text: 'Dans un souci d’amélioration continue du site, et avec votre accord, nous mesurons son audience avec Google Analytics.',
    learnMore: 'En savoir plus',
    refuse: 'Refuser',
    accept: 'Accepter',
    settings: 'Modifier mes choix de cookies',
  },
  en: {
    title: 'Fancy a cookie?',
    text: 'To keep improving this website, and with your consent, we measure its audience with Google Analytics.',
    learnMore: 'Learn more',
    refuse: 'Decline',
    accept: 'Accept',
    settings: 'Change my cookie settings',
  },
  es: {
    title: '¿Le apetece una cookie?',
    text: 'Para seguir mejorando el sitio, y con su consentimiento, medimos su audiencia con Google Analytics.',
    learnMore: 'Más información',
    refuse: 'Rechazar',
    accept: 'Aceptar',
    settings: 'Modificar mis preferencias de cookies',
  },
  zh: {
    title: '来块饼干吗？',
    text: '为持续改进本网站，经您同意，我们使用 Google Analytics 统计网站的访问量。',
    learnMore: '了解更多',
    refuse: '拒绝',
    accept: '接受',
    settings: '修改我的 Cookie 设置',
  },
}
