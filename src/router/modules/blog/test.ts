import type { AppRouteRecordRaw } from '@/router/types'

// import { BLOG_DEFAULT_LAYOUT } from '@/layouts'
const  BaseLayout = ()=> import( "@/layouts/base-layout/index.vue");
// import BlankLayout from "@/layouts/blank-layout/index.vue";
const Test = {
  path: 'test',
  name: 'Test',
  meta: {
    locale: '测试',
    icon: 'blog-menu-test',
    order: 99,
  },
  redirect: {
    name: 'Api',
  },
  component: BaseLayout,
  children: [
    {
      path: '/component',
      name: 'Component',
      meta: {
        locale: '组件',
        icon: 'blog-menu-component',
      },
      component: () => import('@/views/aaa/index.vue'),
    },
  ],
}

export default Test
