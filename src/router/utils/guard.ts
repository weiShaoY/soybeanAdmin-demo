import type { RouteKey } from '@elegant-router/types'

import type { Router } from 'vue-router'

import { useRouteStore } from '@/store/modules/route'

import { useTitle } from '@vueuse/core'

/**
 * 创建进度条守卫
 *
 * @param router - 路由实例
 */
function createProgressGuard(router: Router) {
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
function createDocumentTitleGuard(router: Router) {
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
 * @param router - 路由实例
 */
function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const routeStore = useRouteStore()

    const notFoundRoute: RouteKey = 'not-found'

    const isNotFoundRoute = to.name === notFoundRoute

    // 初始化路由 Store（如果未初始化）
    if (!routeStore.isInitRouteStore) {
      await routeStore.initRouteStore()

      // 如果当前路由是 "not-found"，重定向到原始路由
      if (isNotFoundRoute) {
        const rootRoute: RouteKey = 'root'

        const path = to.redirectedFrom?.name === rootRoute ? '/' : to.path

        next({
          path,
          replace: true,
          query: to.query,
          hash: to.hash,
        })
        return
      }
    }

    // 处理带有 href 的路由
    if (to.meta.href) {
      window.open(to.meta.href, '_blank')
      next({
        path: from.fullPath,
        replace: true,
        query: from.query,
        hash: to.hash,
      })
      return
    }

    // 正常导航
    next()
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
