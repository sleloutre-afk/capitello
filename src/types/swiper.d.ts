// Swiper 8 (version utilisée par le site d'origine) ne déclare pas ses types
// dans le champ « exports » de son package.json.
declare module 'swiper' {
  import SwiperClass from 'swiper/types/swiper-class'
  import type { SwiperModule } from 'swiper/types'
  export default SwiperClass
  export const Autoplay: SwiperModule
  export const Navigation: SwiperModule
  export const Pagination: SwiperModule
}
