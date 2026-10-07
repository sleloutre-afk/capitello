import Script from 'next/script'

/**
 * Identifiant du widget Elfsight « LinkedIn Feed » affiché page « Le mot du
 * président » : il suit le profil LinkedIn d'Arnaud Molinié et montre
 * automatiquement ses dernières publications. Le widget (compte suivi,
 * mise en forme) se règle dans le compte Elfsight qui le possède ; pour en
 * changer, remplacer cet identifiant par celui du nouveau widget.
 */
const ELFSIGHT_WIDGET_ID = 'c3e87897-e4a2-46ad-92be-35b417762b14'

/**
 * Le widget est intégré directement dans la page (script Elfsight), et non
 * dans un cadre de hauteur fixe comme sur le site d'origine : il prend la
 * hauteur de la publication affichée, qui n'est donc plus coupée.
 */
export function LinkedinFeed() {
  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      {/* `linkedin-feed` : largeur et centrage, voir src/styles/site.css */}
      <div className="linkedin-feed">
        <div className={`elfsight-app-${ELFSIGHT_WIDGET_ID}`} data-elfsight-app-lazy="" />
      </div>
    </>
  )
}
