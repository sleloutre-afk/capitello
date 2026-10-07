/**
 * Lien de retour au tableau de bord, affiché en haut de la navigation du BO
 * (au-dessus du groupe « Menu »). Payload ne fournit pas ça par défaut dans
 * cette disposition de nav — voir `admin.components.beforeNavLinks` dans
 * payload.config.ts.
 */
export function DashboardLink() {
  return (
    <div className="dashboard-link-wrap">
      <style>{`
        /* Aligné à gauche sur les liens de la nav (.nav__link) : pas de
           retrait horizontal propre, on hérite du gutter de .nav__scroll.
           Juste une marge basse pour séparer du 1er groupe en dessous. */
        .dashboard-link-wrap {
          padding: 2px 0 0;
          margin-bottom: 20px;
        }
        .dashboard-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 13px;
          font-weight: 600;
          color: var(--theme-elevation-800);
          text-decoration: none;
          transition: color 0.1s;
        }
        /* Même effet que les liens de la nav (.nav__link:hover). */
        .dashboard-link:hover,
        .dashboard-link:focus-visible {
          color: var(--theme-elevation-1000);
          text-decoration: underline;
        }
      `}</style>
      <a href="/BO" className="dashboard-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
        </svg>
        Tableau de bord
      </a>
    </div>
  )
}

export default DashboardLink
