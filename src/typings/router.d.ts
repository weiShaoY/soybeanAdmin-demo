import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RouteMeta {
    /**
     * 路由标题
     *
     * 可用于文档标题
     */
    title: string;
    /**
     * 路由的 i18n 键
     *
     * 用于 i18n，如果设置了此项，则标题将被忽略
     */
    i18nKey?: App.I18n.I18nKey | null;
    /**
     * 路由的角色
     *
     * 当前用户具有至少一个角色时可以访问路由
     *
     * 仅在路由模式为 "static" 时有效，如果路由模式为 "dynamic"，则将被忽略
     */
    roles?: string[];
    /** 是否缓存路由 */
    keepAlive?: boolean | undefined;
    /**
     * 是否为常量路由
     *
     * 如果设置为 true，则访问该路由时不会进行登录验证和权限验证
     */
    constant?: boolean | undefined;
    /**
     * Iconify 图标
     *
     * 可用于菜单或面包屑
     */
    icon?: string;
    /**
     * 本地图标
     *
     * 在 "src/assets/svg-icon" 中，如果设置了此项，则图标将被忽略
     */
    localIcon?: string;
    /** 图标大小，宽度和高度相同 */
    iconFontSize?: number;
    /** 路由顺序 */
    order?: number | undefined;
    /** 路由的外部链接 */
    href?: string | null;
    /** 是否在菜单中隐藏路由 */
    hideInMenu?: boolean | undefined;
    /**
     * 进入路由时将激活的菜单键
     *
     * 该路由不在菜单中
     *
     * @example
     *   路由为 "user_detail"，如果设置为 "user_list"，则将激活菜单 "user_list"
     */
    activeMenu?: import('@elegant-router/types').RouteKey | undefined;
    /** 默认情况下，相同的路由路径将使用一个标签，即使查询不同，如果设置为 true，则具有不同查询的路由将使用不同的标签 */
    multiTab?: boolean | undefined;
    /** 如果设置，则路由将固定在标签中，值为固定标签的顺序 */
    fixedIndexInTab?: number | undefined;
    /** 如果设置了查询参数，则进入路由时将自动携带 */
    query?: { key: string; value: string }[] | null;
  }
}
