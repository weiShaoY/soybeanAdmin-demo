import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
} from "@elegant-router/types";

import type { RouteRecordRaw } from "vue-router";

import { SetupStoreId } from "@/enum";

import { router } from "@/router";

import { getRouteName } from "@/router/elegant/transform";

import {
  createAllRoutes as createAllRoutes,
  getAuthVueRoutes,
} from "@/router/routes";

import { useBoolean } from "@sa/hooks";

import { defineStore } from "pinia";

import { computed, nextTick, ref, shallowRef } from "vue";

import { useTabStore } from "../tab";

import {
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  transformMenuToSearchMenus,
} from "./shared";

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const tabStore = useTabStore();

  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean();

  /**
   *  首页路由键
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME);

  /**
   *  权限路由
   */
  const allRoutes = shallowRef<ElegantConstRoute[]>([]);

  /**
   *  移除路由函数数组
   */
  const removeRouteFns: (() => void)[] = [];

  /**
   * 全局菜单
   */
  const menus = ref<App.Global.Menu[]>([]);

  /**
   *  搜索菜单
   */
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value));

  /**
   * 缓存路由
   */
  const cacheRoutes = ref<RouteKey[]>([]);

  /**
   *  排除缓存路由，用于重置路由缓存
   */
  const excludeCacheRoutes = ref<RouteKey[]>([]);

  /**
   * 获取缓存路由
   *
   * @param routes Vue 路由数组
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes);
  }

  /**
   * 重置路由缓存
   *
   * @param {RouteKey} [routeKey] 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey);

    excludeCacheRoutes.value.push(routeName);

    await nextTick();

    excludeCacheRoutes.value = [];
  }

  /**
   * 全局面包屑
   */
  const breadcrumbs = computed(() =>
    getBreadcrumbsByRoute(router.currentRoute.value, menus.value),
  );

  /**
   * 重置存储
   */
  async function resetStore() {
    const routeStore = useRouteStore();

    routeStore.$reset();

    resetVueRoutes();

    await initAuthRoute();
  }

  /**
   * 重置 Vue 路由
   */
  function resetVueRoutes() {
    removeRouteFns.forEach((fn) => fn());
    removeRouteFns.length = 0;
  }

  /**
   * 添加路由到 Vue 路由器
   *
   * @param  routes Vue 路由数组
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      // 调用 Vue Router 的 `addRoute` 方法添加路由，返回一个移除该路由的函数
      const removeFn = router.addRoute(route);

      // 将移除函数存储，方便后续清理路由
      addRemoveRouteFn(removeFn);
    });
  }

  /**
   * 处理常量路由和权限路由
   */
  function handleConstantAndAuthRoutes() {
    /**
     *  对路由进行排序
     */
    const sortRoutes = sortRoutesByOrder(allRoutes.value);

    /**
     *  对路由进行权限过滤
     */
    const vueRoutes = getAuthVueRoutes(sortRoutes);

    // 重置 Vue Router 中的所有动态路由
    resetVueRoutes();

    // 将处理后的路由添加到 Vue Router
    addRoutesToVueRouter(vueRoutes);

    // 生成全局菜单数据
    menus.value = getGlobalMenusByAuthRoutes(sortRoutes);

    // 计算需要缓存的路由
    getCacheRoutes(vueRoutes);
  }

  /**
   * 初始化静态权限路由
   */
  function initStaticAuthRoute() {
    allRoutes.value = createAllRoutes();

    //  处理常量路由和权限路由
    handleConstantAndAuthRoutes();

    setIsInitAuthRoute(true);
  }

  /**
   * 初始化权限路由
   */
  async function initAuthRoute() {
    initStaticAuthRoute();

    tabStore.initHomeTab();
  }

  /**
   * 添加移除路由函数
   *
   * @param fn 移除路由函数
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn);
  }

  /**
   * 获取权限路由是否存在
   *
   * @param  routePath 路由路径
   */
  async function getIsAuthRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath);

    if (!routeName) {
      return false;
    }

    const allRoutes = createAllRoutes();

    return isRouteExistByRouteName(routeName, allRoutes);
  }

  /**
   * 获取选中的菜单键路径
   *
   * @param selectedKey 选中的菜单键
   * @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value);
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
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath,
  };
});
