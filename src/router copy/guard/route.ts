import type { RouteKey, RoutePath } from '@elegant-router/types'

import type {
  LocationQueryRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
} from 'vue-router'

import { getRouteName } from '@/router/elegant/transform'

import { useAuthStore } from '@/store/modules/auth'

import { useRouteStore } from '@/store/modules/route'

import { localStg } from '@/utils/storage'

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

    const authStore = useAuthStore()

    /** 根路由名 */
    const rootRoute: RouteKey = 'root'

    /** 登录路由名 */
    const loginRoute: RouteKey = 'login'

    /** 无权限路由名 */
    const noAuthorizationRoute: RouteKey = '403'

    /** 是否登录 */
    const isLogin = Boolean(localStg.get('token'))

    /** 是否需要登录 */
    const needLogin = !to.meta.constant

    /** 路由角色 */
    const routeRoles = to.meta.roles || []

    /** 是否有角色权限 */
    const hasRole = authStore.userInfo.roles.some(role => routeRoles.includes(role))

    /** 是否有访问权限 */
    const hasAuth = authStore.isStaticSuper || !routeRoles.length || hasRole

    // 如果已登录且是登录路由，则跳转到根页面
    if (to.name === loginRoute && isLogin) {
      next({
        name: rootRoute,
      })
      return
    }

    // 如果路由不需要登录，则直接访问
    if (!needLogin) {
      handleRouteSwitch(to, from, next)
      return
    }

    // 需要登录但用户未登录，则跳转到登录页面
    if (!isLogin) {
      next({
        name: loginRoute,
        query: {
          redirect: to.fullPath,
        },
      })
      return
    }

    // 如果用户已登录但没有权限，则跳转到403页面
    if (!hasAuth) {
      next({
        name: noAuthorizationRoute,
      })
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

  /** 未找到路由的路由名 */
  const notFoundRoute: RouteKey = 'not-found'

  /** 是否为未找到路由 */
  const isNotFoundRoute = to.name === notFoundRoute

  // 如果常量路由未初始化，则初始化常量路由
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute()

    // 因为常量路由未初始化，路由被 "not-found" 路由捕获
    // 初始化常量路由后，重定向到原始路由
    const path = to.fullPath

    const location: RouteLocationRaw = {
      path,
      replace: true,
      query: to.query,
      hash: to.hash,
    }

    return location
  }

  /** 是否登录 */
  const isLogin = Boolean(localStg.get('token'))

  if (!isLogin) {
    // 如果用户未登录且路由是常量路由但不是 "not-found" 路由，则允许访问
    if (to.meta.constant && !isNotFoundRoute) {
      routeStore.onRouteSwitchWhenNotLoggedIn()
      return null
    }

    // 如果用户未登录，则跳转到登录页面
    const loginRoute: RouteKey = 'login'

    const query = getRouteQueryOfLoginRoute(to, routeStore.routeHome)

    const location: RouteLocationRaw = {
      name: loginRoute,
      query,
    }

    return location
  }

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

  routeStore.onRouteSwitchWhenLoggedIn()

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

/**
 * 获取登录路由的查询参数
 *
 * @param to - 目标路由
 * @param routeHome - 首页路由
 * @returns 登录路由的查询参数
 */
function getRouteQueryOfLoginRoute(to: RouteLocationNormalized, routeHome: RouteKey) {
  const loginRoute: RouteKey = 'login'

  const redirect = to.fullPath

  const [redirectPath, redirectQuery] = redirect.split('?')

  const redirectName = getRouteName(redirectPath as RoutePath)

  const isRedirectHome = routeHome === redirectName

  const query: LocationQueryRaw = to.name !== loginRoute && !isRedirectHome
    ? {
        redirect,
      }
    : {
      }

  if (isRedirectHome && redirectQuery) {
    query.redirect = `/?${redirectQuery}`
  }

  return query
}
