/** 应用的全局命名空间 */
declare namespace App {

  /** 主题命名空间 */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber

    /**
     * 主题设置
     */
    type ThemeSetting = {

      /** 主题方案 */
      themeScheme: UnionKey.ThemeScheme

      /** 灰度模式 */
      grayscale: boolean

      /** 色弱模式 */
      colourWeakness: boolean

      /** 是否推荐颜色 */
      recommendColor: boolean

      /** 主题颜色 */
      themeColor: string

      /** 其他颜色 */
      otherColor: OtherColor

      /** 信息颜色是否跟随主色 */
      isInfoFollowPrimary: boolean

      /** 重置缓存策略 */
      resetCacheStrategy: UnionKey.ResetCacheStrategy

      /** 布局 */
      layout: {

        /** 布局模式 */
        mode: UnionKey.ThemeLayoutMode

        /** 滚动模式 */
        scrollMode: UnionKey.ThemeScrollMode

        /**
         * 是否反转水平混合布局
         *
         * 如果为 true，左侧的垂直子菜单和顶部的水平一级菜单将反转
         */
        reverseHorizontalMix: boolean
      }

      /** 页面 */
      page: {

        /** 是否显示页面过渡动画 */
        animate: boolean

        /** 页面动画模式 */
        animateMode: UnionKey.ThemePageAnimateMode
      }

      /** 头部 */
      header: {

        /** 头部高度 */
        height: number

        /** 头部面包屑 */
        breadcrumb: {

          /** 是否显示面包屑 */
          visible: boolean

          /** 是否显示面包屑图标 */
          showIcon: boolean
        }
      }

      /** 标签页 */
      tab: {

        /** 是否显示标签页 */
        visible: boolean

        /**
         * 是否缓存标签页
         *
         * 如果缓存，页面刷新时会从本地存储中获取标签页
         */
        cache: boolean

        /** 标签页高度 */
        height: number

        /** 标签页模式 */
        mode: UnionKey.ThemeTabMode
      }

      /** 固定头部和标签页 */
      fixedHeaderAndTab: boolean

      /** 侧边栏 */
      sider: {

        /** 反转侧边栏 */
        inverted: boolean

        /** 侧边栏宽度 */
        width: number

        /** 折叠侧边栏宽度 */
        collapsedWidth: number

        /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的侧边栏宽度 */
        mixWidth: number

        /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的折叠侧边栏宽度 */
        mixCollapsedWidth: number

        /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的子菜单宽度 */
        mixChildMenuWidth: number
      }

      /** 底部 */
      footer: {

        /** 是否显示底部 */
        visible: boolean

        /** 是否固定底部 */
        fixed: boolean

        /** 底部高度 */
        height: number

        /** 当布局为 'horizontal-mix' 时，是否将底部浮动到右侧 */
        right: boolean
      }

      /** 水印 */
      watermark: {

        /** 是否显示水印 */
        visible: boolean

        /** 水印文本 */
        text: string
      }

      /** 定义一些主题设置的 tokens，将转换为 CSS 变量 */
      tokens: {
        light: ThemeSettingToken
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        }
      }
    }

    /**
     * 其他颜色
     */
    type OtherColor = {

      /** 信息颜色 */
      info: string

      /** 成功颜色 */
      success: string

      /** 警告颜色 */
      warning: string

      /** 错误颜色 */
      error: string
    }

    /** 主题颜色 */
    type ThemeColor = {

      /** 主色 */
      primary: string
    } & OtherColor

    /** 主题颜色键 */
    type ThemeColorKey = keyof ThemeColor

    /** 主题调色板颜色 */
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    }

    /** 基础 token */
    type BaseToken = Record<string, Record<string, string>>

    /** 主题设置 token 颜色 */
    type ThemeSettingTokenColor = {

      /** 进度条颜色，如果未设置，则使用主色 */
      'nprogress'?: string

      /** 容器颜色 */
      'container': string

      /** 布局颜色 */
      'layout': string

      /** 反转颜色 */
      'inverted': string

      /** 基础文本颜色 */
      'base-text': string
    }

    /** 主题设置 token 阴影 */
    type ThemeSettingTokenBoxShadow = {

      /** 头部阴影 */
      header: string

      /** 侧边栏阴影 */
      sider: string

      /** 标签页阴影 */
      tab: string
    }

    /** 主题设置 token */
    type ThemeSettingToken = {

      /** 颜色 */
      colors: ThemeSettingTokenColor

      /** 阴影 */
      boxShadow: ThemeSettingTokenBoxShadow
    }

    /** 主题 token 颜色 */
    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor

    /** 主题 token CSS 变量 */
    type ThemeTokenCSSVars = {

      /** 颜色 */
      colors: ThemeTokenColor & { [key: string]: string }

      /** 阴影 */
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string }
    }
  }

  /** 全局命名空间 */
  namespace Global {
    type VNode = import('vue').VNode
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded
    type RouteKey = import('@elegant-router/types').RouteKey
    type RouteMap = import('@elegant-router/types').RouteMap
    type RoutePath = import('@elegant-router/types').RoutePath
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey

    /** 全局头部属性 */
    type HeaderProps = {

      /** 是否显示 logo */
      showLogo?: boolean

      /** 是否显示菜单切换按钮 */
      showMenuToggler?: boolean

      /** 是否显示菜单 */
      showMenu?: boolean
    }

    /** 全局菜单 */
    type Menu = {

      /**
       * 菜单键
       *
       * 等同于路由键
       */
      key: string

      /** 菜单标签 */
      label: string

      /** 路由键 */
      routeKey: RouteKey

      /** 路由路径 */
      routePath: RoutePath

      /** 菜单图标 */
      icon?: () => VNode

      /** 菜单子项 */
      children?: Menu[]
    }

    /** 面包屑 */
    type Breadcrumb = Omit<Menu, 'children'> & {

      /** 面包屑选项 */
      options?: Breadcrumb[]
    }

    /** 标签页路由 */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>

    /** 全局标签页 */
    type Tab = {

      /** 标签页 ID */
      id: string

      /** 标签页标签 */
      label: string

      /**
       * 新标签页标签
       *
       * 如果设置，标签页标签将被此值替换
       */
      newLabel?: string

      /**
       * 旧标签页标签
       *
       * 当重置标签页标签时，标签页标签将被此值替换
       */
      oldLabel?: string

      /** 标签页路由键 */
      routeKey: LastLevelRouteKey

      /** 标签页路由路径 */
      routePath: RouteMap[LastLevelRouteKey]

      /** 标签页完整路径 */
      fullPath: string

      /** 标签页固定索引 */
      fixedIndex?: number | null

      /**
       * 标签页图标
       *
       * Iconify 图标
       */
      icon?: string

      /**
       * 标签页本地图标
       *
       * 本地图标
       */
      localIcon?: string

    }

    /** 表单规则 */
    type FormRule = import('element-plus').FormItemRule

    /** 全局下拉菜单键 */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll'
  }

  /** 服务命名空间 */
  namespace Service {

    /** 其他 baseURL 键 */
    type OtherBaseURLKey = 'demo'

    /** 服务配置项 */
    type ServiceConfigItem = {

      /** 后端服务基础 URL */
      baseURL: string

      /** 后端服务基础 URL 的代理模式 */
      proxyPattern: string
    }

    /** 其他服务配置项 */
    type OtherServiceConfigItem = {

      /** 键 */
      key: OtherBaseURLKey
    } & ServiceConfigItem

    /** 后端服务配置 */
    type ServiceConfig = {

      /** 其他后端服务配置 */
      other: OtherServiceConfigItem[]
    } & ServiceConfigItem

    /** 简单服务配置 */
    type SimpleServiceConfig = {

      /** 其他服务配置 */
      other: Record<OtherBaseURLKey, string>
    } & Pick<ServiceConfigItem, 'baseURL'>

    /** 后端服务响应数据 */
    type Response<T = unknown> = {

      /** 后端服务响应代码 */
      code: string

      /** 后端服务响应消息 */
      msg: string

      /** 后端服务响应数据 */
      data: T
    }

    /** 演示后端服务响应数据 */
    type DemoResponse<T = unknown> = {

      /** 后端服务响应代码 */
      status: string

      /** 后端服务响应消息 */
      message: string

      /** 后端服务响应数据 */
      result: T
    }
  }
}
