/** 应用的全局命名空间 */
declare namespace App {
  /** 主题命名空间 */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber;

    /** 主题设置 */
    type ThemeSetting = {
      /** 主题方案 */
      themeScheme: UnionKey.ThemeScheme;
      /** 灰度模式 */
      grayscale: boolean;
      /** 色弱模式 */
      colourWeakness: boolean;
      /** 是否推荐颜色 */
      recommendColor: boolean;
      /** 主题颜色 */
      themeColor: string;
      /** 其他颜色 */
      otherColor: OtherColor;
      /** 信息颜色是否跟随主色 */
      isInfoFollowPrimary: boolean;
      /** 重置缓存策略 */
      resetCacheStrategy: UnionKey.ResetCacheStrategy;
      /** 布局 */
      layout: {
        /** 布局模式 */
        mode: UnionKey.ThemeLayoutMode;
        /** 滚动模式 */
        scrollMode: UnionKey.ThemeScrollMode;
        /**
         * 是否反转水平混合布局
         *
         * 如果为 true，左侧的垂直子菜单和顶部的水平一级菜单将反转
         */
        reverseHorizontalMix: boolean;
      };
      /** 页面 */
      page: {
        /** 是否显示页面过渡动画 */
        animate: boolean;
        /** 页面动画模式 */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** 头部 */
      header: {
        /** 头部高度 */
        height: number;
        /** 头部面包屑 */
        breadcrumb: {
          /** 是否显示面包屑 */
          visible: boolean;
          /** 是否显示面包屑图标 */
          showIcon: boolean;
        };
        /** 多语言 */
        multilingual: {
          /** 是否显示多语言 */
          visible: boolean;
        };
      };
      /** 标签页 */
      tab: {
        /** 是否显示标签页 */
        visible: boolean;
        /**
         * 是否缓存标签页
         *
         * 如果缓存，页面刷新时会从本地存储中获取标签页
         */
        cache: boolean;
        /** 标签页高度 */
        height: number;
        /** 标签页模式 */
        mode: UnionKey.ThemeTabMode;
      };
      /** 固定头部和标签页 */
      fixedHeaderAndTab: boolean;
      /** 侧边栏 */
      sider: {
        /** 反转侧边栏 */
        inverted: boolean;
        /** 侧边栏宽度 */
        width: number;
        /** 折叠侧边栏宽度 */
        collapsedWidth: number;
        /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的侧边栏宽度 */
        mixWidth: number;
        /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的折叠侧边栏宽度 */
        mixCollapsedWidth: number;
        /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的子菜单宽度 */
        mixChildMenuWidth: number;
      };
      /** 底部 */
      footer: {
        /** 是否显示底部 */
        visible: boolean;
        /** 是否固定底部 */
        fixed: boolean;
        /** 底部高度 */
        height: number;
        /** 当布局为 'horizontal-mix' 时，是否将底部浮动到右侧 */
        right: boolean;
      };
      /** 水印 */
      watermark: {
        /** 是否显示水印 */
        visible: boolean;
        /** 水印文本 */
        text: string;
      };
      /** 定义一些主题设置的 tokens，将转换为 CSS 变量 */
      tokens: {
        light: ThemeSettingToken;
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
      };
    };

    /** 其他颜色 */
    type OtherColor = {
      /** 信息颜色 */
      info: string;
      /** 成功颜色 */
      success: string;
      /** 警告颜色 */
      warning: string;
      /** 错误颜色 */
      error: string;
    };

    /** 主题颜色 */
    type ThemeColor = {
      /** 主色 */
      primary: string;
    } & OtherColor;

    /** 主题颜色键 */
    type ThemeColorKey = keyof ThemeColor;

    /** 主题调色板颜色 */
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    /** 基础 token */
    type BaseToken = Record<string, Record<string, string>>;

    /** 主题设置 token 颜色 */
    type ThemeSettingTokenColor = {
      /** 进度条颜色，如果未设置，则使用主色 */
      nprogress?: string;
      /** 容器颜色 */
      container: string;
      /** 布局颜色 */
      layout: string;
      /** 反转颜色 */
      inverted: string;
      /** 基础文本颜色 */
      'base-text': string;
    };

    /** 主题设置 token 阴影 */
    type ThemeSettingTokenBoxShadow = {
      /** 头部阴影 */
      header: string;
      /** 侧边栏阴影 */
      sider: string;
      /** 标签页阴影 */
      tab: string;
    };

    /** 主题设置 token */
    type ThemeSettingToken = {
      /** 颜色 */
      colors: ThemeSettingTokenColor;
      /** 阴影 */
      boxShadow: ThemeSettingTokenBoxShadow;
    };

    /** 主题 token 颜色 */
    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    /** 主题 token CSS 变量 */
    type ThemeTokenCSSVars = {
      /** 颜色 */
      colors: ThemeTokenColor & { [key: string]: string };
      /** 阴影 */
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
    };
  }

