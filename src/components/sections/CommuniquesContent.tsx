import type { ReactNode } from 'react'

export function CommuniquesContent({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-elementor-type="wp-page" data-elementor-id="517" className="elementor elementor-517">
      <div className="elementor-element elementor-element-39c7544 e-con-full e-flex e-con e-parent">
        <div className="elementor-element elementor-element-8aa34d2 elementor-widget elementor-widget-html" id="cp">
          <div className="elementor-widget-container">
            <h1 className="page-custom-title">
              <img decoding="async" src="/wp-content/uploads/2025/02/border.svg" /> {title}
            </h1>
          </div>
        </div>
        <div className="elementor-element elementor-element-b49d20f e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-887005c e-transform elementor-widget elementor-widget-button">
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <a className="elementor-button elementor-button-link elementor-size-sm" href="#cp">
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-icon">
                      <svg aria-hidden="true" className="e-font-icon-svg e-far-arrow-alt-circle-up" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 504c137 0 248-111 248-248S393 8 256 8 8 119 8 256s111 248 248 248zm0-448c110.5 0 200 89.5 200 200s-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56zm20 328h-40c-6.6 0-12-5.4-12-12V256h-67c-10.7 0-16-12.9-8.5-20.5l99-99c4.7-4.7 12.3-4.7 17 0l99 99c7.6 7.6 2.2 20.5-8.5 20.5h-67v116c0 6.6-5.4 12-12 12z" /></svg>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="elementor-element elementor-element-717fdbc e-flex e-con-boxed e-con e-parent">
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-6d3d238 elementor-widget elementor-widget-communique_widget">
            <div className="elementor-widget-container">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
