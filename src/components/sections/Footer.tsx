import type { SectionProps } from '@/i18n'
import { formatShortDate } from '@/lib/dates'
import type { PublicationView } from '@/lib/publications'

// « Dernières publications » : deux emplacements, chacun avec ses classes
// Elementor d'origine (les styles sont attachés à ces identifiants).
const LATEST_SLOTS = [
  { row: 'a8e0618', title: 'c726c85', date: 'ee55d2a' },
  { row: '2f3113b', title: '7aa2943', date: '891ff67' },
]

export function Footer({ t, l, latest }: SectionProps & { latest: PublicationView[] }) {
  return (
    <footer data-elementor-type="footer" data-elementor-id="101" className="elementor elementor-101 elementor-location-footer">
      <div className="elementor-element elementor-element-c8879b6 e-con-full e-flex e-con e-parent" id="footer">
        <div className="elementor-element elementor-element-ccc15f7 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-b935e2b elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img width={240} height={37} src="/wp-content/uploads/2025/02/logo-capitello-black.svg" className="attachment-medium size-medium wp-image-48" alt="" />
            </div>
          </div>
          <div className="elementor-element elementor-element-c4bf526 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h3 className="elementor-heading-title elementor-size-default" dangerouslySetInnerHTML={{ __html: t.ec4bf526 }} />
            </div>
          </div>
          <div className="elementor-element elementor-element-f53db5d e-con-full elementor-hidden-tablet elementor-hidden-mobile e-flex e-con e-child">
            <div className="elementor-element elementor-element-ced77b8 elementor-widget elementor-widget-heading">
              <div className="elementor-widget-container">
                <h3 className="elementor-heading-title elementor-size-default">{t.eced77b8}</h3>
              </div>
            </div>
            <div className="elementor-element elementor-element-c02b364 elementor-widget elementor-widget-image">
              <div className="elementor-widget-container">
                <a href="https://www.linkedin.com/company/capitello-group/" target="_blank">
                  <img src="/wp-content/uploads/2025/02/linkedin-logo-black.svg" title="linkedin-logo-black" alt="linkedin-logo-black" loading="lazy" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-c3276cc e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-6d451cd elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h1 className="elementor-heading-title elementor-size-default">{t.e6d451cd}</h1>
            </div>
          </div>
          <div className="elementor-element elementor-element-71547c2 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                <a href={l("/le-mot-du-president")}>{t.e71547c2}</a>
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-5e4d597 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                <a href={l("/qui-sommes-nous")}>{t.e5e4d597}</a>
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-69a71eb elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                <a href={l("/communiques-de-presse")}>{t.e69a71eb}</a>
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-edc9533 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                <a href={l("/dans-les-medias")}>{t.eedc9533}</a>
              </h2>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-1c9f5a3 e-flex e-con-boxed e-con e-child">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-8236fdc e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-7181e05 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h1 className="elementor-heading-title elementor-size-default">{t.e7181e05}</h1>
                </div>
              </div>
              <div className="elementor-element elementor-element-fa66aec elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <p className="elementor-heading-title elementor-size-default">
                    <a href="mailto:contact@capitello.fr">{t.efa66aec}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-291f764 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-75d0872 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h3 className="elementor-heading-title elementor-size-default">{t.e75d0872}</h3>
            </div>
          </div>
          {latest.slice(0, LATEST_SLOTS.length).map((publication, i) => {
            const slot = LATEST_SLOTS[i]
            return (
              <div key={publication.id} className={`elementor-element elementor-element-${slot.row} e-con-full e-flex e-con e-child`}>
                <div className={`elementor-element elementor-element-${slot.title} elementor-widget__width-initial elementor-widget elementor-widget-heading`}>
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">
                      <a href={publication.href || undefined} target="_blank">{publication.title}</a>
                    </p>
                  </div>
                </div>
                <div className={`elementor-element elementor-element-${slot.date} elementor-widget elementor-widget-heading`}>
                  <div className="elementor-widget-container">
                    <h3 className="elementor-heading-title elementor-size-default">{formatShortDate(publication.date)}</h3>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="elementor-element elementor-element-90a61d1 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-ab35977 e-con-full elementor-hidden-desktop e-flex e-con e-child">
              <div className="elementor-element elementor-element-ba6200d elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <p className="elementor-heading-title elementor-size-default">{t.eba6200d}</p>
                </div>
              </div>
              <div className="elementor-element elementor-element-010ab02 elementor-widget elementor-widget-image">
                <div className="elementor-widget-container">
                  <a href="https://www.linkedin.com/company/capitello-group/" target="_blank">
                    <img src="/wp-content/uploads/2025/02/linkedin-logo-black.svg" title="linkedin-logo-black" alt="linkedin-logo-black" loading="lazy" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="elementor-element elementor-element-d6f5744 e-con-full e-flex e-con e-parent">
        <div className="elementor-element elementor-element-fdbdb69 elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-text-editor">
          <div className="elementor-widget-container" dangerouslySetInnerHTML={{ __html: t.efdbdb69 }} />
        </div>
        <div className="elementor-element elementor-element-19a9cad elementor-hidden-desktop elementor-widget elementor-widget-text-editor">
          <div className="elementor-widget-container" dangerouslySetInnerHTML={{ __html: t.e19a9cad }} />
        </div>
      </div>
    </footer>
  )
}
