import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
} from "@elegant-router/types";

import type { RouteRecordRaw } from "vue-router";

import { SetupStoreId } from "@/enum";

import { router } from "@/router";

import { getRouteName } from "@/router/elegant/transform";

import { createRoutes, getVueRoutes } from "@/router/routes";

import { useBoolean } from "@sa/hooks";

import { defineStore } from "pinia";

import { computed, nextTick, ref, shallowRef } from "vue";

import { useTabStore } from "../tab";

import { getBreadcrumbsByRoute } from "./breadcrumb";

import { getGlobalMenusByAuthRoutes, transformMenuToSearchMenus } from "./menu";

import {
  getCacheRouteNames,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
} from "./shared";

/**
 * 路由状态管理
 */
export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const tabStore = useTabStore();

  /**
   *  是否已初始化常量路由
   */
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } =
    useBoolean();

  /**
   *  是否已初始化路由Store
   */
  const { bool: isInitRouteStore, setBool: setIsInitRouteStore } = useBoolean();

  /**
   *  首页路由键
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME);

  /**
   *  路由列表 (未转化为 vue 路由)
   */
  const routeList = shallowRef<ElegantConstRoute[]>([]);

  /**
   * 添加路由数组到 authRoutes
   *
   * @param routes - 需要添加的路由列表
   */
  function addAuthRoutes(routes: ElegantConstRoute[]) {
    const authRoutesMap = new Map<string, ElegantConstRoute>([]);

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route);
    });
    routeList.value = Array.from(authRoutesMap.values());
  }

  /**
   *  移除路由函数数组
   */
  const removeRouteFns: (() => void)[] = [];

  /**
   *  全局菜单
   */
  const menuList = ref<App.Global.Menu[]>([]);

  /**
   *  搜索菜单
   */
  const searchMenuList = computed(() =>
    transformMenuToSearchMenus(menuList.value),
  );

  /**
   * 获取全局菜单
   * @param routes - 路由数组
   */
  function getGlobalMenuList(routes: ElegantConstRoute[]) {
    menuList.value = getGlobalMenusByAuthRoutes(routes);
  }

  /**
   *  缓存路由数组
   */
  const cacheRouteList = ref<RouteKey[]>([]);

  /**
   *  排除缓存路由列表（用于重置路由缓存）
   */
  const excludeCacheRouteList = ref<RouteKey[]>([]);

  /**
   * 获取缓存路由
   *
   * @param routes - Vue 路由数组
   */
  function getCacheRouteList(routes: RouteRecordRaw[]) {
    cacheRouteList.value = getCacheRouteNames(routes);
  }

  /**
   * 重置路由缓存
   *
   * @param routeKey - 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey);

    excludeCacheRouteList.value.push(routeName);
    await nextTick();
    excludeCacheRouteList.value = [];
  }

  /**
   *  全局面包屑数组（基于当前路由和全局菜单生成
   */
  const breadcrumbList = computed(() =>
    getBreadcrumbsByRoute(router.currentRoute.value, menuList.value),
  );

  console.log(
    "%c Line:141 🥤 breadcrumbList 全局面包屑数组",
    "color:#33a5ff",
    breadcrumbList,
  );

  /**
   * 重置存储
   */
  // async function resetStore() {
  //   const routeStore = useRouteStore();

  //   routeStore.$reset();

  //   // 重置 Vue 路由
  //   resetVueRoutes();

  //   // 重置存储后需要重新初始化常量路由
  //   await initConstantRoute();
  // }

  /**
   * 重置 Vue 路由
   */
  // function resetVueRoutes() {
  //   removeRouteFns.forEach((fn) => fn());
  //   removeRouteFns.length = 0;
  // }

  /**
   * 初始化常量路由
   */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) {
      return;
    } // 避免重复初始化

    handleConstantAndAuthRoutes();

    setIsInitConstantRoute(true);

    // 初始化首页标签页
    tabStore.initHomeTab();
  }

  /**
   * 初始化权限路由
   */
  async function initRouteStore() {
    initStaticAuthRoute();
    tabStore.initHomeTab(); // 初始化首页标签页
  }

  /**
   * 初始化静态权限路由
   */
  function initStaticAuthRoute() {
    const authRoutes = createRoutes();

    addAuthRoutes(authRoutes);

    handleConstantAndAuthRoutes();

    setIsInitRouteStore(true);
  }

  /**
   * 处理常量路由和权限路由
   */
  function handleConstantAndAuthRoutes() {
    // const allRoutes = [...authRoutes.value]

    // // 对路由进行排序
    // const sortRoutes = sortRoutesByOrder(allRoutes)

    // // 对路由进行权限过滤
    // const vueRoutes = getVueRoutes(sortRoutes)

    // // 重置 Vue Router 中的所有动态路由
    // resetVueRoutes()

    // // 将处理后的路由添加到 Vue Router
    // addRoutesToVueRouter(vueRoutes)

    // // 生成全局菜单数据
    // getGlobalMenus(sortRoutes)

    // // 计算需要缓存的路由
    // getCacheRoutes(vueRoutes)

    // #////////////////////////////////////
    const allRouteList = [...routeList.value];

    // 对路由进行排序
    const sortRoutes = sortRoutesByOrder(allRouteList);

    // 对路由进行权限过滤
    const vueRoutes = getVueRoutes(sortRoutes);

    // 重置 Vue Router 中的所有动态路由
    // resetVueRoutes();

    // 将处理后的路由添加到 Vue Router
    addRoutesToVueRouter(vueRoutes);

    // 生成全局菜单数据
    getGlobalMenuList(sortRoutes);

    // 计算需要缓存的路由
    getCacheRouteList(vueRoutes);
  }

  /**
   * 添加路由到 Vue 路由器
   * @param routes - Vue 路由数组
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      // 添加路由并获取移除函数
      const removeFn = router.addRoute(route);

      // 存储移除函数
      addRemoveRouteFn(removeFn);
    });
  }

  /**
   * 添加移除路由函数
   * @param fn - 移除路由函数
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn);
  }

  /**
   * 检查权限路由是否存在
   * @param routePath - 路由路径
   * @returns 是否存在
   */
  async function getIsAuthRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath);

    if (!routeName) {
      return false;
    }

    const authRoutes = createRoutes();

    return isRouteExistByRouteName(routeName, authRoutes);
  }

  /**
   * 获取选中的菜单键路径
   * @param selectedKey - 选中的菜单键
   * @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menuList.value);
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
     * 初始化常量路由
     */
    initConstantRoute,

    /**
     * 是否已初始化常量路由
     */
    isInitConstantRoute,

    /**
     * 初始化路由Store
     */
    initRouteStore,

    /**
     * 是否已初始化路由Store
     */
    isInitRouteStore,

    /**
     * 设置是否已初始化路由Store状态
     *
     * @param value - 是否已初始化
     */
    setIsInitRouteStore,

    /**
     * 检查指定路由路径是否存在权限路由
     *
     * @param routePath - 路由路径
     * @returns 是否存在权限路由
     */
    getIsAuthRouteExist,

    /**
     * 获取选中菜单的键路径
     *
     * @param selectedKey - 选中的菜单键
     * @returns 选中菜单的键路径数组
     */
    getSelectedMenuKeyPath,
  };
});
