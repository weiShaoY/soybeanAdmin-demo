import type { Router } from 'vue-router'

import { createProgressGuard } from './progress'

import { createRouteGuard } from './route'

import { createDocumentTitleGuard } from './title'

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
