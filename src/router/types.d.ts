import type { defineComponent } from 'vue'

import type { RouteMeta } from 'vue-router'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export type AppRouteRecordRaw = {

  /**
   * 路由名称
   */
  name?: string

  /**
   * 路由路径
   */
  path: string

  /**
   * 路由重定向
   */
  redirect?: string | {
    name: string
    params?: Record<string, string>
    query?: Record<string, string>
  }

  /**
   * 路由组件
   */
  component?: Component

  /**
   * 路由子路由
   */
  children?: AppRouteRecordRaw[]

  /**
   * 路由元信息
   */
  meta?: RouteMeta
}
