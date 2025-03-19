import type { RouteKey } from '@elegant-router/types'

import type { Router } from 'vue-router'

import { useRouteStore } from '@/store/modules/route'

/**
 * 创建路由守卫
 * @param router - 路由实例
 */
export function createRouteGuard(router: Router) {
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

        const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath

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
