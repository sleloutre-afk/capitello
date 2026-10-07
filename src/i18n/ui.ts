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
