import type { App } from 'vue';
import {
  type RouterHistory,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';
import { createBuiltinVueRoutes } from './routes/builtin';
import { createRouterGuard } from './guard';

// 从环境变量中获取路由历史模式和基本 URL，默认为 'history' 模式
const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env;

/** 路由历史模式映射表 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory
};

/** 创建路由实例 */
export const router = createRouter({
  // 设置路由历史记录
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  // 设置路由表
  routes: createBuiltinVueRoutes()
});

/**
 * 设置 Vue Router
 *
 * @param app Vue 应用实例
 */
export async function setupRouter(app: App) {
  // 在 Vue 应用中使用路由
  app.use(router);

  // 创建并应用路由守卫
  createRouterGuard(router);

  // 等待路由准备就绪
  await router.isReady();
}