  /** 全局命名空间 */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** 全局头部属性 */
    type HeaderProps = {
      /** 是否显示 logo */
      showLogo?: boolean;
      /** 是否显示菜单切换按钮 */
      showMenuToggler?: boolean;
      /** 是否显示菜单 */
      showMenu?: boolean;
    };

    /** 全局菜单 */
    type Menu = {
      /**
       * 菜单键
       *
       * 等同于路由键
       */
      key: string;
      /** 菜单标签 */
      label: string;
      /** 菜单国际化键 */
      i18nKey?: I18n.I18nKey | null;
      /** 路由键 */
      routeKey: RouteKey;
      /** 路由路径 */
      routePath: RoutePath;
      /** 菜单图标 */
      icon?: () => VNode;
      /** 菜单子项 */
      children?: Menu[];
    };

    /** 面包屑 */
    type Breadcrumb = Omit<Menu, 'children'> & {
      /** 面包屑选项 */
      options?: Breadcrumb[];
    };

    /** 标签页路由 */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** 全局标签页 */
    type Tab = {
      /** 标签页 ID */
      id: string;
      /** 标签页标签 */
      label: string;
      /**
       * 新标签页标签
       *
       * 如果设置，标签页标签将被此值替换
       */
      newLabel?: string;
      /**
       * 旧标签页标签
       *
       * 当重置标签页标签时，标签页标签将被此值替换
       */
      oldLabel?: string;
      /** 标签页路由键 */
      routeKey: LastLevelRouteKey;
      /** 标签页路由路径 */
      routePath: RouteMap[LastLevelRouteKey];
      /** 标签页完整路径 */
      fullPath: string;
      /** 标签页固定索引 */
      fixedIndex?: number | null;
      /**
       * 标签页图标
       *
       * Iconify 图标
       */
      icon?: string;
      /**
       * 标签页本地图标
       *
       * 本地图标
       */
      localIcon?: string;
      /** 国际化键 */
      i18nKey?: I18n.I18nKey | null;
    };

    /** 表单规则 */
    type FormRule = import('element-plus').FormItemRule;

    /** 全局下拉菜单键 */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * 国际化命名空间
   *
   * 语言类型
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    /** 语言类型 */
    type LangType = 'en-US' | 'zh-CN';

    /** 语言选项 */
    type LangOption = {
      /** 语言标签 */
      label: string;
      /** 语言键 */
      key: LangType;
    };

    /** 国际化路由键 */
    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    /** 表单消息 */
    type FormMsg = {
      /** 必填项 */
      required: string;
      /** 无效项 */
      invalid: string;
    };

