import type { Router } from 'vue-router'

import { useTitle } from '@vueuse/core'

import { createRouteGuard } from './routeGuard'

/**
 * 创建进度条守卫
 *
 * @param router - 路由实例
 */
export function createProgressGuard(router: Router) {
  // 在路由开始前启动进度条
  router.beforeEach((_to, _from, next) => {
    window.NProgress?.start?.()
    next()
  })

  // 在路由结束后完成进度条
  router.afterEach((_to) => {
    window.NProgress?.done?.()
  })
}

/**
 * 创建文档标题守卫
 *
 * @param router - 路由实例
 */
export function createDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    /** 路由元信息中的国际化键 */
    const { title } = to.meta

    /** 文档标题 */
    const documentTitle = title || ''

    // 设置文档标题
    useTitle(documentTitle as string)
  })
}

/**
 * 创建路由守卫
 *
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  // 创建进度条守卫
  createProgressGuard(router)

  // 创建路由守卫
  createRouteGuard(router)

  // 创建文档标题守卫
  createDocumentTitleGuard(router)
}
