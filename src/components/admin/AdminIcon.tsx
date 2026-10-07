/**
 * Remplace le cube par défaut de Payload (fil d'Ariane, navigation repliée)
 * par l'équerre qui accompagne les titres du site Capitello.
 */
export function AdminIcon() {
  return (
    <svg className="graphic-icon" height="100%" width="100%" viewBox="0 0 27 27" fill="none" aria-hidden="true">
      <path d="M26.5 4L4 4L4 27" stroke="var(--theme-elevation-1000)" strokeWidth="8" strokeLinejoin="round" />
    </svg>
  )
}

export default AdminIcon
