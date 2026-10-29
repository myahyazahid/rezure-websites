<script setup lang="ts">
/**
 * Custom home layout, selected by `layout: Landing` in index.md — VitePress
 * renders any frontmatter `layout` that isn't doc/page/home as a globally
 * registered component, so this sits inside VPContent with the nav bar,
 * search, and theme toggle still supplied by the default theme.
 *
 * The default theme's `layout: home` was doing the job before, but its hero
 * and feature grid are the stock VitePress arrangement every VitePress site
 * shares — fine for docs, wrong for a product page.
 *
 * Every string here comes from index.md's frontmatter: this file owns the
 * arrangement, the markdown owns the copy, so wording changes never touch Vue.
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Action {
  text: string
  link: string
  theme?: 'brand' | 'alt' | 'ghost'
}

interface Hero {
  eyebrow?: string
  headline: string
  tagline?: string
  actions?: Action[]
}

interface Feature {
  title: string
  details: string
  icon?: string
  /** Docs page the card's title links to — gives crawlers a path from the home page into the guide. */
  link?: string
}

interface Cta {
  title: string
  text?: string
  action?: Action
  note?: string
}

/**
 * Official brand marks (Simple Icons, CC0-licensed path data), inlined so
 * icon lookup never costs a network request. Each is a single fill path on a
 * 0 0 24 24 viewBox, rendered in the brand's own hex (BRAND_COLORS) rather
 * than the site's red — the mark is only recognizable in its real color.
 * "windows" is deliberately absent: Simple Icons dropped it from their
 * current index (Microsoft trademark policy), so the one card without a
 * real 1:1 product match falls back to a plain generic icon instead.
 */
const BRAND_ICONS: Record<string, string> = {
  docker:
    '<path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>',
  nginx:
    '<path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z"/>',
  php:
    '<path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"/>',
  mariadb:
    '<path d="M23.157 4.412c-.676.284-.79.31-1.673.372-.65.045-.757.057-1.212.209-.75.246-1.395.75-2.02 1.59-.296.398-1.249 1.913-1.249 1.988 0 .057-.65.998-.915 1.32-.574.713-1.08 1.079-2.14 1.59-.77.36-1.224.524-4.102 1.477-1.073.353-2.133.738-2.367.864-.852.449-1.515 1.036-2.203 1.938-1.003 1.32-.972 1.313-3.042.947a12.264 12.264 0 00-.675-.063c-.644-.05-1.023.044-1.332.334L0 17.193l.177.088c.094.05.353.234.561.398.215.17.461.347.55.391.088.044.17.088.183.101.012.013-.089.17-.228.353-.435.581-.593.871-.574 1.048.019.164.032.17.43.17.517-.006.826-.056 1.261-.208.65-.233 2.058-.94 2.784-1.4.776-.5 1.717-.998 1.956-1.042.082-.02.354-.07.594-.114.58-.107 1.464-.095 2.587.05.108.013.373.045.6.064.227.025.43.057.454.076.026.012.474.037.998.056.934.026 1.104.007 1.3-.189.126-.133.385-.631.498-.985.209-.643.417-.921.366-.492-.113.966-.322 1.692-.713 2.411-.259.499-.663 1.092-.934 1.395-.322.347-.315.36.088.315.619-.063 1.471-.397 2.096-.82.827-.562 1.647-1.691 2.19-3.03.107-.27.22-.22.183.083-.013.094-.038.315-.057.498l-.031.328.353-.202c.833-.48 1.414-1.262 2.127-2.884.227-.518.877-2.922 1.073-3.976a9.64 9.64 0 01.271-1.042c.127-.429.196-.555.48-.858.183-.19.625-.555.978-.808.72-.505.953-.75 1.187-1.205.208-.417.284-1.13.132-1.357-.132-.202-.284-.196-.763.006Z"/>',
  tauri:
    '<path d="M13.912 0a8.72 8.72 0 0 0-8.308 6.139c1.05-.515 2.18-.845 3.342-.976 2.415-3.363 7.4-3.412 9.88-.097 2.48 3.315 1.025 8.084-2.883 9.45a6.131 6.131 0 0 1-.3 2.762 8.72 8.72 0 0 0 3.01-1.225A8.72 8.72 0 0 0 13.913 0zm.082 6.451a2.284 2.284 0 1 0-.15 4.566 2.284 2.284 0 0 0 .15-4.566zm-5.629.27a8.72 8.72 0 0 0-3.031 1.235 8.72 8.72 0 1 0 13.06 9.9131 10.173 10.174 0 0 1-3.343.965 6.125 6.125 0 1 1-7.028-9.343 6.114 6.115 0 0 1 .342-2.772zm1.713 6.27a2.284 2.284 0 0 0-2.284 2.283 2.284 2.284 0 0 0 2.284 2.284 2.284 2.284 0 0 0 2.284-2.284 2.284 2.284 0 0 0-2.284-2.284z"/>',
  postgresql:
    '<path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z"/>',
  nodedotjs:
    '<path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>'
}

