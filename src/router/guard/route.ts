import type { RouteKey, RoutePath } from '@elegant-router/types'

import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
} from 'vue-router'

import { useRouteStore } from '@/store/modules/route'

/**
 * 创建路由守卫
 *
 * @param router - 路由实例
 */
export function createRouteGuard(router: Router) {
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
}

/**
 * 初始化路由
 *
 * @param to - 目标路由
 * @returns 重定向路由对象或 null
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const routeStore = useRouteStore()

  /**
   * 未找到路由的路由名
   */
  const notFoundRoute: RouteKey = 'not-found'

  /**
   *  是否为未找到路由
   */
  const isNotFoundRoute = to.name === notFoundRoute



  if (!routeStore.isInitAuthRoute) {
    // 初始化权限路由
    await routeStore.initAuthRoute()

    // 因为权限路由未初始化，路由被 "not-found" 路由捕获
    // 初始化权限路由后，重定向到原始路由
    if (isNotFoundRoute) {
      const rootRoute: RouteKey = 'root'

      const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath

      const location: RouteLocationRaw = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash,
      }

      return location
    }
  }

  // 权限路由已初始化
  // 如果不是 "not-found" 路由，则允许访问
  if (!isNotFoundRoute) {
    return null
  }

  // 被 "not-found" 路由捕获，检查路由是否存在
  const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath)

  /** 无权限路由名 */
  const noPermissionRoute: RouteKey = '403'

  if (exist) {
    const location: RouteLocationRaw = {
      name: noPermissionRoute,
    }

    return location
  }

  return null
}

/**
 * 处理路由切换
 *
 * @param to - 目标路由
 * @param from - 来源路由
 * @param next - 导航守卫的 next 函数
 */
function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // 带有 href 的路由
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

  next()
}
