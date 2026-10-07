'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { LOCALES, localizePath, type Locale } from '@/lib/locales'

const NAMES: Record<Locale, { label: string; english: string }> = {
  fr: { label: 'Français', english: 'French' },
  en: { label: 'English', english: 'English' },
  es: { label: 'Español', english: 'Spanish' },
  zh: { label: '中文 (简体)', english: 'Simplified Chinese' },
}

/**
 * Sélecteur de langue en bas à droite. Reprend le balisage du sélecteur
 * Weglot d'origine (ses styles : src/styles/legacy/*weglot*.css).
 */
export function LanguageSwitcher({ locale, path }: { locale: Locale; path: string }) {
  const id = useId()
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.country-selector')) setChecked(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <aside
      ref={ref}
      data-wg-notranslate=""
      // « weglot-invert » : la liste s'ouvre vers le haut (sélecteur fixé en bas de l'écran).
      className={`country-selector weglot-dropdown close_outside_click ${open ? '' : 'closed '}weglot-default wg- weglot-invert`}
      tabIndex={0}
      aria-expanded={open}
      aria-label={`Language selected: ${NAMES[locale].english}`}
      onMouseDown={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setOpen((value) => !value)
          setChecked((value) => !value)
        } else if (event.key === 'Escape' && open) {
          setOpen(false)
          setChecked(false)
        }
      }}
    >
      <input
        id={id}
        className="weglot_choice"
        type="checkbox"
        name="menu"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <label
        data-l={locale}
        tabIndex={-1}
        htmlFor={id}
        className={`wgcurrent wg-li weglot-lang weglot-language weglot-flags flag-0 wg-${locale}`}
        data-code-language={`wg-${locale}`}
        data-name-language={NAMES[locale].label}
      >
        <span className="wglanguage-name">{NAMES[locale].label}</span>
      </label>
      <ul role="none">
        {LOCALES.filter((other) => other !== locale).map((other) => (
          <li
            key={other}
            data-l={other}
            className={`wg-li weglot-lang weglot-language weglot-flags flag-0 wg-${other}`}
            data-code-language={other}
            role="option"
            aria-selected={false}
          >
            <a
              title={`Language switcher : ${NAMES[other].english}`}
              className={`weglot-language-${other}`}
              data-wg-notranslate=""
              href={localizePath(other, path)}
            >
              {NAMES[other].label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
