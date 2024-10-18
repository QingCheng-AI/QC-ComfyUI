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
// 保存原始的 fetch 函数
const originalFetch = window.fetch;

// 重写 fetch 函数
window.fetch = async function (url, options = {}) {
  // 确保 options 是一个对象
  options.headers = options.headers || {};
  // 获取localstorage中的token
  const token = localStorage.getItem('accessToken') || '';
  // 添加 Authorization 头
  options.headers['Authorization'] = token;

  // 调用原始的 fetch 函数
  return originalFetch(url, options);
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
