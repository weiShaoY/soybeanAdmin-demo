import type { AppRouteRecordRaw } from '@/router/types'

import { BLOG_BASE_Layout } from '@/layouts'

/**
 *  插件
 */
const pluginRoute: AppRouteRecordRaw[] = [
  {
    name: 'plugin',
    path: '/blog/plugin',
    component: BLOG_BASE_Layout,

    meta: {
      title: '插件示例',
      order: 7,
      icon: 'clarity:plugin-line',
    },
    children: [
      {
        name: 'plugin_barcode',
        path: '/blog/plugin/barcode',
        component: () => import('@/pages/blog/plugin/barcode/index.vue'),
        meta: {
          title: 'plugin_barcode',
          icon: 'ic:round-barcode',
        },
      },
      {
        name: 'plugin_charts',
        path: '/blog/plugin/charts',
        meta: {
          title: 'plugin_charts',
          icon: 'mdi:chart-areaspline',
        },
        children: [
          {
            name: 'plugin_charts_antv',
            path: '/blog/plugin/charts/antv',
            component: () =>
              import('@/pages/blog/plugin/charts/antv/index.vue'),
            meta: {
              title: 'plugin_charts_antv',
              icon: 'hugeicons:flow-square',
            },
          },
          {
            name: 'plugin_charts_echarts',
            path: '/blog/plugin/charts/echarts',
            component: () =>
              import('@/pages/blog/plugin/charts/echarts/index.vue'),
            meta: {
              title: 'plugin_charts_echarts',
              icon: 'simple-icons:apacheecharts',
            },
          },
          {
            name: 'plugin_charts_vchart',
            path: '/blog/plugin/charts/vchart',
            component: () =>
              import('@/pages/blog/plugin/charts/vchart/index.vue'),
            meta: {
              title: 'plugin_charts_vchart',
              localIcon: 'visactor',
            },
          },
        ],
      },
    ],
  },
]

export default pluginRoute
