/**
 *  博客模块  基础布局组件（适用于带有导航栏和侧边栏的页面）
 */
export const BLOG_BASE_Layout = () => import('./base-layout/index.vue')

/**
 *  博客模块  导入空白布局组件（适用于登录页、独立页面等无框架的页面）
 */
export const BLOG_BLANK_Layout = () => import('./blank-layout/index.vue')
