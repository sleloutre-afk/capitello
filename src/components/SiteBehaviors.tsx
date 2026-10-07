'use client'

import { useEffect } from 'react'
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper'

type CarouselSettings = {
  slides_to_show?: string
  slides_to_show_tablet?: string
  slides_to_show_mobile?: string
  slides_to_scroll?: string
  autoplay?: string
  autoplay_speed?: number
  pause_on_hover?: string
  pause_on_interaction?: string
  infinite?: string
  speed?: number
  arrows?: string
  pagination?: string
  image_spacing_custom?: { size?: number | string }
}

/**
 * Comportements JavaScript du site d'origine, repris tels quels :
 *  - en-tête : couleurs au défilement (accueil) et menu burger (mobile) ;
 *  - carrousels Elementor (Swiper, mêmes réglages que le widget d'origine) ;
 *  - filtre par année : envoi du formulaire dès la sélection.
 */
export function SiteBehaviors({ header }: { header: 'home' | 'inner' }) {
  useEffect(() => {
    const cleanups: Array<() => void> = []
    const all = <T extends HTMLElement>(selector: string) => Array.from(document.querySelectorAll<T>(selector))
    const show = (elements: HTMLElement[], visible: boolean) =>
      elements.forEach((el) => (el.style.display = visible ? 'block' : 'none'))

    const navbars = all('.navbar-capitello')
    const whiteLogos = all('.white-logo')
    const blackLogos = all('.black-logo')
    const whiteIcons = all('.white-icons')
    const blackIcons = all('.black-icons')
    const burgerContent = document.getElementById('burger-content')
    const openButtons = all('.open-menu')
    const closeButton = document.getElementById('close-menu')

    // Accueil : en-tête transparent à texte blanc en haut de page, blanc à
    // texte noir dès que l'on défile.
    if (header === 'home') {
      const onScroll = () => {
        const scrolled = window.scrollY > 0
        const hero = document.getElementById('hero-capitello')
        if (hero) hero.style.zIndex = '1'
        navbars.forEach((nav) => {
          nav.style.background = scrolled ? '#FFFF' : 'transparent'
          nav.style.zIndex = '2'
        })
        show(whiteLogos, !scrolled)
        show(blackLogos, scrolled)
        show(whiteIcons, !scrolled)
        show(blackIcons, scrolled)
        all('.text-color-change > div > p').forEach((p) => (p.style.color = scrolled ? '#000000' : '#FFFF'))
      }
      window.addEventListener('scroll', onScroll)
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
    }

    // Menu burger (tablette / mobile).
    if (burgerContent && closeButton) {
      const open = () => {
        burgerContent.style.display = 'flex'
        closeButton.style.display = 'block'
        document.body.style.overflow = 'hidden'
        show(openButtons, false)
        navbars.forEach((nav) => (nav.style.background = '#E0CEAD'))
        if (header === 'home') {
          show(whiteLogos, false)
          show(blackLogos, true)
        }
      }
      const close = () => {
        burgerContent.style.display = 'none'
        closeButton.style.display = 'none'
        document.body.style.overflow = ''
        show(openButtons, true)
        if (header === 'home') {
          const scrolled = window.scrollY > 0
          navbars.forEach((nav) => (nav.style.background = scrolled ? '#FFFF' : 'transparent'))
          show(whiteLogos, !scrolled)
          show(whiteIcons, !scrolled)
          show(blackLogos, scrolled)
          show(blackIcons, scrolled)
        } else {
          navbars.forEach((nav) => (nav.style.background = '#FFFF'))
        }
      }
      openButtons.forEach((button) => button.addEventListener('click', open))
      closeButton.addEventListener('click', close)
      cleanups.push(() => {
        openButtons.forEach((button) => button.removeEventListener('click', open))
        closeButton.removeEventListener('click', close)
        document.body.style.overflow = ''
      })
    }

    // Carrousels Elementor (« nested carousel »).
    all('.elementor-widget-n-carousel').forEach((widget) => {
      const container = widget.querySelector<HTMLElement>('.e-n-carousel.swiper')
      if (!container) return
      const settings: CarouselSettings = JSON.parse(widget.dataset.settings || '{}')
      const desktop = Number(settings.slides_to_show) || 3
      const space = Number(settings.image_spacing_custom?.size) || 0
      const swiper = new Swiper(container, {
        modules: [Autoplay, Navigation, Pagination],
        slidesPerView: desktop,
        slidesPerGroup: Number(settings.slides_to_scroll) || 1,
        spaceBetween: space,
        loop: settings.infinite === 'yes',
        speed: settings.speed,
        // Points de rupture Elementor : mobile ≤ 767 px, tablette ≤ 1024 px.
        breakpoints: {
          0: { slidesPerView: Number(settings.slides_to_show_mobile) || 1, slidesPerGroup: 1, spaceBetween: space },
          768: { slidesPerView: Number(settings.slides_to_show_tablet) || 2, slidesPerGroup: 1, spaceBetween: space },
          1025: { slidesPerView: desktop, slidesPerGroup: Number(settings.slides_to_scroll) || 1, spaceBetween: space },
        },
        autoplay:
          settings.autoplay === 'yes'
            ? { delay: settings.autoplay_speed, disableOnInteraction: settings.pause_on_interaction === 'yes' }
            : false,
        navigation:
          settings.arrows === 'yes'
            ? {
                prevEl: widget.querySelector<HTMLElement>('.elementor-swiper-button-prev'),
                nextEl: widget.querySelector<HTMLElement>('.elementor-swiper-button-next'),
              }
            : false,
        pagination: settings.pagination
          ? { el: widget.querySelector<HTMLElement>('.swiper-pagination'), type: 'bullets', clickable: true }
          : false,
      })
      if (settings.autoplay === 'yes' && settings.pause_on_hover === 'yes') {
        const stop = () => swiper.autoplay.stop()
        const start = () => swiper.autoplay.start()
        container.addEventListener('mouseenter', stop)
        container.addEventListener('mouseleave', start)
        cleanups.push(() => {
          container.removeEventListener('mouseenter', stop)
          container.removeEventListener('mouseleave', start)
        })
      }
      cleanups.push(() => swiper.destroy(true, true))
    })

    // Filtre par année des listes de publications.
    all<HTMLSelectElement>('select[data-autosubmit]').forEach((select) => {
      const submit = () => select.form?.submit()
      select.addEventListener('change', submit)
      cleanups.push(() => select.removeEventListener('change', submit))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [header])

  return null
}
