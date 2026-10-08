/**
 * Aide affichée sous le champ « Fichier à ouvrir » d'une news « Dans les
 * médias » : poids maximum, poids conseillé et lien vers le mode d'emploi
 * de compression d'une vidéo (public/admin-help/compresser-une-video.pdf).
 */
export function VideoFileHelp() {
  return (
    // Un seul élément enfant : le conteneur de Payload est en flex et
    // alignerait sinon le texte, le lien et le point final en colonnes.
    <div className="field-description">
      <span>
        Fichier ouvert par le bouton de la publication. Prioritaire sur le lien externe. Poids maximum : 200 Mo, mais
        nous conseillons un poids max de 20 Mo.{' '}
        <a href="/admin-help/compresser-une-video.pdf" target="_blank" rel="noopener noreferrer">
          Découvrez comment réduire la taille d’une vidéo avant de l’intégrer
        </a>
        .
      </span>
    </div>
  )
}

export default VideoFileHelp
