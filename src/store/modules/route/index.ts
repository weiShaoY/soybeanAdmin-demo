import type { RouteKey } from '@elegant-router/types'

import { SetupStoreId } from '@/enum'

import { router } from '@/router'

import {
  getVueRoutes,
  sortedRouteList,
} from '@/router/routes'

import { useBoolean } from '@sa/hooks'

import { defineStore } from 'pinia'

import {
  computed,
  nextTick,
  ref,
} from 'vue'

import { useTabStore } from '../tab'

import { getBreadcrumbList } from './breadcrumb'

import { getMenuList, transformMenuToSearchMenus } from './menu'

import {
  getCacheRouteNames,
  getSelectedMenuKeyPathByKey,
} from './shared'

/**
 * 路由状态管理
 */
export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const tabStore = useTabStore()

  /**
   *  是否已初始化路由Store
   */
  const { bool: isInitRouteStore, setBool: setIsInitRouteStore } = useBoolean()

  /**
   *  首页路由键
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  /**
   *  移除路由函数数组
   */
  const removeRouteFns: (() => void)[] = []

  /**
   *  全局菜单
   */
  const menuList = ref<App.Global.Menu[]>([])

  /**
   *  搜索菜单
   */
  const searchMenuList = computed(() =>
    transformMenuToSearchMenus(menuList.value),
  )

  /**
   *  缓存路由数组
   */
  const cacheRouteList = ref<RouteKey[]>([])

  /**
   *  排除缓存路由列表（用于重置路由缓存）
   */
  const excludeCacheRouteList = ref<RouteKey[]>([])

  /**
   * 重置路由缓存
   *
   * @param routeKey - 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey)

    excludeCacheRouteList.value.push(routeName)

    await nextTick()

    excludeCacheRouteList.value = []
  }

  /**
   *  全局面包屑数组（基于当前路由和全局菜单生成
   */
  const breadcrumbList = computed(() =>
    getBreadcrumbList(router.currentRoute.value, menuList.value),
  )

  console.log('%c Line:96 🥝 breadcrumbList', 'color:#fca650', breadcrumbList.value)

  /**
   * 初始化路由存储
   * 1. 创建权限路由映射表并填充静态路由
   * 2. 更新路由列表并排序
   * 3. 生成全局菜单数据
   * 4. 转化成vue路由并添加到 router
   * 5. 计算需要缓存的路由名称列表
   * 6. 标记路由存储已初始化并初始化首页标签页
   */
  async function initRouteStore() {
    console.log('%c Line:112 🥤 sortedRouteList', 'color:#4fff4B', sortedRouteList)

    // 3. 生成全局菜单数据
    menuList.value = getMenuList(sortedRouteList)
    console.log('%c Line:117 🍺 menuList.value', 'color:#2eafb0', menuList.value)

    // 4. 转化成vue路由并添加到 router
    const vueRoutes = getVueRoutes(sortedRouteList)

    vueRoutes.forEach(route => removeRouteFns.push(router.addRoute(route)))
    console.log('%c Line:123 🥃 vueRoutes', 'color:#33a5ff', vueRoutes)

    // 5. 计算需要缓存的路由名称列表
    cacheRouteList.value = getCacheRouteNames(vueRoutes)

    // 6. 标记路由存储已初始化并初始化首页标签页
    setIsInitRouteStore(true)
    tabStore.initHomeTab()
  }

  /**
   *  获取选中的菜单键路径
   *  @param selectedKey - 选中的菜单键
   *  @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menuList.value)
  }

  return {
    /**
     * 重置路由存储状态
     */
    // resetStore,

    /**
     * 首页路由键
     */
    routeHome,

    /**
     * 全局菜单列表
     */
    menuList,

    /**
     * 搜索菜单列表（基于全局菜单生成）
     */
    searchMenuList,

    /**
     * 缓存的路由键列表
     */
    cacheRouteList,

    /**
     * 排除缓存的路由键列表（用于重置路由缓存）
     */
    excludeCacheRouteList,

    /**
     * 重置指定路由的缓存
     *
     * @param routeKey - 需要重置缓存的路由键，默认为当前路由
     */
    resetRouteCache,

    /**
     * 全局面包屑数组（基于当前路由和全局菜单生成）
     */
    breadcrumbList,

    /**
     * 初始化路由Store函数
     */
    initRouteStore,

    /**
     * 是否已初始化路由Store
     */
    isInitRouteStore,

    /**
     * 获取选中菜单的键路径
     *
     * @param selectedKey - 选中的菜单键
     * @returns 选中菜单的键路径数组
     */
    getSelectedMenuKeyPath,
  }
})
