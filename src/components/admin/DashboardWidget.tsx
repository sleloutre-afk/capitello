import type { ReactNode } from 'react'
import { Button } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import type { PayloadRequest } from 'payload'

type WidgetProps = {
  permissions?: { collections?: Record<string, { create?: boolean }> }
  req: PayloadRequest
}

const ICONS = {
  // Porte-voix
  communiques: (
    <>
      <path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  // Journal
  news: (
    <>
      <path d="M4 5h13v13a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M17 9h3v9a2 2 0 0 1-2 2" />
      <path d="M7.5 9h6M7.5 12.5h6M7.5 16h3.5" />
    </>
  ),
  // Dossier
  media: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M8 15.5l2.5-3 2 2.2 1.5-1.7 2 2.5" />
    </>
  ),
}

function Picto({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

/** Bloc principal d'une rubrique : présentation, compteurs, « Publier » et « Voir tout ». */
function Hero({
  slug,
  title,
  text,
  stats,
  createLabel,
  listLabel,
  canCreate,
  adminRoute,
}: {
  slug: 'communiques' | 'news'
  title: string
  text: string
  stats: ReactNode
  createLabel: string
  listLabel: string
  canCreate: boolean
  adminRoute: string
}) {
  return (
    <section className={`capitello-widget capitello-widget--hero capitello-widget--${slug}`}>
      <div className="capitello-widget__badge">
        <Picto name={slug} />
      </div>
      <div className="capitello-widget__body">
        <h2 className="capitello-widget__title">{title}</h2>
        <p className="capitello-widget__text">{text}</p>
        <div className="capitello-widget__stats">{stats}</div>
      </div>
      <div className="capitello-widget__actions">
        {canCreate && (
          <Button el="link" to={formatAdminURL({ adminRoute, path: `/collections/${slug}/create` })} buttonStyle="primary">
            {createLabel}
          </Button>
        )}
        <Button el="link" to={formatAdminURL({ adminRoute, path: `/collections/${slug}` })} buttonStyle="secondary">
          {listLabel}
        </Button>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="capitello-widget__stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

const plural = (n: number, one: string, many: string) => (n > 1 ? many : one)

/**
 * Tableau de bord du BO : les deux rubriques gérées (Communiqués de presse,
 * Dans les médias) à gauche, la bibliothèque de fichiers sur toute la
 * hauteur à droite. Un seul widget pleine largeur — voir `admin.dashboard`
 * dans payload.config.ts ; mise en forme dans src/app/(payload)/custom.scss.
 */
export async function DashboardWidget({ permissions, req }: WidgetProps) {
  const { payload } = req
  const adminRoute = payload.config.routes.admin
  const published = { _status: { equals: 'published' } } as const

  const [communiques, communiquesPublished, news, newsPublished, files] = await Promise.all([
    payload.count({ collection: 'communiques' }),
    payload.count({ collection: 'communiques', where: published }),
    payload.count({ collection: 'news' }),
    payload.count({ collection: 'news', where: published }),
    payload.count({ collection: 'media' }),
  ])
  const can = (slug: string) => Boolean(permissions?.collections?.[slug]?.create)
  const mediaHref = formatAdminURL({ adminRoute, path: '/collections/media' })

  return (
    <div className="capitello-dashboard">
      <Hero
        slug="communiques"
        title="Communiqués de presse"
        text="Publiez les communiqués du groupe et de ses filiales, avec leur visuel et leur PDF — visibles sur le site dès leur mise en ligne."
        stats={
          <>
            <Stat value={communiques.totalDocs} label={plural(communiques.totalDocs, 'communiqué', 'communiqués')} />
            <Stat value={communiquesPublished.totalDocs} label={plural(communiquesPublished.totalDocs, 'publié', 'publiés')} />
          </>
        }
        createLabel="Publier un CP"
        listLabel="Voir tous les CP"
        canCreate={can('communiques')}
        adminRoute={adminRoute}
      />
      <Hero
        slug="news"
        title="Dans les médias"
        text="Ajoutez les retombées presse, radio et télé : le logo du média, puis l’article en PDF, la vidéo ou un lien vers le site du média."
        stats={
          <>
            <Stat value={news.totalDocs} label="news" />
            <Stat value={newsPublished.totalDocs} label={plural(newsPublished.totalDocs, 'publiée', 'publiées')} />
          </>
        }
        createLabel="Publier une news"
        listLabel="Voir toutes les news"
        canCreate={can('news')}
        adminRoute={adminRoute}
      />
      <section className="card card--has-onclick capitello-widget capitello-widget--card" id="card-media">
        <div className="capitello-widget--card__head">
          <div className="capitello-widget__badge capitello-widget__badge--sm">
            <Picto name="media" />
          </div>
          {can('media') && (
            <div className="card__actions">
              <Button
                aria-label="Ajouter un fichier à la bibliothèque"
                buttonStyle="icon-label"
                el="link"
                icon="plus"
                iconStyle="with-border"
                round
                to={formatAdminURL({ adminRoute, path: '/collections/media/create' })}
              />
            </div>
          )}
        </div>
        <h3 className="card__title">Bibliothèque</h3>
        <p className="capitello-widget__text">
          Les images, PDF et vidéos déjà envoyés depuis les publications, à réutiliser sans les re-uploader.
        </p>
        <div className="capitello-widget__stats">
          <Stat value={files.totalDocs} label={plural(files.totalDocs, 'fichier', 'fichiers')} />
        </div>
        <Button aria-label="Voir toute la bibliothèque" buttonStyle="none" className="card__click" el="link" to={mediaHref} />
      </section>
    </div>
  )
}

export default DashboardWidget
