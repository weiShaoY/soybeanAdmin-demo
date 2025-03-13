import type {
  CustomRoute,
  ElegantConstRoute,
} from '@elegant-router/types'

import type { RouteComponent, RouteRecordRaw } from 'vue-router'

import { layouts, views } from '../elegant/imports'

import { generatedRoutes } from '../elegant/routes'

/**
 * 自定义路由
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes: CustomRoute[] = [
  {
    name: 'exception',
    path: '/exception',
    component: 'layout.base',
    meta: {
      title: '列外',
      icon: 'ant-design:exception-outlined',
      order: 7,
    },
    children: [
      {
        name: 'exception_403',
        path: '/exception/403',
        component: 'view.403',
        meta: {
          title: '403',
          icon: 'ic:baseline-block',
        },
      },
      {
        name: 'exception_404',
        path: '/exception/404',
        component: 'view.404',
        meta: {
          title: '404',
          icon: 'ic:baseline-web-asset-off',
        },
      },
      {
        name: 'exception_500',
        path: '/exception/500',
        component: 'view.500',
        meta: {
          title: '500',
          icon: 'ic:baseline-wifi-off',
        },
      },
    ],
  },
  {
    name: 'document',
    path: '/document',
    component: 'layout.base',
    meta: {
      title: '文档',
      order: 2,
      icon: 'mdi:file-document-multiple-outline',
    },
    children: [
      {
        name: 'document_antd',
        path: '/document/antd',
        component: 'view.iframe-page',
        props: {
          url: 'https://antdv.com/components/overview-cn',
        },
        meta: {
          title: 'Ant Design Vue Document',
          order: 7,
          icon: 'logos:ant-design',
        },
      },
      {
        name: 'document_naive',
        path: '/document/naive',
        component: 'view.iframe-page',
        props: {
          url: 'https://www.UI.com/zh-CN/os-theme/docs/introduction',
        },
        meta: {
          title: 'Naive UI Document',
          order: 6,
          icon: 'logos:naiveui',
        },
      },
      {
        name: 'document_element-plus',
        path: '/document/element-plus',
        component: 'view.iframe-page',
        props: {
          url: 'https://element-plus.org/zh-CN/',
        },
        meta: {
          title: 'Element Plus Document',
          order: 7,
          icon: 'ep:element-plus',
        },
      },
      {
        name: 'document_alova',
        path: '/document/alova',
        component: 'view.iframe-page',
        props: {
          url: 'https://alova.js.org',
        },
        meta: {
          title: 'Alova Document',
          order: 8,
          localIcon: 'alova',
        },
      },
      {
        name: 'document_project',
        path: '/document/project',
        component: 'view.iframe-page',
        props: {
          url: 'https://docs.soybeanjs.cn/zh',
        },
        meta: {
          title: 'Project Document',
          order: 1,
          localIcon: 'logo',
        },
      },
      {
        name: 'document_project-link',
        path: '/document/project-link',
        component: 'view.iframe-page',
        meta: {
          title: 'Project Document(External Link)',
          order: 2,
          localIcon: 'logo',
          href: 'https://docs.soybeanjs.cn/zh',
        },
      },
      {
        name: 'document_unocss',
        path: '/document/unocss',
        component: 'view.iframe-page',
        props: {
          url: 'https://unocss.dev/',
        },
        meta: {
          title: 'UnoCSS Document',
          order: 5,
          icon: 'logos:unocss',
        },
      },
      {
        name: 'document_vite',
        path: '/document/vite',
        component: 'view.iframe-page',
        props: {
          url: 'https://cn.vitejs.dev/',
        },
        meta: {
          title: 'Vite Document',
          order: 4,
          icon: 'logos:vitejs',
        },
      },
      {
        name: 'document_vue',
        path: '/document/vue',
        component: 'view.iframe-page',
        props: {
          url: 'https://cn.vuejs.org/',
        },
        meta: {
          title: 'Vue Document',
          order: 3,
          icon: 'logos:vue',
        },
      },
    ],
  },
]

/**
 * 创建路由数组
 *  - 转换为 Vue 路由格式前的路由数组
 * @returns 路由数组
 */
export function createRoutes() {
  return [...customRoutes, ...generatedRoutes]
}

/**
 * 将优雅的常量路由转换为Vue路由
 * @param routes  优雅的常量路由数组
 * @param  layouts 布局组件集合
 * @param  views 视图组件集合
 * @returns  转换后的Vue路由数组
 */
function transformElegantRoutesToVueRoutes(
  routes: ElegantConstRoute[],
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
) {
  return routes.flatMap(route => transformElegantRouteToVueRoute(route, layouts, views))
}

/**
 * 将单个优雅路由转换为Vue路由
 * @param  route 单个优雅路由
 * @param  layouts 布局组件集合
 * @param  views 视图组件集合
 * @returns  转换后的Vue路由数组
 */
