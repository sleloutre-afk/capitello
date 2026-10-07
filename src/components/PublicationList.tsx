import { UI } from '@/i18n/ui'
import { formatLongDate } from '@/lib/dates'
import { localizePath, type Locale } from '@/lib/locales'
import { getPublications, type PublicationType, type PublicationView } from '@/lib/publications'

/**
 * Liste filtrable d'une rubrique (« Communiqués de presse » ou « Dans les
 * médias »). Reprend le balisage des deux widgets WordPress d'origine —
 * les styles (src/styles/legacy/*-widget-style.css) s'appuient sur ces
 * classes, préfixées `communique-` ou `media-`/`medias-` selon la rubrique.
 */
const VARIANTS = {
  communique: {
    path: '/communiques-de-presse',
    item: 'communique',
    list: 'communique',
    yearParam: 'communique_year',
  },
  media: {
    path: '/dans-les-medias',
    item: 'media',
    list: 'medias',
    yearParam: 'medias_year',
  },
} as const

const LEGACY_ORIGIN = 'https://capitello.fr'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Recherche façon WordPress : tous les mots doivent figurer dans le texte, sans tenir compte des accents ni de la casse. */
function matches(haystacks: string[], search: string) {
  const terms = normalize(search).split(/\s+/).filter(Boolean)
  const text = normalize(haystacks.join(' '))
  return terms.every((term) => text.includes(term))
}

export async function PublicationList({
  type,
  locale,
  search,
  year,
}: {
  type: PublicationType
  locale: Locale
  search: string
  year: string
}) {
  const v = VARIANTS[type]
  const ui = UI[locale]
  const all = await getPublications(type, locale)
  // La recherche porte aussi sur le texte français (comme sur le site
  // d'origine, où la recherche interrogeait le contenu non traduit).
  const french = locale === 'fr' ? all : await getPublications(type, 'fr')
  const frenchById = new Map(french.map((p) => [p.id, p]))

  const years = [...new Set(all.map((p) => p.date.slice(0, 4)))].sort().reverse()
  const results = all.filter((p) => {
    if (year && p.date.slice(0, 4) !== year) return false
    if (!search.trim()) return true
    const fr = frenchById.get(p.id)
    // L'adresse du fichier compte aussi : WordPress cherchait dans le contenu de
    // l'article, qui contenait le lien complet (« echos » trouvait
    // https://capitello.fr/wp-content/…/Les-Echos-….pdf).
    const link = p.searchLink?.startsWith('/wp-content/') ? LEGACY_ORIGIN + p.searchLink : p.searchLink || ''
    return matches([p.title, p.summary || '', fr?.title || '', fr?.summary || '', link], search)
  })

  return (
    <>
      <div className={`${v.list}-filters`}>
        <form method="GET" className={`${v.list}-filter-form`} action={localizePath(locale, v.path)}>
          <div className={`${v.list}-search`}>
            <label htmlFor="search">{ui.search}</label>
            <input type="text" id="search" name="search" defaultValue={search} placeholder={ui.results(results.length)} />
            <button type="submit">
              <img src="/wp-content/uploads/2025/02/search-icon.png" alt="" />
            </button>
          </div>
          <div className={`${v.list}-year`}>
            <YearSelect id={v.yearParam} years={years} value={year} label={ui.allYears} />
          </div>
        </form>
      </div>
      {results.length === 0 ? (
        <p>{ui.noResults}</p>
      ) : (
        <div className={`${v.list}-container`}>
          {results.map((publication) => (
            <Item key={publication.id} publication={publication} prefix={v.item} locale={locale} />
          ))}
        </div>
      )}
    </>
  )
}

function YearSelect({ id, years, value, label }: { id: string; years: string[]; value: string; label: string }) {
  return (
    <select id={id} name={id} defaultValue={value} data-autosubmit="">
      <option value="">{label}</option>
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}

function Item({ publication, prefix, locale }: { publication: PublicationView; prefix: string; locale: Locale }) {
  const ui = UI[locale]
  const tags = publication.type === 'media' ? (publication.isVideo ? [ui.video] : []) : publication.tags
  const label =
    publication.type === 'communique' ? ui.readRelease : publication.isVideo ? ui.watchVideo : ui.learnMore
  const paragraphs = (publication.summary || '').split(/\n\s*\n/).filter((p) => p.trim())

  return (
    <div className={`${prefix}-item`}>
      <div className={`${prefix}-thumbnail`}>
        {publication.thumbnail && (
          <img
            loading="lazy"
            decoding="async"
            width={publication.thumbnail.width || undefined}
            height={publication.thumbnail.height || undefined}
            src={publication.thumbnail.src}
            className="attachment-full size-full wp-post-image"
            alt=""
          />
        )}
        {tags.length > 0 && (
          <div className={`${prefix}-tags`}>
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={`${prefix}-meta`}>
        <span className={`${prefix}-date`}>{publication.dateLabel ?? formatLongDate(locale, publication.date)}</span>
        <h2 className={`${prefix}-title`}>{publication.title}</h2>
        <div className={`${prefix}-content`}>
          {paragraphs.map((html, i) => (
            // Le chapô peut contenir du HTML en ligne (<sup>, <em>…).
            <p key={i} className="wp-block-paragraph" dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>
        {publication.href && (
          <a href={publication.href} className={`${prefix}-file-button`} target="_blank" rel="noopener noreferrer">
            {label}
            <img decoding="async" src="/wp-content/uploads/2025/02/lirebtn.png" className="" alt="" />
          </a>
        )}
      </div>
    </div>
  )
}
