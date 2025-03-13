import type { ElegantConstRoute } from '@elegant-router/types'

import type { RouteComponent, RouteRecordRaw } from 'vue-router'

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
 * 将优雅的常量路由转换为Vue路由
 * @param routes  优雅的常量路由数组
 * @param  layouts 布局组件集合
 * @param  views 视图组件集合
 * @returns  转换后的Vue路由数组
 */
export function transformElegantRoutesToVueRoutes(
  routes: ElegantConstRoute[],
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
) {
  return routes.flatMap(route => transformElegantRouteToVueRoute(route, layouts, views))
}
