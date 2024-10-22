// @ts-strict-ignore
import App from './App.vue'
import router from '@/router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n'
import { definePreset } from '@primevue/themes'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

import '@comfyorg/litegraph/style.css'
import '@/assets/css/style.css'
import 'primeicons/primeicons.css'

// 改动：重写fetch函数，添加 Authorization 头，进行用户身份鉴权
// 定义要添加的 header 键值对
const customHeader = {
  'Authorization': localStorage.getItem('accessToken') || ''
};

// 重写 window.fetch 函数
const originalFetch = window.fetch;
window.fetch = function(input, init = {}) {
  // 检查请求参数是否为格式化的对象
  if (typeof input === 'object' && input !== null) {
    // 如果 headers 属性不存在,则创建一个新的 Headers 对象
    if (!init.headers) {
      init.headers = new Headers();
    } else if (init.headers instanceof Headers) {
      // 如果 headers 已经是 Headers 对象,则创建一个新的副本
      init.headers = new Headers(init.headers);
    } else {
      // 如果 headers 是普通对象,则创建一个新的 Headers 对象
      init.headers = new Headers(Object.entries(init.headers));
    }

    // 添加自定义 header
    for (const [key, value] of Object.entries(customHeader)) {
      init.headers.append(key, value);
    }
  }

  // 调用原始的 fetch 函数
  return originalFetch(input, init);
};


const ComfyUIPreset = definePreset(Aura, {
  semantic: {
    primary: Aura['primitive'].blue
  }
})

const app = createApp(App)
const pinia = createPinia()
app.directive('tooltip', Tooltip)
app
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: ComfyUIPreset,
      options: {
        prefix: 'p',
        cssLayer: {
          name: 'primevue',
          order: 'primevue, tailwind-utilities'
        },
        // This is a workaround for the issue with the dark mode selector
        // https://github.com/primefaces/primevue/issues/5515
        darkModeSelector: '.dark-theme, :root:has(.dark-theme)'
      }
    }
  })
  .use(ConfirmationService)
  .use(ToastService)
  .use(pinia)
  .use(i18n)
  .mount('#vue-app')