function transformElegantRouteToVueRoute(
  route: ElegantConstRoute,
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
) {
  /** 布局组件前缀 */
  const LAYOUT_PREFIX = 'layout.'

  /** 视图组件前缀 */
  const VIEW_PREFIX = 'view.'

  /** 路由层级分隔符 */
  const ROUTE_DEGREE_SPLITTER = '_'

  /** 一级路由组件分隔符 */
  const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$'

  /**
   * 判断是否为布局组件
   * @param  component 组件名称
   * @returns  是否为布局组件
   */
  function isLayout(component: string) {
    return component.startsWith(LAYOUT_PREFIX)
  }

  /**
   * 获取布局组件名称
   * @param  component 组件名称
   * @returns  布局组件名称
   * @throws  如果布局组件不存在则抛出错误
   */
  function getLayoutName(component: string) {
    const layout = component.replace(LAYOUT_PREFIX, '')

    if (!layouts[layout]) {
      throw new Error(`布局组件 "${layout}" 未找到`)
    }

    return layout
  }

  /**
   * 判断是否为视图组件
   * @param  component 组件名称
   * @returns  是否为视图组件
   */
  function isView(component: string) {
    return component.startsWith(VIEW_PREFIX)
  }

  /**
   * 获取视图组件名称
   * @param  component 组件名称
   * @returns  视图组件名称
   * @throws  如果视图组件不存在则抛出错误
   */
  function getViewName(component: string) {
    const view = component.replace(VIEW_PREFIX, '')

    if (!views[view]) {
      throw new Error(`视图组件 "${view}" 未找到`)
    }

    return view
  }

  /**
   * 判断是否为一级路由
   * @param  item 路由对象
   * @returns  是否为一级路由
   */
  function isFirstLevelRoute(item: ElegantConstRoute) {
    return !item.name.includes(ROUTE_DEGREE_SPLITTER)
  }

  /**
   * 判断是否为单级路由
   * @param  item 路由对象
   * @returns  是否为单级路由
   */
  function isSingleLevelRoute(item: ElegantConstRoute) {
    return isFirstLevelRoute(item) && !item.children?.length
  }

  /**
   * 获取单级路由的组件
   * @param  component 组件名称
   * @returns  包含布局和视图组件名称的对象
   */
  function getSingleLevelRouteComponent(component: string) {
    const [layout, view] = component.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT)

    return {
      layout: getLayoutName(layout),
      view: getViewName(view),
    }
  }

  /** 存储转换后的Vue路由 */
  const vueRoutes: RouteRecordRaw[] = []

  // 如果路由路径包含动态参数且未设置props，则自动添加props: true
  if (route.path.includes(':') && !route.props) {
    route.props = true
  }

  /** 解构路由对象 */
  const { name, path, component, children, ...rest } = route

  /** 创建Vue路由对象 */
  const vueRoute = {
    name,
    path,
    ...rest,
  } as RouteRecordRaw

  try {
    if (component) {
      // 处理单级路由
      if (isSingleLevelRoute(route)) {
        const { layout, view } = getSingleLevelRouteComponent(component)

        const singleLevelRoute: RouteRecordRaw = {
          path,
          component: layouts[layout],
          meta: {
            title: route.meta?.title || '',
          },
          children: [
            {
              name,
              path: '',
              component: views[view],
              ...rest,
            } as RouteRecordRaw,
          ],
        }

        return [singleLevelRoute]
      }

      // 处理布局组件
      if (isLayout(component)) {
        const layoutName = getLayoutName(component)

        vueRoute.component = layouts[layoutName]
      }

      // 处理视图组件
      if (isView(component)) {
        const viewName = getViewName(component)

        vueRoute.component = views[viewName]
      }
    }
  }
  catch (error: any) {
    console.error(`转换路由 "${route.name}" 时出错: ${error.toString()}`)
    return []
  }

  // 如果有子路由且未设置重定向，则自动重定向到第一个子路由
  if (children?.length && !vueRoute.redirect) {
    vueRoute.redirect = {
      name: children[0].name,
    }
  }

  // 处理子路由
  if (children?.length) {
    const childRoutes = children.flatMap(child => transformElegantRouteToVueRoute(child, layouts, views))

    if (isFirstLevelRoute(route)) {
      vueRoute.children = childRoutes
    }
    else {
      vueRoutes.push(...childRoutes)
    }
  }

  // 将当前路由添加到路由数组的开头
  vueRoutes.unshift(vueRoute)

  return vueRoutes
}

/**
 * 将 路由列表转换成 vue 路由
 *
 * 该函数用于将 Elegant 格式的路由转换为 Vue 路由格式。
 * 转换过程中会使用布局组件 (`layouts`) 和视图组件 (`views`)。
 *
 * @param routes - Elegant 格式的路由数组
 * @returns 返回转换后的 Vue 路由数组
 */
export function getVueRoutes(routes: ElegantConstRoute[]) {
  /**
   * 调用 `transformElegantRoutesToVueRoutes` 函数，
   * 将 Elegant 格式的路由转换为 Vue 路由格式。
   * - `routes`: 需要转换的 Elegant 路由数组。
   * - `layouts`: 布局组件。
   * - `views`: 视图组件。
   */
  return transformElegantRoutesToVueRoutes(routes, layouts, views)
}

// / /  后续直接导出 vue模版出来
