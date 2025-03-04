/**
 * 命名空间 Env
 *
 * 用于声明 import.meta 对象的类型
 */
declare namespace Env {

  /** 路由历史模式 */
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  /** import.meta 接口 */
  type ImportMeta = {

    /** 应用程序的基本 URL */
    readonly VITE_BASE_URL: string

    /** 应用程序的标题 */
    readonly VITE_APP_TITLE: string

    /** 应用程序的描述 */
    readonly VITE_APP_DESC: string

    /** 路由历史模式 */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode

    /** iconify 图标的前缀 */
    readonly VITE_ICON_PREFIX: 'icon'

    /**
     * 本地图标的前缀
     *
     * 此前缀以图标前缀开头
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'local-icon'

    /** 后端服务基本 URL */
    readonly VITE_SERVICE_BASE_URL: string

    /**
     * 后端服务的成功代码
     *
     * 收到此代码时，请求成功
     */
    readonly VITE_SERVICE_SUCCESS_CODE: string

    /**
     * 后端服务的注销代码
     *
     * 收到此代码时，用户将被注销并重定向到登录页面
     *
     * 使用 "," 分隔多个代码
     */
    readonly VITE_SERVICE_LOGOUT_CODES: string

    /**
     * 后端服务的模态注销代码
     *
     * 收到此代码时，将通过显示模态框注销用户
     *
     * 使用 "," 分隔多个代码
     */
    readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string

    /**
     * 后端服务的令牌过期代码
     *
     * 收到此代码时，将刷新令牌并重新发送请求
     *
     * 使用 "," 分隔多个代码
     */
    readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string

    /** 当路由模式为静态时，定义的超级角色 */
    readonly VITE_STATIC_SUPER_ROLE: string

    /**
     * 其他后端服务基本 URL
     *
     * 值为 JSON
     */
    readonly VITE_OTHER_SERVICE_BASE_URL: string

    /**
     * 是否启用 HTTP 代理
     *
     * 仅在开发环境中有效
     */
    readonly VITE_HTTP_PROXY?: CommonType.YesOrNo

    /**
     * 认证路由模式
     *
     * - Static: 认证路由在前端生成
     * - Dynamic: 认证路由在后端生成
     */
    readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic'

    /**
     * 主页路由键
     *
     * 仅在认证路由模式为静态时有效，如果路由模式为动态，主页路由键在后端定义
     */
    readonly VITE_ROUTE_HOME: import('@elegant-router/types').LastLevelRouteKey

    /**
     * 菜单图标，如果未设置菜单图标，则使用此默认图标
     *
     * Iconify 图标名称
     */
    readonly VITE_MENU_ICON: string

    /** 是否生成 sourcemap */
    readonly VITE_SOURCE_MAP?: CommonType.YesOrNo

    /**
     * Iconify API 提供者 URL
     *
     * 如果项目部署在内网中，可以将 API 提供者 URL 设置为本地 Iconify 服务器
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string

    /** 用于区分不同域的存储 */
    readonly VITE_STORAGE_PREFIX?: string

    /** 在配置应用程序打包后是否自动检测更新 */
    readonly VITE_AUTOMATICALLY_DETECT_UPDATE?: CommonType.YesOrNo
  } & ImportMetaEnv
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ImportMeta = {
  readonly env: Env.ImportMeta
}
