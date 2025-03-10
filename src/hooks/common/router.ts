import type { RouteKey } from '@elegant-router/types'

import type { RouteLocationRaw } from 'vue-router'

import { router as globalRouter } from '@/router'

import { useRouter } from 'vue-router'

/**
 * Router push
 *
 * 跳转到指定路由，可以替代 router.push 函数
 *
 * @param inSetup 是否在 vue script setup 中. Default is `true`
 * @returns 包含各种路由操作方法的对象
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter

  const route = globalRouter.currentRoute

  const routerPush = router.push

  const routerBack = router.back

  /** 路由跳转选项; */
  type RouterPushOptions = {

    /** 路由查询参数 */
    query?: Record<string, string>

    /** 路由动态参数 */
    params?: Record<string, string>
  }

  /**
   * 根据路由键名跳转
   *
   * @param key 路由键名
   * @param options 路由选项
   */
  async function routerPushByKey(key: RouteKey, options?: RouterPushOptions) {
    const { query, params } = options || {
    }

    const routeLocation: RouteLocationRaw = {
      name: key,
    }

    if (Object.keys(query || {
    }).length) {
      routeLocation.query = query
    }

    if (Object.keys(params || {
    }).length) {
      routeLocation.params = params
    }

    return routerPush(routeLocation)
  }

  /**
   * 根据路由键名跳转并带上 meta 中的 query
   *
   * @param key 路由键名
   */
  function routerPushByKeyWithMetaQuery(key: RouteKey) {
    const allRoutes = router.getRoutes()

    const meta = allRoutes.find(item => item.name === key)?.meta || null

    const query: Record<string, string> = {
    }

    meta?.query?.forEach((item) => {
      query[item.key] = item.value
    })

    return routerPushByKey(key, {
      query,
    })
  }

  /** 跳转到首页 */
  async function toHome() {
    return routerPushByKey('root')
  }

  /**
   * 跳转到登录页面
   *
   * @param loginModule 登录模块
   * @param redirectUrl 重定向 URL，未指定时为当前路由的 fullPath
   */
  async function toLogin(loginModule?: UnionKey.LoginModule, redirectUrl?: string) {
    const module = loginModule || 'pwd-login'

    const options: RouterPushOptions = {
      params: {
        module,
      },
    }

    const redirect = redirectUrl || route.value.fullPath

    options.query = {
      redirect,
    }

    return routerPushByKey('login', options)
  }

  /**
   * 切换登录模块
   *
   * @param module 登录模块
   */
  async function toggleLoginModule(module: UnionKey.LoginModule) {
    const query = route.value.query as Record<string, string>

    return routerPushByKey('login', {
      query,
      params: {
        module,
      },
    })
  }

  /**
   * 从登录页面重定向
   *
   * @param needRedirect 是否在登录后重定向。默认为 `true`. Default is `true`
   */
  async function redirectFromLogin(needRedirect = true) {
    console.log('%c Line:136 🥤 needRedirect', 'color:#7f2b82', needRedirect)
    const redirect = route.value.query?.redirect as string

    if (needRedirect && redirect) {
      await routerPush(redirect)
    }
    else {
      await toHome()
    }
  }

  return {
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery,
    toLogin,
    toggleLoginModule,
    redirectFromLogin,
  }
}
