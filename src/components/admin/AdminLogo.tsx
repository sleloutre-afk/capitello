/**
 * Remplace le logo Payload de l'écran de connexion par le logo Capitello
 * Group (version noire en thème clair, blanche en thème sombre — bascule
 * dans custom.scss).
 */
export function AdminLogo() {
  return (
    <span className="graphic-logo capitello-logo">
      <img className="capitello-logo__light" src="/wp-content/uploads/2025/02/logo-capitello-black.svg" width={240} height={37} alt="Capitello Group" />
      <img className="capitello-logo__dark" src="/wp-content/uploads/2025/02/logo-capitello.svg" width={240} height={37} alt="Capitello Group" />
    </span>
  )
}

export default AdminLogo
