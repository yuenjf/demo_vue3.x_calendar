/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// vue3.x + Ts 里使用swiper6, 需添加下面两行代码
declare module 'swiper/vue'
declare module 'swiper'

// 导入日历组件
declare module 'lunar-calendar'




