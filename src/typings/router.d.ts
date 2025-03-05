import 'vue-router'

declare module 'vue-router' {

  // 路由元信息接口
  // eslint-disable-next-line ts/consistent-type-definitions
  interface RouteMeta {

    /**
     * 路由标题
     *
     * 可用于文档标题中
     */
    title: string

    /**
     * 路由的角色列表
     *
     * 当前用户拥有至少一个角色时，允许访问该路由，角色列表为空时，表示无需权限
     */
    roles?: string[]

    /**
     * 是否缓存该路由
     */
    keepAlive?: boolean

    /**
     * 是否为常量路由
     *
     * 无需登录，并且该路由在前端定义
     */
    constant?: boolean

    /**
     * Iconify 图标
     *
     * 可用于菜单或面包屑中
     */
    icon?: string

    /**
     * 本地图标
     *
     * 存在于 "src/assets/svg-icon" 目录下，如果设置，将忽略icon属性
     */
    localIcon?: string

    /**
     * Icon size. width and height are the same.
     */
    iconFontSize?: number

    /**
     * 路由排序顺序
     */
    order?: number

    /**
     * 路由的外部链接
     */
    href?: string

    /**
     * 是否在菜单中隐藏该路由
     */
    hideInMenu?: boolean

    /**
     * 进入该路由时激活的菜单键
     * 该路由不在菜单中
     * @example  假设路由是"user_detail"，如果设置为"user_list"，则会激活"用户列表"菜单项
     */
    activeMenu?: import('@elegant-router/types').RouteKey

    /**
     * 默认情况下，相同路径的路由会共享一个标签页，若设置为true，则使用多个标签页
     */
    multiTab?: boolean

    /**
     * 若设置，路由将在标签页中固定显示，其值表示固定标签页的顺序（首页是特殊的，它将自动保持fixed）
     */
    fixedIndexInTab?: number

    /**
     * 路由查询参数，如果设置的话，点击菜单进入该路由时会自动携带的query参数
     */
    query?: { key: string, value: string }[] | null
  }
}
