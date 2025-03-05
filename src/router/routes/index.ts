import type {
  CustomRoute,
  ElegantConstRoute,
  ElegantRoute,
} from '@elegant-router/types'

import { layouts, views } from '../elegant/imports'

import { generatedRoutes } from '../elegant/routes'

import { transformElegantRoutesToVueRoutes } from '../elegant/transform'

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
      title: 'Document',
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
 * 创建静态路由
 *
 * @returns 包含常量路由和权限路由的对象
 */
export function createStaticRoutes() {
  /** 常量路由 */
  const constantRoutes: ElegantRoute[] = []

  /** 权限路由 */
  const authRoutes: ElegantRoute[] = []

  console.log('%c Line:198 🍧 authRoutes', 'color:#465975', authRoutes);

  [...customRoutes, ...generatedRoutes].forEach((item) => {
    if (item.meta?.constant) {
      constantRoutes.push(item)
    }
    else {
      authRoutes.push(item)
    }
  })

  return {
    constantRoutes,

    authRoutes,
  }
}

/**
 * 获取权限 vue 路由
 *
 * @param routes - Elegant 路由
 * @returns 转换后的 vue 路由
 */
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views)
}
