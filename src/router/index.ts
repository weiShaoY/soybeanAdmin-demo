import type { App } from 'vue'

import type {
  Router,
  RouterHistory,
} from 'vue-router'

import { useRouteStore } from '@/store/modules/route'

import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,

} from 'vue-router'

import { routeList } from './guard'

import { blogChildRouteList } from './modules/blog'

import { createProgressGuard } from './progress'

import { createDocumentTitleGuard } from './title'

// 从环境变量中获取路由历史模式和基本 URL，默认为 'history' 模式
const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env

/**
 * 路由历史模式映射表
 *
 * @type {Record<Env.RouterHistoryMode, (base?: string) => RouterHistory>}
 *
 *   - `hash` 模式：使用 URL 哈希 (`#`) 进行路由控制，适用于不支持 `history` 模式的环境
 *   - `history` 模式：使用 HTML5 History API (`pushState` 和 `replaceState`)，提供更友好的 URL
 *   - `memory` 模式：基于内存存储的历史记录，通常用于服务端渲染 (SSR) 或测试环境
 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  /**
   *  使用 Hash 模式，URL 以 `#` 号分割，如 `example.com/#/home`
   */
  hash: createWebHashHistory,

  /**
   * 使用 HTML5 History API 模式，URL 结构更干净，如 `example.com/home`
   */
  history: createWebHistory,

  /**
   *  使用内存模式，不依赖 URL 变更，适用于 SSR 或无浏览器环境
   */
  memory: createMemoryHistory,
}

/** 根路由 */
export const ROOT_ROUTE = {
  name: 'root',
  path: '/',
  redirect: '/404',
  meta: {
    title: 'root',
    constant: true,
  },
}

/** 未找到路由 */
const NOT_FOUND_ROUTE = {
  name: 'not-found',
  path: '/:pathMatch(.*)*',
  component: () => import('@/pages/error/404/index.vue'),
  meta: {
    title: 'not-found',
    constant: true,
  },
}

/**
 * 创建路由实例
 */
export const router = createRouter({
  /** 设置路由历史记录 */
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),

  routes: [
    ROOT_ROUTE,

    ...routeList,

    NOT_FOUND_ROUTE,
  ],
})

/**
 * 创建路由守卫
 *
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  // 创建进度条守卫
  createProgressGuard(router)

  // 创建路由守卫
  // router.beforeEach(async (to, from, next) => {
  //   // 初始化路由
  //   const location = await initRoute(to)

  //   if (location) {
  //     next(location)
  //     return
  //   }

  //   // 正常切换路由
  //   handleRouteSwitch(to, from, next)
  // })
  const routeStore = useRouteStore()

  routeStore.setMenus(blogChildRouteList)

  // 创建文档标题守卫
  createDocumentTitleGuard(router)
}

/**
 * 设置 Vue Router
 *
 * @param app Vue 应用实例
 */
export async function setupRouter(app: App) {
  // 在 Vue 应用中使用路由
  app.use(router)

  // 创建并应用路由守卫
  createRouterGuard(router)

  // 等待路由准备就绪
  await router.isReady()
}
