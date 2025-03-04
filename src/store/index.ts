import type { App } from 'vue'

import { createPinia } from 'pinia'

import { resetSetupStore } from './plugins'

/**
 * 设置 Vue Store 插件 Pinia
 *
 * @param {App} app Vue 应用实例
 */
export function setupStore(app: App) {
  const store = createPinia()

  store.use(resetSetupStore)

  app.use(store)
}