    /** 国际化 schema */
    type Schema = {
      /** 系统 */
      system: {
        /** 系统标题 */
        title: string;
        /** 更新标题 */
        updateTitle: string;
        /** 更新内容 */
        updateContent: string;
        /** 更新确认 */
        updateConfirm: string;
        /** 更新取消 */
        updateCancel: string;
      };
      /** 通用 */
      common: {
        /** 操作 */
        action: string;
        /** 添加 */
        add: string;
        /** 添加成功 */
        addSuccess: string;
        /** 返回首页 */
        backToHome: string;
        /** 批量删除 */
        batchDelete: string;
        /** 取消 */
        cancel: string;
        /** 关闭 */
        close: string;
        /** 检查 */
        check: string;
        /** 展开列 */
        expandColumn: string;
        /** 列设置 */
        columnSetting: string;
        /** 配置 */
        config: string;
        /** 确认 */
        confirm: string;
        /** 删除 */
        delete: string;
        /** 删除成功 */
        deleteSuccess: string;
        /** 确认删除 */
        confirmDelete: string;
        /** 编辑 */
        edit: string;
        /** 警告 */
        warning: string;
        /** 错误 */
        error: string;
        /** 索引 */
        index: string;
        /** 关键字搜索 */
        keywordSearch: string;
        /** 登出 */
        logout: string;
        /** 登出确认 */
        logoutConfirm: string;
        /** 期待 */
        lookForward: string;
        /** 修改 */
        modify: string;
        /** 修改成功 */
        modifySuccess: string;
        /** 无数据 */
        noData: string;
        /** 操作 */
        operate: string;
        /** 请检查值 */
        pleaseCheckValue: string;
        /** 刷新 */
        refresh: string;
        /** 重置 */
        reset: string;
        /** 搜索 */
        search: string;
        /** 切换 */
        switch: string;
        /** 提示 */
        tip: string;
        /** 触发 */
        trigger: string;
        /** 更新 */
        update: string;
        /** 更新成功 */
        updateSuccess: string;
        /** 用户中心 */
        userCenter: string;
        /** 是否 */
        yesOrNo: {
          /** 是 */
          yes: string;
          /** 否 */
          no: string;
        };
      };
      /** 请求 */
      request: {
        /** 登出 */
        logout: string;
        /** 登出消息 */
        logoutMsg: string;
        /** 带模态框的登出 */
        logoutWithModal: string;
        /** 带模态框的登出消息 */
        logoutWithModalMsg: string;
        /** 刷新 token */
        refreshToken: string;
        /** token 过期 */
        tokenExpired: string;
      };
      /** 主题 */
      theme: {
        /** 主题方案 */
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        /** 灰度模式 */
        grayscale: string;
        /** 色弱模式 */
        colourWeakness: string;
        /** 布局模式 */
        layoutMode: { title: string; reverseHorizontalMix: string } & Record<UnionKey.ThemeLayoutMode, string>;
        /** 推荐颜色 */
        recommendColor: string;
        /** 推荐颜色描述 */
        recommendColorDesc: string;
        /** 主题颜色 */
        themeColor: {
          /** 标题 */
          title: string;
          /** 跟随主色 */
          followPrimary: string;
        } & Theme.ThemeColor;
        /** 滚动模式 */
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        /** 页面 */
        page: {
          /** 是否显示页面过渡动画 */
          animate: string;
          /** 页面动画模式 */
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        /** 固定头部和标签页 */
        fixedHeaderAndTab: string;
        /** 头部 */
        header: {
          /** 头部高度 */
          height: string;
          /** 面包屑 */
          breadcrumb: {
            /** 是否显示面包屑 */
            visible: string;
            /** 是否显示面包屑图标 */
            showIcon: string;
          };
          /** 多语言 */
          multilingual: {
            /** 是否显示多语言 */
            visible: string;
          };
        };
        /** 标签页 */
        tab: {
          /** 是否显示标签页 */
          visible: string;
          /** 是否缓存标签页 */
          cache: string;
          /** 标签页高度 */
          height: string;
          /** 标签页模式 */
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        /** 侧边栏 */
        sider: {
          /** 反转侧边栏 */
          inverted: string;
          /** 侧边栏宽度 */
          width: string;
          /** 折叠侧边栏宽度 */
          collapsedWidth: string;
          /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的侧边栏宽度 */
          mixWidth: string;
          /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的折叠侧边栏宽度 */
          mixCollapsedWidth: string;
          /** 当布局为 'vertical-mix' 或 'horizontal-mix' 时的子菜单宽度 */
          mixChildMenuWidth: string;
        };
        /** 底部 */
        footer: {
          /** 是否显示底部 */
          visible: string;
          /** 是否固定底部 */
          fixed: string;
          /** 底部高度 */
          height: string;
          /** 当布局为 'horizontal-mix' 时，是否将底部浮动到右侧 */
          right: string;
        };
        /** 水印 */
        watermark: {
          /** 是否显示水印 */
          visible: string;
          /** 水印文本 */
          text: string;
        };
        /** 主题抽屉标题 */
        themeDrawerTitle: string;
        /** 页面功能标题 */
        pageFunTitle: string;
        /** 重置缓存策略 */
        resetCacheStrategy: { title: string } & Record<UnionKey.ResetCacheStrategy, string>;
        /** 配置操作 */
        configOperation: {
          /** 复制配置 */
          copyConfig: string;
          /** 复制成功消息 */
          copySuccessMsg: string;
          /** 重置配置 */
          resetConfig: string;
          /** 重置成功消息 */
          resetSuccessMsg: string;
        };
      };
      /** 路由 */
      route: Record<I18nRouteKey, string>;
      /** 页面 */
      page: {
        /** 登录 */
        login: {
          /** 通用 */
          common: {
            /** 登录或注册 */
            loginOrRegister: string;
            /** 用户名占位符 */
            userNamePlaceholder: string;
            /** 手机号占位符 */
            phonePlaceholder: string;
            /** 验证码占位符 */
            codePlaceholder: string;
            /** 密码占位符 */
            passwordPlaceholder: string;
            /** 确认密码占位符 */
            confirmPasswordPlaceholder: string;
            /** 验证码登录 */
            codeLogin: string;
            /** 确认 */
            confirm: string;
            /** 返回 */
            back: string;
            /** 验证成功 */
            validateSuccess: string;
            /** 登录成功 */
            loginSuccess: string;
            /** 欢迎回来 */
            welcomeBack: string;
          };
          /** 密码登录 */
          pwdLogin: {
            /** 标题 */
            title: string;
            /** 记住我 */
            rememberMe: string;
            /** 忘记密码 */
            forgetPassword: string;
            /** 注册 */
            register: string;
            /** 其他账号登录 */
            otherAccountLogin: string;
            /** 其他登录方式 */
            otherLoginMode: string;
            /** 超级管理员 */
            superAdmin: string;
            /** 管理员 */
            admin: string;
            /** 用户 */
            user: string;
          };
          /** 验证码登录 */
          codeLogin: {
            /** 标题 */
            title: string;
            /** 获取验证码 */
            getCode: string;
            /** 重新获取验证码 */
            reGetCode: string;
            /** 发送验证码成功 */
            sendCodeSuccess: string;
            /** 图片验证码占位符 */
            imageCodePlaceholder: string;
          };
          /** 注册 */
          register: {
            /** 标题 */
            title: string;
            /** 协议 */
            agreement: string;
            /** 用户协议 */
            protocol: string;
            /** 隐私政策 */
            policy: string;
          };
          /** 重置密码 */
          resetPwd: {
            /** 标题 */
            title: string;
          };
          /** 绑定微信 */
          bindWeChat: {
            /** 标题 */
            title: string;
          };
        };
        /** 关于 */
        about: {
          /** 标题 */
          title: string;
          /** 介绍 */
          introduction: string;
          /** 项目信息 */
          projectInfo: {
            /** 标题 */
            title: string;
            /** 版本 */
            version: string;
            /** 最新构建时间 */
            latestBuildTime: string;
            /** GitHub 链接 */
            githubLink: string;
            /** 预览链接 */
            previewLink: string;
          };
          /** 生产依赖 */
          prdDep: string;
          /** 开发依赖 */
          devDep: string;
        };
        /** 首页 */
        home: {
          /** 分支描述 */
          branchDesc: string;
          /** 问候语 */
          greeting: string;
          /** 天气描述 */
          weatherDesc: string;
          /** 项目数量 */
          projectCount: string;
          /** 待办事项 */
          todo: string;
          /** 消息 */
          message: string;
          /** 下载数量 */
          downloadCount: string;
          /** 注册数量 */
          registerCount: string;
          /** 日程 */
          schedule: string;
          /** 学习 */
          study: string;
          /** 工作 */
          work: string;
          /** 休息 */
          rest: string;
          /** 娱乐 */
          entertainment: string;
          /** 访问数量 */
          visitCount: string;
          /** 营业额 */
          turnover: string;
          /** 交易数量 */
          dealCount: string;
          /** 项目新闻 */
          projectNews: {
            /** 标题 */
            title: string;
            /** 更多新闻 */
            moreNews: string;
            /** 描述1 */
            desc1: string;
            /** 描述2 */
            desc2: string;
            /** 描述3 */
            desc3: string;
            /** 描述4 */
            desc4: string;
            /** 描述5 */
            desc5: string;
          };
          /** 创意 */
          creativity: string;
        };
        /** 功能 */
        function: {
          /** 标签页 */
          tab: {
            /** 标签页操作 */
            tabOperate: {
              /** 标题 */
              title: string;
              /** 添加标签页 */
              addTab: string;
              /** 添加标签页描述 */
              addTabDesc: string;
              /** 关闭标签页 */
              closeTab: string;
              /** 关闭当前标签页 */
              closeCurrentTab: string;
              /** 关闭关于标签页 */
              closeAboutTab: string;
              /** 添加多个标签页 */
              addMultiTab: string;
              /** 添加多个标签页描述1 */
              addMultiTabDesc1: string;
              /** 添加多个标签页描述2 */
              addMultiTabDesc2: string;
            };
            /** 标签页标题 */
            tabTitle: {
              /** 标题 */
              title: string;
              /** 更改标题 */
              changeTitle: string;
              /** 更改 */
              change: string;
              /** 重置标题 */
              resetTitle: string;
              /** 重置 */
              reset: string;
            };
          };
          /** 多标签页 */
          multiTab: {
            /** 路由参数 */
            routeParam: string;
            /** 返回标签页 */
            backTab: string;
          };
          /** 切换权限 */
          toggleAuth: {
            /** 切换账号 */
            toggleAccount: string;
            /** 权限钩子 */
            authHook: string;
            /** 超级管理员可见 */
            superAdminVisible: string;
            /** 管理员可见 */
            adminVisible: string;
            /** 管理员或用户可见 */
            adminOrUserVisible: string;
          };
          /** 请求 */
          request: {
            /** 重复错误发生一次 */
            repeatedErrorOccurOnce: string;
            /** 重复错误 */
            repeatedError: string;
            /** 重复错误消息1 */
            repeatedErrorMsg1: string;
            /** 重复错误消息2 */
            repeatedErrorMsg2: string;
          };
        };
        /** Alova */
        alova: {
          /** 场景 */
          scenes: {
            /** 验证码发送 */
            captchaSend: string;
            /** 自动请求 */
            autoRequest: string;
            /** 可见性请求提示 */
            visibilityRequestTips: string;
            /** 轮询请求提示 */
            pollingRequestTips: string;
            /** 网络请求提示 */
            networkRequestTips: string;
            /** 刷新时间 */
            refreshTime: string;
            /** 开始请求 */
            startRequest: string;
            /** 停止请求 */
            stopRequest: string;
            /** 跨组件请求 */
            requestCrossComponent: string;
            /** 触发所有请求 */
            triggerAllRequest: string;
          };
        };
        /** 管理 */
        manage: {
          /** 通用 */
          common: {
            /** 状态 */
            status: {
              /** 启用 */
              enable: string;
              /** 禁用 */
              disable: string;
            };
          };
          /** 角色 */
          role: {
            /** 标题 */
            title: string;
            /** 角色名称 */
            roleName: string;
            /** 角色代码 */
            roleCode: string;
            /** 角色状态 */
            roleStatus: string;
            /** 角色描述 */
            roleDesc: string;
            /** 表单 */
            form: {
              /** 角色名称 */
              roleName: string;
              /** 角色代码 */
              roleCode: string;
              /** 角色状态 */
              roleStatus: string;
              /** 角色描述 */
              roleDesc: string;
            };
            /** 添加角色 */
            addRole: string;
            /** 编辑角色 */
            editRole: string;
            /** 菜单权限 */
            menuAuth: string;
            /** 按钮权限 */
            buttonAuth: string;
          };
          /** 用户 */
          user: {
            /** 标题 */
            title: string;
            /** 用户名 */
            userName: string;
            /** 用户性别 */
            userGender: string;
            /** 昵称 */
            nickName: string;
            /** 用户手机号 */
            userPhone: string;
            /** 用户邮箱 */
            userEmail: string;
            /** 用户状态 */
            userStatus: string;
            /** 用户角色 */
            userRole: string;
            /** 表单 */
            form: {
              /** 用户名 */
              userName: string;
              /** 用户性别 */
              userGender: string;
              /** 昵称 */
              nickName: string;
              /** 用户手机号 */
              userPhone: string;
              /** 用户邮箱 */
              userEmail: string;
              /** 用户状态 */
              userStatus: string;
              /** 用户角色 */
              userRole: string;
            };
            /** 添加用户 */
            addUser: string;
            /** 编辑用户 */
            editUser: string;
            /** 性别 */
            gender: {
              /** 男 */
              male: string;
              /** 女 */
              female: string;
            };
          };
          /** 菜单 */
          menu: {
            /** 首页 */
            home: string;
            /** 标题 */
            title: string;
            /** ID */
            id: string;
            /** 父级 ID */
            parentId: string;
            /** 菜单类型 */
            menuType: string;
            /** 菜单名称 */
            menuName: string;
            /** 路由名称 */
            routeName: string;
            /** 路由路径 */
            routePath: string;
            /** 路径参数 */
            pathParam: string;
            /** 布局 */
            layout: string;
            /** 页面 */
            page: string;
            /** 国际化键 */
            i18nKey: string;
            /** 图标 */
            icon: string;
            /** 本地图标 */
            localIcon: string;
            /** 图标类型标题 */
            iconTypeTitle: string;
            /** 排序 */
            order: string;
            /** 常量 */
            constant: string;
            /** 保持活跃 */
            keepAlive: string;
            /** 外部链接 */
            href: string;
            /** 在菜单中隐藏 */
            hideInMenu: string;
            /** 激活菜单 */
            activeMenu: string;
            /** 多标签页 */
            multiTab: string;
            /** 在标签页中固定索引 */
            fixedIndexInTab: string;
            /** 查询参数 */
            query: string;
            /** 按钮 */
            button: string;
            /** 按钮代码 */
            buttonCode: string;
            /** 按钮描述 */
            buttonDesc: string;
            /** 菜单状态 */
            menuStatus: string;
            /** 表单 */
            form: {
              /** 首页 */
              home: string;
              /** 菜单类型 */
              menuType: string;
              /** 菜单名称 */
              menuName: string;
              /** 路由名称 */
              routeName: string;
              /** 路由路径 */
              routePath: string;
              /** 路径参数 */
              pathParam: string;
              /** 布局 */
              layout: string;
              /** 页面 */
              page: string;
              /** 国际化键 */
              i18nKey: string;
              /** 图标 */
              icon: string;
              /** 本地图标 */
              localIcon: string;
              /** 排序 */
              order: string;
              /** 保持活跃 */
              keepAlive: string;
              /** 外部链接 */
              href: string;
              /** 在菜单中隐藏 */
              hideInMenu: string;
              /** 激活菜单 */
              activeMenu: string;
              /** 多标签页 */
              multiTab: string;
              /** 在标签页中固定 */
              fixedInTab: string;
              /** 在标签页中固定索引 */
              fixedIndexInTab: string;
              /** 查询键 */
              queryKey: string;
              /** 查询值 */
              queryValue: string;
              /** 按钮 */
              button: string;
              /** 按钮代码 */
              buttonCode: string;
              /** 按钮描述 */
              buttonDesc: string;
              /** 菜单状态 */
              menuStatus: string;
            };
            /** 添加菜单 */
            addMenu: string;
            /** 编辑菜单 */
            editMenu: string;
            /** 添加子菜单 */
            addChildMenu: string;
            /** 类型 */
            type: {
              /** 目录 */
              directory: string;
              /** 菜单 */
              menu: string;
            };
            /** 图标类型 */
            iconType: {
              /** Iconify 图标 */
              iconify: string;
              /** 本地图标 */
              local: string;
            };
          };
        };
      };
      /** 表单 */
      form: {
        /** 必填项 */
        required: string;
        /** 用户名 */
        userName: FormMsg;
        /** 手机号 */
        phone: FormMsg;
        /** 密码 */
        pwd: FormMsg;
        /** 确认密码 */
        confirmPwd: FormMsg;
        /** 验证码 */
        code: FormMsg;
        /** 邮箱 */
        email: FormMsg;
      };
      /** 下拉菜单 */
      dropdown: Record<Global.DropdownKey, string>;
      /** 图标 */
      icon: {
        /** 主题配置 */
        themeConfig: string;
        /** 主题方案 */
        themeSchema: string;
        /** 语言 */
        lang: string;
        /** 全屏 */
        fullscreen: string;
        /** 退出全屏 */
        fullscreenExit: string;
        /** 刷新 */
        reload: string;
        /** 折叠 */
        collapse: string;
        /** 展开 */
        expand: string;
        /** 固定 */
        pin: string;
        /** 取消固定 */
        unpin: string;
      };
      /** 数据表 */
      datatable: {
        /** 项目数量 */
        itemCount: string;
      };
    };

    /** 获取国际化键 */
    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    /** 国际化键 */
    type I18nKey = GetI18nKey<Schema>;

    /** 翻译选项 */
    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    /** 翻译函数 */
    type $T = {
      /** 翻译 */
      (key: I18nKey): string;
      /** 翻译（复数） */
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      /** 翻译（默认消息） */
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      /** 翻译（列表） */
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      /** 翻译（列表，复数） */
      (key: I18nKey, list: unknown[], plural: number): string;
      /** 翻译（列表，默认消息） */
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      /** 翻译（命名参数） */
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      /** 翻译（命名参数，复数） */
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      /** 翻译（命名参数，默认消息） */
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    };
  }

  /** 服务命名空间 */
  namespace Service {
    /** 其他 baseURL 键 */
    type OtherBaseURLKey = 'demo';

    /** 服务配置项 */
    type ServiceConfigItem = {
      /** 后端服务基础 URL */
      baseURL: string;
      /** 后端服务基础 URL 的代理模式 */
      proxyPattern: string;
    };

    /** 其他服务配置项 */
    type OtherServiceConfigItem = {
      /** 键 */
      key: OtherBaseURLKey;
    } & ServiceConfigItem;

    /** 后端服务配置 */
    type ServiceConfig = {
      /** 其他后端服务配置 */
      other: OtherServiceConfigItem[];
    } & ServiceConfigItem;

    /** 简单服务配置 */
    type SimpleServiceConfig = {
      /** 其他服务配置 */
      other: Record<OtherBaseURLKey, string>;
    } & Pick<ServiceConfigItem, 'baseURL'>;

    /** 后端服务响应数据 */
    type Response<T = unknown> = {
      /** 后端服务响应代码 */
      code: string;
      /** 后端服务响应消息 */
      msg: string;
      /** 后端服务响应数据 */
      data: T;
    };

    /** 演示后端服务响应数据 */
    type DemoResponse<T = unknown> = {
      /** 后端服务响应代码 */
      status: string;
      /** 后端服务响应消息 */
      message: string;
      /** 后端服务响应数据 */
      result: T;
    };
  }
}
