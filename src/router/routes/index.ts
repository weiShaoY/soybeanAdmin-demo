import type {
  CustomRoute,
  ElegantConstRoute,
  GeneratedRoute,
} from '@elegant-router/types'

import { layouts, views } from '../elegant/imports'

import fallbackRoute from '../modules/fallback'

import { sortRoutesByOrder, transformElegantRoutesToVueRoutes } from '../utils'

/**
 *  生成的路由数组
 */
const generatedRouteList: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      constant: true,
      hideInMenu: true,
      i18nKey: 'route.403',
    },
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      constant: true,
      hideInMenu: true,
      i18nKey: 'route.404',
    },
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      constant: true,
      hideInMenu: true,
      i18nKey: 'route.500',
    },
  },
  {
    name: 'aaa',
    path: '/aaa',
    component: 'layout.base$view.aaa',
    meta: {
      title: 'aaa',
      i18nKey: 'route.aaa',
      order: 20,
    },
  },
  {
    name: 'about',
    path: '/about',
    component: 'layout.base$view.about',
    meta: {
      title: 'about',
      icon: 'fluent:book-information-24-regular',
      order: 10,
      i18nKey: 'route.about',
    },
  },
  {
    name: 'function',
    path: '/function',
    component: 'layout.base',
    meta: {
      title: 'function',
      icon: 'icon-park-outline:all-application',
      order: 6,
      i18nKey: 'route.function',
    },
    children: [
      {
        name: 'function_hide-child',
        path: '/function/hide-child',
        meta: {
          title: 'function_hide-child',
          icon: 'material-symbols:filter-list-off',
          order: 2,
          i18nKey: 'route.function_hide-child',
        },
        redirect: '/function/hide-child/one',
        children: [
          {
            name: 'function_hide-child_one',
            path: '/function/hide-child/one',
            component: 'view.function_hide-child_one',
            meta: {
              title: 'function_hide-child_one',
              icon: 'material-symbols:filter-list-off',
              hideInMenu: true,
              activeMenu: 'function_hide-child',
              i18nKey: 'route.function_hide-child_one',
            },
          },
          {
            name: 'function_hide-child_three',
            path: '/function/hide-child/three',
            component: 'view.function_hide-child_three',
            meta: {
              title: 'function_hide-child_three',
              hideInMenu: true,
              activeMenu: 'function_hide-child',
              i18nKey: 'route.function_hide-child_three',
            },
          },
          {
            name: 'function_hide-child_two',
            path: '/function/hide-child/two',
            component: 'view.function_hide-child_two',
            meta: {
              title: 'function_hide-child_two',
              hideInMenu: true,
              activeMenu: 'function_hide-child',
              i18nKey: 'route.function_hide-child_two',
            },
          },
        ],
      },
      {
        name: 'function_multi-tab',
        path: '/function/multi-tab',
        component: 'view.function_multi-tab',
        meta: {
          title: 'function_multi-tab',
          icon: 'ic:round-tab',
          multiTab: true,
          hideInMenu: true,
          activeMenu: 'function_tab',
          i18nKey: 'route.function_multi-tab',
        },
      },
      {
        name: 'function_request',
        path: '/function/request',
        component: 'view.function_request',
        meta: {
          title: 'function_request',
          icon: 'carbon:network-overlay',
          order: 3,
          i18nKey: 'route.function_request',
        },
      },
      {
        name: 'function_super-page',
        path: '/function/super-page',
        component: 'view.function_super-page',
        meta: {
          title: 'function_super-page',
          icon: 'ic:round-supervisor-account',
          order: 5,
          roles: ['R_SUPER'],
          i18nKey: 'route.function_super-page',
        },
      },
      {
        name: 'function_tab',
        path: '/function/tab',
        component: 'view.function_tab',
        meta: {
          title: 'function_tab',
          icon: 'ic:round-tab',
          order: 1,
          i18nKey: 'route.function_tab',
        },
      },
    ],
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      icon: 'mdi:monitor-dashboard',
      order: 0,
      i18nKey: 'route.home',
    },
  },
  {
    name: 'iframe-page',
    path: '/iframe-page/:url',
    component: 'layout.base$view.iframe-page',
    props: true,
    meta: {
      title: 'iframe-page',
      constant: true,
      hideInMenu: true,
      keepAlive: true,
      i18nKey: 'route.iframe-page',
    },
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.base',
    meta: {
      title: 'manage',
      icon: 'carbon:cloud-service-management',
      order: 9,
      roles: ['R_ADMIN'],
      i18nKey: 'route.manage',
    },
    children: [
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: {
          title: 'manage_menu',
          icon: 'material-symbols:route',
          order: 3,
          roles: ['R_ADMIN'],
          keepAlive: true,
          i18nKey: 'route.manage_menu',
        },
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: {
          title: 'manage_role',
          icon: 'carbon:user-role',
          order: 2,
          roles: ['R_SUPER'],
          i18nKey: 'route.manage_role',
        },
      },
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: {
          title: 'manage_user',
          icon: 'ic:round-manage-accounts',
          order: 1,
          roles: ['R_ADMIN'],
          i18nKey: 'route.manage_user',
        },
      },
      {
        name: 'manage_user-detail',
        path: '/manage/user-detail/:id',
        component: 'view.manage_user-detail',
        props: true,
        meta: {
          title: 'manage_user-detail',
          hideInMenu: true,
          roles: ['R_ADMIN'],
          activeMenu: 'manage_user',
          i18nKey: 'route.manage_user-detail',
        },
      },
    ],
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'layout.base',
    meta: {
      title: 'multi-menu',
      order: 8,
      i18nKey: 'route.multi-menu',
    },
    children: [
      {
        name: 'multi-menu_first',
        path: '/multi-menu/first',
        meta: {
          title: 'multi-menu_first',
          order: 1,
          i18nKey: 'route.multi-menu_first',
        },
        children: [
          {
            name: 'multi-menu_first_child',
            path: '/multi-menu/first/child',
            component: 'view.multi-menu_first_child',
            meta: {
              title: 'multi-menu_first_child',
              i18nKey: 'route.multi-menu_first_child',
            },
          },
        ],
      },
      {
        name: 'multi-menu_second',
        path: '/multi-menu/second',
        meta: {
          title: 'multi-menu_second',
          order: 2,
          i18nKey: 'route.multi-menu_second',
        },
        children: [
          {
            name: 'multi-menu_second_child',
            path: '/multi-menu/second/child',
            meta: {
              title: 'multi-menu_second_child',
              i18nKey: 'route.multi-menu_second_child',
            },
            children: [
              {
                name: 'multi-menu_second_child_home',
                path: '/multi-menu/second/child/home',
                component: 'view.multi-menu_second_child_home',
                meta: {
                  title: 'multi-menu_second_child_home',
                  i18nKey: 'route.multi-menu_second_child_home',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'plugin',
    path: '/plugin',
    component: 'layout.base',
    meta: {
      title: '插件示例',
      order: 7,
      icon: 'clarity:plugin-line',
      i18nKey: 'route.plugin',
    },
    children: [
      {
        name: 'plugin_barcode',
        path: '/plugin/barcode',
        component: 'view.plugin_barcode',
        meta: {
          title: 'plugin_barcode',
          icon: 'ic:round-barcode',
          i18nKey: 'route.plugin_barcode',
        },
      },
      {
        name: 'plugin_charts',
        path: '/plugin/charts',
        meta: {
          title: 'plugin_charts',
          icon: 'mdi:chart-areaspline',
          i18nKey: 'route.plugin_charts',
        },
        children: [
          {
            name: 'plugin_charts_antv',
            path: '/plugin/charts/antv',
            component: 'view.plugin_charts_antv',
            meta: {
              title: 'plugin_charts_antv',
              icon: 'hugeicons:flow-square',
              i18nKey: 'route.plugin_charts_antv',
            },
          },
          {
            name: 'plugin_charts_echarts',
            path: '/plugin/charts/echarts',
            component: 'view.plugin_charts_echarts',
            meta: {
              title: 'plugin_charts_echarts',
              icon: 'simple-icons:apacheecharts',
              i18nKey: 'route.plugin_charts_echarts',
            },
          },
          {
            name: 'plugin_charts_vchart',
            path: '/plugin/charts/vchart',
            component: 'view.plugin_charts_vchart',
            meta: {
              title: 'plugin_charts_vchart',
              localIcon: 'visactor',
              i18nKey: 'route.plugin_charts_vchart',
            },
          },
        ],
      },
      {
        name: 'plugin_copy',
        path: '/plugin/copy',
        component: 'view.plugin_copy',
        meta: {
          title: 'plugin_copy',
          icon: 'mdi:clipboard-outline',
          i18nKey: 'route.plugin_copy',
        },
      },
      {
        name: 'plugin_editor',
        path: '/plugin/editor',
        meta: {
          title: 'plugin_editor',
          icon: 'icon-park-outline:editor',
          i18nKey: 'route.plugin_editor',
        },
        children: [
          {
            name: 'plugin_editor_markdown',
            path: '/plugin/editor/markdown',
            component: 'view.plugin_editor_markdown',
            meta: {
              title: 'plugin_editor_markdown',
              icon: 'ri:markdown-line',
              i18nKey: 'route.plugin_editor_markdown',
            },
          },
          {
            name: 'plugin_editor_quill',
            path: '/plugin/editor/quill',
            component: 'view.plugin_editor_quill',
            meta: {
              title: 'plugin_editor_quill',
              icon: 'mdi:file-document-edit-outline',
              i18nKey: 'route.plugin_editor_quill',
            },
          },
        ],
      },
      {
        name: 'plugin_excel',
        path: '/plugin/excel',
        component: 'view.plugin_excel',
        meta: {
          title: 'plugin_excel',
          icon: 'ri:file-excel-2-line',
          keepAlive: true,
          i18nKey: 'route.plugin_excel',
        },
      },
      {
        name: 'plugin_gantt',
        path: '/plugin/gantt',
        meta: {
          title: 'plugin_gantt',
          icon: 'ant-design:bar-chart-outlined',
          i18nKey: 'route.plugin_gantt',
        },
        children: [
          {
            name: 'plugin_gantt_dhtmlx',
            path: '/plugin/gantt/dhtmlx',
            component: 'view.plugin_gantt_dhtmlx',
            meta: {
              title: 'plugin_gantt_dhtmlx',
              icon: 'gridicons:posts',
              i18nKey: 'route.plugin_gantt_dhtmlx',
            },
          },
          {
            name: 'plugin_gantt_vtable',
            path: '/plugin/gantt/vtable',
            component: 'view.plugin_gantt_vtable',
            meta: {
              title: 'plugin_gantt_vtable',
              localIcon: 'visactor',
              i18nKey: 'route.plugin_gantt_vtable',
            },
          },
        ],
      },
      {
        name: 'plugin_icon',
        path: '/plugin/icon',
        component: 'view.plugin_icon',
        meta: {
          title: 'plugin_icon',
          localIcon: 'custom-icon',
          i18nKey: 'route.plugin_icon',
        },
      },
      {
        name: 'plugin_map',
        path: '/plugin/map',
        component: 'view.plugin_map',
        meta: {
          title: 'plugin_map',
          icon: 'mdi:map',
          i18nKey: 'route.plugin_map',
        },
      },
      {
        name: 'plugin_pdf',
        path: '/plugin/pdf',
        component: 'view.plugin_pdf',
        meta: {
          title: 'plugin_pdf',
          icon: 'uiw:file-pdf',
          i18nKey: 'route.plugin_pdf',
        },
      },
      {
        name: 'plugin_pinyin',
        path: '/plugin/pinyin',
        component: 'view.plugin_pinyin',
        meta: {
          title: 'plugin_pinyin',
          icon: 'entypo-social:google-hangouts',
          i18nKey: 'route.plugin_pinyin',
        },
      },
      {
        name: 'plugin_print',
        path: '/plugin/print',
        component: 'view.plugin_print',
        meta: {
          title: 'plugin_print',
          icon: 'mdi:printer',
          i18nKey: 'route.plugin_print',
        },
      },
      {
        name: 'plugin_swiper',
        path: '/plugin/swiper',
        component: 'view.plugin_swiper',
        meta: {
          title: 'plugin_swiper',
          icon: 'simple-icons:swiper',
          i18nKey: 'route.plugin_swiper',
        },
      },
      {
        name: 'plugin_tables',
        path: '/plugin/tables',
        meta: {
          title: 'plugin_tables',
          icon: 'icon-park-outline:table',
          i18nKey: 'route.plugin_tables',
        },
        children: [
          {
            name: 'plugin_tables_vtable',
            path: '/plugin/tables/vtable',
            component: 'view.plugin_tables_vtable',
            meta: {
              title: 'plugin_tables_vtable',
              localIcon: 'visactor',
              i18nKey: 'route.plugin_tables_vtable',
            },
          },
        ],
      },
      {
        name: 'plugin_typeit',
        path: '/plugin/typeit',
        component: 'view.plugin_typeit',
        meta: {
          title: 'plugin_typeit',
          icon: 'mdi:typewriter',
          i18nKey: 'route.plugin_typeit',
        },
      },
      {
        name: 'plugin_video',
        path: '/plugin/video',
        component: 'view.plugin_video',
        meta: {
          title: 'plugin_video',
          icon: 'mdi:video',
          i18nKey: 'route.plugin_video',
        },
      },
    ],
  },
  {
    name: 'user-center',
    path: '/user-center',
    component: 'layout.base$view.user-center',
    meta: {
      title: 'user-center',
      hideInMenu: true,
      i18nKey: 'route.user-center',
    },
  },
]

/**
 * 自定义路由数组
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRouteList: CustomRoute[] = [
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
 *  静态路由数组
 */
const staticRouteList = [...customRouteList, ...generatedRouteList]

// 1. 创建权限路由映射表并填充静态路由
const routeListMap = new Map(staticRouteList.map(route => [route.name, route]))

// 2. 更新路由列表并排序
export const sortedRouteList = sortRoutesByOrder(Array.from(routeListMap.values()))

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

/**
 * 创建内置 vue 路由
 *
 * @returns 转换后的 vue 路由
 */
export function createVueRoutes() {
  return transformElegantRoutesToVueRoutes(fallbackRoute, layouts, views)
}
