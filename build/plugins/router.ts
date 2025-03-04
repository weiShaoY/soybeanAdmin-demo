import type { RouteKey } from '@elegant-router/types'

import type { RouteMeta } from 'vue-router'

import ElegantVueRouter from '@elegant-router/vue/vite'

/**
 * 配置 Elegant Router 路由插件
 *
 * @returns ElegantVueRouter 配置对象
 */
export function setupElegantRouter() {
  return ElegantVueRouter({
    /** 定义全局布局组件路径 */
    layouts: {
      /** 基础布局 */
      base: 'src/layouts/base-layout/index.vue',

      /** 空白布局 */
      blank: 'src/layouts/blank-layout/index.vue',
    },
    customRoutes: {
      /** 自定义路由名称 */
      names: [
        'exception_403',
        'exception_404',
        'exception_500',
        'document_project',
        'document_project-link',
        'document_vue',
        'document_vite',
        'document_unocss',
        'document_naive',
        'document_antd',
        'document_element-plus',
        'document_alova',
      ],
    },

    /**
     * 路由路径转换器
     *
     * @param routeName - 路由名称
     * @param routePath - 原始路由路径
     * @returns 转换后的路由路径
     */
    routePathTransformer(routeName, routePath) {
      const key = routeName as RouteKey

      if (key === 'login') {
        const modules: UnionKey.LoginModule[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat']

        const moduleReg = modules.join('|')

        return `/login/:module(${moduleReg})?`
      }

      return routePath
    },

    /**
     * 生成路由元信息
     *
     * @param routeName - 路由名称
     * @returns 路由元数据
     */
    onRouteMetaGen(routeName) {
      const key = routeName as RouteKey

      /** 定义常量路由，不可删除 */
      const constantRoutes: RouteKey[] = ['login', '403', '404', '500']

      const meta: Partial<RouteMeta> = {
        /** 页面标题 */
        title: key,

        /** 国际化 key */
        i18nKey: `route.${key}` as App.I18n.I18nKey,
      }

      // 标记常量路由
      if (constantRoutes.includes(key)) {
        meta.constant = true
      }

      return meta
    },
  })
}
