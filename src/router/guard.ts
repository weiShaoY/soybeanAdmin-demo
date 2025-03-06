import type { Router } from 'vue-router'

import { createProgressGuard } from './progress'

import { createDocumentTitleGuard } from './title'

import { handleRouteSwitch, initRoute } from './utils'

/**
 * 创建路由守卫
 *
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  // 创建进度条守卫
  createProgressGuard(router)

  // 创建路由守卫
  router.beforeEach(async (to, from, next) => {
    // 初始化路由
    const location = await initRoute(to)

    if (location) {
      next(location)
      return
    }

    // 正常切换路由
    handleRouteSwitch(to, from, next)
  })

  // 创建文档标题守卫
  createDocumentTitleGuard(router)
}