/** Each mark's real-world hex (Simple Icons' documented brand color) — the whole point of using an official logo is that it's only recognizable in its own color. */
const BRAND_COLORS: Record<string, string> = {
  docker: '#2496ED',
  nginx: '#009639',
  php: '#777BB4',
  mariadb: '#003545',
  tauri: '#24C8D8',
  postgresql: '#4169E1',
  nodedotjs: '#5FA04E'
}

const { frontmatter } = useData()

const hero = computed<Hero | null>(() => frontmatter.value.hero ?? null)
const features = computed<Feature[]>(() => frontmatter.value.features ?? [])
const reasons = computed<Feature[]>(() => frontmatter.value.reasons ?? [])
const cta = computed<Cta | null>(() => frontmatter.value.cta ?? null)

/** Anything not starting a scheme is an in-site route, which VitePress's router intercepts. */
const isExternal = (link: string) => /^https?:\/\//.test(link)
</script>

<template>
  <div class="Landing">
    <!-- ---------- Hero ---------- -->
    <section v-if="hero" class="hero">
      <div class="glow" aria-hidden="true" />

      <div class="container">
        <p v-if="hero.eyebrow" class="eyebrow">{{ hero.eyebrow }}</p>

        <h1 class="headline">{{ hero.headline }}</h1>

        <p v-if="hero.tagline" class="tagline">{{ hero.tagline }}</p>

        <div v-if="hero.actions?.length" class="actions">
          <a
            v-for="action in hero.actions"
            :key="action.link"
            class="btn"
            :class="`btn-${action.theme ?? 'brand'}`"
            :href="action.link"
            :data-track="`hero:${action.link}`"
            :target="isExternal(action.link) ? '_blank' : undefined"
            :rel="isExternal(action.link) ? 'noreferrer' : undefined"
          >
            {{ action.text }}
          </a>
        </div>
      </div>
    </section>

    <!-- ---------- Features ---------- -->
    <section v-if="features.length" class="section">
      <div class="container">
        <h2 v-if="frontmatter.featuresTitle" class="section-title">
          {{ frontmatter.featuresTitle }}
        </h2>

        <div class="feature-grid">
          <article v-for="feature in features" :key="feature.title" class="card">
            <span
              class="icon"
              aria-hidden="true"
              :style="BRAND_ICONS[feature.icon ?? ''] ? { color: BRAND_COLORS[feature.icon!] } : undefined"
            >
              <svg v-if="BRAND_ICONS[feature.icon ?? '']" viewBox="0 0 24 24" fill="currentColor" v-html="BRAND_ICONS[feature.icon!]" />
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v10" />
                <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
              </svg>
            </span>

            <h3>
              <a v-if="feature.link" :href="feature.link" :data-track="`feature:${feature.link}`">{{ feature.title }}</a>
              <template v-else>{{ feature.title }}</template>
            </h3>
            <p>{{ feature.details }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ---------- Why Rezure ---------- -->
    <section v-if="reasons.length" class="section section-alt">
      <div class="container">
        <h2 v-if="frontmatter.whyTitle" class="section-title">{{ frontmatter.whyTitle }}</h2>
        <p v-if="frontmatter.whyLede" class="section-lede">{{ frontmatter.whyLede }}</p>

        <div class="reason-grid">
          <article v-for="(reason, index) in reasons" :key="reason.title" class="reason">
            <span class="reason-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ reason.title }}</h3>
            <p>{{ reason.details }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ---------- Closing call to action ---------- -->
    <section v-if="cta" class="section">
      <div class="container">
        <div class="cta">
          <h2>{{ cta.title }}</h2>
          <p v-if="cta.text">{{ cta.text }}</p>

          <div v-if="cta.action" class="actions">
            <a
              class="btn btn-brand"
              :href="cta.action.link"
              :data-track="`closing_cta:${cta.action.link}`"
              :target="isExternal(cta.action.link) ? '_blank' : undefined"
              :rel="isExternal(cta.action.link) ? 'noreferrer' : undefined"
            >
              {{ cta.action.text }}
            </a>
          </div>

          <p v-if="cta.note" class="cta-note">{{ cta.note }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ---------- Hero ---------- */

.hero {
  position: relative;
  overflow: hidden;
  padding: 72px 0 24px;
  text-align: center;
}

.glow {
  position: absolute;
  inset: -240px 0 auto 0;
  height: 640px;
  background: radial-gradient(closest-side, var(--brand-glow), transparent 70%);
  pointer-events: none;
}

.hero .container {
  position: relative;
}

.eyebrow {
  display: inline-block;
  margin: 0 0 20px;
  padding: 6px 16px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background-color: var(--brand-soft);
  color: var(--brand-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.02em;
}

.headline {
  max-width: 760px;
  margin: 0 auto;
  font-size: 56px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--foreground);
}

.tagline {
  max-width: 620px;
  margin: 24px auto 0;
  font-size: 19px;
  line-height: 1.6;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

.btn {
  display: inline-block;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  line-height: 44px;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.btn-brand {
  background-color: var(--brand);
  color: #fff;
}

.btn-brand:hover {
  background-color: var(--brand-hover);
}

.btn-alt {
  border-color: var(--border-color);
  background-color: var(--surface);
  color: var(--foreground);
}

.btn-alt:hover {
  border-color: var(--brand);
  color: var(--brand-text);
}

.btn-ghost {
  color: var(--muted);
}

.btn-ghost:hover {
  color: var(--foreground);
}

/* ---------- Sections ---------- */

.section {
  padding: 88px 0;
}

.section-alt {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-raised);
}

.section-title {
  max-width: 640px;
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.section-lede {
  max-width: 680px;
  margin: 16px 0 0;
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
}

/* ---------- Feature cards ---------- */

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 44px;
}

.card {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: var(--surface);
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: var(--brand);
  transform: translateY(-2px);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  /* Fixed light chip in both themes so a brand mark's
     own hex — set inline per feature — stays legible in dark mode too; the
     one generic icon falls back to the site's red. */
  background-color: #f0ecec;
  color: var(--brand-text);
}

.icon svg {
  width: 20px;
  height: 20px;
}

.card h3 {
  margin: 18px 0 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.card h3 a {
  color: inherit;
  text-decoration: none;
}

/* Stretch the title link over the whole card so the card is the click target. */
.card {
  position: relative;
}

.card h3 a::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.card p {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
}

/* ---------- Why Rezure ---------- */

.reason-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 48px;
}

.reason-index {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  color: var(--brand-text);
}

.reason h3 {
  margin: 12px 0 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.reason p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

/* ---------- Closing CTA ---------- */

.cta {
  padding: 64px 32px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background-color: var(--surface);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.cta h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.cta > p {
  max-width: 540px;
  margin: 14px auto 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
}

.cta .actions {
  margin-top: 28px;
}

.cta-note {
  margin: 18px 0 0;
  font-size: 13px;
  color: var(--subtle);
}

/* ---------- Responsive ---------- */

@media (max-width: 959px) {
  .headline {
    font-size: 42px;
  }

  .feature-grid,
  .reason-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 639px) {
  .hero {
    padding-top: 48px;
  }

  .headline {
    font-size: 32px;
  }

  .tagline {
    font-size: 17px;
  }

  .section {
    padding: 64px 0;
  }

  .section-title {
    font-size: 26px;
  }

  .feature-grid,
  .reason-grid {
    grid-template-columns: 1fr;
  }

  .cta {
    padding: 44px 20px;
  }

  .cta h2 {
    font-size: 26px;
  }
}
</style>
