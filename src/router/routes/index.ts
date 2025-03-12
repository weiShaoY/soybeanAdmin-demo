import type {
  CustomRoute,
  ElegantConstRoute,
} from '@elegant-router/types'

import { layouts, views } from '../elegant/imports'

import { generatedRoutes } from '../elegant/routes'

import type { RouteRecordRaw, RouteComponent } from 'vue-router';
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
 * transform elegant const routes to vue routes
 * @param routes elegant const routes
 * @param layouts layout components
 * @param views view components
 */
export function transformElegantRoutesToVueRoutes(
  routes: ElegantConstRoute[],
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>
) {
  return routes.flatMap(route => transformElegantRouteToVueRoute(route, layouts, views));
}

/**
 * transform elegant route to vue route
 * @param route elegant const route
 * @param layouts layout components
 * @param views view components
 */
function transformElegantRouteToVueRoute(
  route: ElegantConstRoute,
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>
) {
  const LAYOUT_PREFIX = 'layout.';
  const VIEW_PREFIX = 'view.';
  const ROUTE_DEGREE_SPLITTER = '_';
  const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

  function isLayout(component: string) {
    return component.startsWith(LAYOUT_PREFIX);
  }

  function getLayoutName(component: string) {
    const layout = component.replace(LAYOUT_PREFIX, '');

    if(!layouts[layout]) {
      throw new Error(`Layout component "${layout}" not found`);
    }

    return layout;
  }

  function isView(component: string) {
    return component.startsWith(VIEW_PREFIX);
  }

  function getViewName(component: string) {
    const view = component.replace(VIEW_PREFIX, '');

    if(!views[view]) {
      throw new Error(`View component "${view}" not found`);
    }

    return view;
  }

  function isFirstLevelRoute(item: ElegantConstRoute) {
    return !item.name.includes(ROUTE_DEGREE_SPLITTER);
  }

  function isSingleLevelRoute(item: ElegantConstRoute) {
    return isFirstLevelRoute(item) && !item.children?.length;
  }

  function getSingleLevelRouteComponent(component: string) {
    const [layout, view] = component.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT);

    return {
      layout: getLayoutName(layout),
      view: getViewName(view)
    };
  }

  const vueRoutes: RouteRecordRaw[] = [];

  // add props: true to route
  if (route.path.includes(':') && !route.props) {
    route.props = true;
  }

  const { name, path, component, children, ...rest } = route;

  const vueRoute = { name, path, ...rest } as RouteRecordRaw;

  try {
    if (component) {
      if (isSingleLevelRoute(route)) {
        const { layout, view } = getSingleLevelRouteComponent(component);

        const singleLevelRoute: RouteRecordRaw = {
          path,
          component: layouts[layout],
          meta: {
            title: route.meta?.title || ''
          },
          children: [
            {
              name,
              path: '',
              component: views[view],
              ...rest
            } as RouteRecordRaw
          ]
        };

        return [singleLevelRoute];
      }

      if (isLayout(component)) {
        const layoutName = getLayoutName(component);

        vueRoute.component = layouts[layoutName];
      }

      if (isView(component)) {
        const viewName = getViewName(component);

        vueRoute.component = views[viewName];
      }

    }
  } catch (error: any) {
    console.error(`Error transforming route "${route.name}": ${error.toString()}`);
    return [];
  }

  // add redirect to child
  if (children?.length && !vueRoute.redirect) {
    vueRoute.redirect = {
      name: children[0].name
    };
  }

  if (children?.length) {
    const childRoutes = children.flatMap(child => transformElegantRouteToVueRoute(child, layouts, views));

    if(isFirstLevelRoute(route)) {
      vueRoute.children = childRoutes;
    } else {
      vueRoutes.push(...childRoutes);
    }
  }

  vueRoutes.unshift(vueRoute);

  return vueRoutes;
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
////  后续直接导出 vue模版出来
