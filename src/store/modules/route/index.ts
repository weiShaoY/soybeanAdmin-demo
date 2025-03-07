import type { AppRouteRecordRaw } from '@/router/types'

import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
} from '@elegant-router/types'

import type { RouteRecordRaw } from 'vue-router'

import { SetupStoreId } from '@/enum'

import { useSvgIcon } from '@/hooks/common/icon'

// import { blogChildRouteList } from '@/router/modules/blog'

import { router } from '@/router'

import { getRouteName } from '@/router/elegant/transform'

import { createAllRoutes } from '@/router/routes'

import { useBoolean } from '@sa/hooks'

import { defineStore } from 'pinia'

import {
  computed,
  nextTick,
  ref,
  shallowRef,
} from 'vue'

import { useTabStore } from '../tab'

import {
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  transformMenuToSearchMenus,
} from './shared'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const { bool: isInitRoute, setBool: setIsInitRoute } = useBoolean()

  /**
   *  首页路由地址
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  /**
   *  移除路由函数数组
   */
  const removeRouteFns: (() => void)[] = []

  /**
   * 全局菜单
   */
  const menus = ref<App.Global.Menu[]>([])

  /**
   *  搜索菜单
   */
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /**
   * 缓存路由数组
   */
  const cacheRoutes = ref<RouteKey[]>([])

  /**
   *  排除缓存路由数组，用于重置路由缓存
   */
  const excludeCacheRoutes = ref<RouteKey[]>([])

  /**
   * 添加移除路由函数
   *
   * @param fn 移除路由函数
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  /**
   * 重置 Vue 路由
   */
  function resetVueRoutes() {
    removeRouteFns.forEach(fn => fn())
    removeRouteFns.length = 0
  }

  /**
   * 获取缓存路由
   *
   * @param routes Vue 路由数组
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /**
   * 添加路由到 Vue 路由器
   *
   * @param  routes Vue 路由数组
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      // 调用 Vue Router 的 `addRoute` 方法添加路由，返回一个移除该路由的函数
      const removeFn = router.addRoute(route)

      // 将移除函数存储，方便后续清理路由
      addRemoveRouteFn(removeFn)
    })
  }

  /**
   * 获取权限路由是否存在
   *
   * @param  routePath 路由路径
   */
  async function getIsRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath)

    if (!routeName) {
      return false
    }

    const allRoutes = createAllRoutes()

    return isRouteExistByRouteName(routeName, allRoutes)
  }

  /**
   * 获取选中的菜单键路径
   *
   * @param selectedKey 选中的菜单键
   * @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value)
  }

  /**
   * 全局面包屑
   */
  const breadcrumbs = computed(() =>
    getBreadcrumbsByRoute(router.currentRoute.value, menus.value),
  )

  /**
   * 重置路由缓存
   *
   * @param {RouteKey} [routeKey] 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey)

    excludeCacheRoutes.value.push(routeName)

    await nextTick()

    excludeCacheRoutes.value = []
  }

  /**
   * 重置存储
   */
  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()

    resetVueRoutes()

    // await initRoute()
  }

  // ///////////////////////////////////////////
  function transformRouteToMenu(route: AppRouteRecordRaw, parentPath = '') {
    const { SvgIconVNode } = useSvgIcon()

    const { name, path } = route

    const { title, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = route.meta ?? {
    }

    const label = title || ''

    const menu: App.Global.Menu = {
      key: name as string,
      label,
      routeKey: name as RouteKey,
      routePath: (path || parentPath) as RouteMap[RouteKey], // 解决 path 为空的问题
      icon: SvgIconVNode({
        icon,
        localIcon,
        fontSize: iconFontSize || 20,
      }),
    }

    return menu
  }

  /**
   *  递归转换路由
   */
  function generateMenuTree(routes: AppRouteRecordRaw[], parentPath = '') {
    const menus: App.Global.Menu[] = []

    if (!Array.isArray(routes)) {
      console.error('getMenus 传入的 routes 不是数组:', routes)
      return menus // 避免错误，返回空数组
    }

    routes.forEach((route) => {
      if (!route.meta?.hideInMenu) {
        const children = route.children || []

        const visibleChildren = children.filter(child => !child.meta?.hideInMenu)

        let menu: App.Global.Menu

        // 处理单级路由（只有一个子路由，且 path 为空）
        if (visibleChildren.length === 1 && visibleChildren[0].path === '') {
          menu = transformRouteToMenu(
            {
              ...route, // 继承父级信息
              ...visibleChildren[0], // 覆盖 path、name 和 meta
            },
            route.path, // 传递父级 path 以防 path 为空
          )
        }
        else {
          menu = transformRouteToMenu(route, parentPath)
          if (visibleChildren.length > 0) {
            menu.children = generateMenuTree(visibleChildren, route.path)
          }
        }

        menus.push(menu)
      }
    })

    return menus
  }

  function setMenus(blogChildRouteList: AppRouteRecordRaw[]) {
    console.log('%c Line:235 🍣 blogChildRouteList', 'color:#ffdd4d', blogChildRouteList)

    console.log('%c Line:249 🍔 menus.value', 'color:#ffdd4d', menus.value)

    // 重置 Vue Router 中的所有动态路由
    resetVueRoutes()

    // 将处理后的路由添加到 Vue Router
    // addRoutesToVueRouter(blogChildRouteList)

    menus.value = generateMenuTree(blogChildRouteList)

    console.log('%c Line:292 🥝 menus.value', 'color:#b03734', menus.value)
  }

  return {
    resetStore,
    routeHome,
    menus,
    searchMenus,
    cacheRoutes,
    excludeCacheRoutes,
    resetRouteCache,
    breadcrumbs,
    isInitRoute,
    setIsInitRoute,
    getIsRouteExist,
    getSelectedMenuKeyPath,
    setMenus,
  }
})
