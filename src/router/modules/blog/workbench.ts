import type { AppRouteRecordRaw } from "@/router/types";
import { BLOG_BASE_Layout } from "@/layouts";

/**
 *  根路由和未找到路由
 */
const workbenchRoute = [
  {
    path: "/blog/workbench",
    component: BLOG_BASE_Layout,
    children: [
      {
        name: "workbench",
        path: "",
        component: () => import("@/pages/blog/workbench/index.vue"),
        meta: {
          title: 'workbench',
          icon: 'mdi:monitor-dashboard',
          order: 0,
        },
      },
    ],
  },
];

export default workbenchRoute;
