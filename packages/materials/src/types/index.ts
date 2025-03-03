/** 头部配置 */
type AdminLayoutHeaderConfig = {
  /**
   * 头部是否可见
   *
   * @default true
   */
  headerVisible?: boolean;
  /**
   * 头部类名
   *
   * @default ''
   */
  headerClass?: string;
  /**
   * 头部高度
   *
   * @default 56px
   */
  headerHeight?: number;
};

/** 标签配置 */
type AdminLayoutTabConfig = {
  /**
   * 标签是否可见
   *
   * @default true
   */
  tabVisible?: boolean;
  /**
   * 标签类名
   *
   * @default ''
   */
  tabClass?: string;
  /**
   * 标签高度
   *
   * @default 48px
   */
  tabHeight?: number;
};

/** 侧边栏配置 */
type AdminLayoutSiderConfig = {
  /**
   * 侧边栏是否可见
   *
   * @default true
   */
  siderVisible?: boolean;
  /**
   * 侧边栏类名
   *
   * @default ''
   */
  siderClass?: string;
  /**
   * 移动端侧边栏类名
   *
   * @default ''
   */
  mobileSiderClass?: string;
  /**
   * 侧边栏折叠状态
   *
   * @default false
   */
  siderCollapse?: boolean;
  /**
   * 侧边栏在未折叠时的宽度
   *
   * @default '220px'
   */
  siderWidth?: number;
  /**
   * 侧边栏在折叠时的宽度
   *
   * @default '64px'
   */
  siderCollapsedWidth?: number;
};

/** 内容配置 */
export type AdminLayoutContentConfig = {
  /**
   * 内容类名
   *
   * @default ''
   */
  contentClass?: string;
  /**
   * 内容是否全屏
   *
   * 如果为 true，其他元素将通过 `display: none` 隐藏
   */
  fullContent?: boolean;
};

/** 底部配置 */
export type AdminLayoutFooterConfig = {
  /**
   * 底部是否可见
   *
   * @default true
   */
  footerVisible?: boolean;
  /**
   * 底部是否固定
   *
   * @default true
   */
  fixedFooter?: boolean;
  /**
   * 底部类名
   *
   * @default ''
   */
  footerClass?: string;
  /**
   * 底部高度
   *
   * @default 48px
   */
  footerHeight?: number;
  /**
   * 底部是否位于右侧
   *
   * 当布局为垂直时，底部位于右侧
   */
  rightFooter?: boolean;
};

/**
 * 布局模式
 *
 * - Horizontal: 水平布局
 * - Vertical: 垂直布局
 */
export type LayoutMode = 'horizontal' | 'vertical';

/**
 * 内容溢出时的滚动模式
 *
 * - Wrapper: 布局组件的包装元素有滚动条
 * - Content: 布局组件的内容元素有滚动条
 *
 * @default 'wrapper'
 */
export type LayoutScrollMode = 'wrapper' | 'content';

/** 管理布局属性 */
export type AdminLayoutProps = {
  /**
   * 布局模式
   *
   * - {@link LayoutMode}
   */
  mode?: LayoutMode;

  /** 是否为移动端布局 */
  isMobile?: boolean;

  /**
   * 滚动模式
   *
   * - {@link LayoutScrollMode}
   */
  scrollMode?: LayoutScrollMode;

  /**
   * 布局的滚动元素的 ID
   *
   * 可用于获取对应的 Dom 并滚动它
   *
   * @example
   *   使用默认 ID 通过导入
   *   ```ts
   *   import { adminLayoutScrollElId } from '@sa/vue-materials';
   *   ```
   *
   * @default
   * ```ts
   * const adminLayoutScrollElId = '__ADMIN_LAYOUT_SCROLL_EL_ID__'
   * ```
   */
  scrollElId?: string;
  /** 滚动元素的类名 */
  scrollElClass?: string;
  /** 滚动包装元素的类名 */
  scrollWrapperClass?: string;
  /**
   * 布局的通用类名
   *
   * 可用于配置过渡动画
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /**
   * 是否固定顶部的头部和标签
   *
   * @default true
   */
  fixedTop?: boolean;
  /**
   * 布局的最大 z-index
   *
   * 头部、标签、侧边栏和底部的 z-index 不会超过此值
   */
  maxZIndex?: number;
} & AdminLayoutHeaderConfig &
  AdminLayoutTabConfig &
  AdminLayoutSiderConfig &
  AdminLayoutContentConfig &
  AdminLayoutFooterConfig;

/** 将字符串转换为 kebab-case 的类型 */
type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

/** 将字符串转换为 kebab-case 的类型 */
type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S;

/** CSS 变量前缀 */
type Prefix = '--soy-';

/** 布局 CSS 变量属性 */
export type LayoutCssVarsProps = Pick<
  AdminLayoutProps,
  'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight'
> & {
  /** 头部 z-index */
  headerZIndex?: number;

  /** 标签 z-index */
  tabZIndex?: number;

  /** 侧边栏 z-index */
  siderZIndex?: number;

  /** 移动端侧边栏 z-index */
  mobileSiderZIndex?: number;

  /** 底部 z-index */
  footerZIndex?: number;
};

/** 布局 CSS 变量 */
export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

/**
 * 标签模式
 *
 * - Button: 按钮样式
 * - Chrome: Chrome 样式
 *
 * @default chrome
 */
export type PageTabMode = 'button' | 'chrome';

/** 页面标签属性 */
export type PageTabProps = {
  /** 是否为暗模式 */
  darkMode?: boolean;

  /**
   * 标签模式
   *
   * - {@link PageTabMode}
   */
  mode?: PageTabMode;

  /**
   * 布局的通用类名
   *
   * 可用于配置过渡动画
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;

  /** 按钮标签的类名 */
  buttonClass?: string;

  /** Chrome 标签的类名 */
  chromeClass?: string;

  /** 标签是否激活 */
  active?: boolean;

  /** 激活标签的颜色 */
  activeColor?: string;

  /**
   * 标签是否可关闭
   *
   * 当为 true 时显示关闭图标
   */
  closable?: boolean;
};

/** 页面标签 CSS 变量属性 */
export type PageTabCssVarsProps = {
  /**
   * 主颜色
   *
   * @default ''
   */
  primaryColor: string;

  /**
   * 主颜色 1
   *
   * @default ''
   */
  primaryColor1: string;

  /**
   * 主颜色 2
   *
   * @default ''
   */
  primaryColor2: string;

  /**
   * 主颜色不透明度 1
   *
   * @default ''
   */
  primaryColorOpacity1: string;

  /**
   * 主颜色不透明度 2
   *
   * @default ''
   */
  primaryColorOpacity2: string;

  /**
   * 主颜色不透明度 3
   *
   * @default ''
   */
  primaryColorOpacity3: string;
};

/** 页面标签 CSS 变量 */
export type PageTabCssVars = {
  /** 根据 `PageTabCssVarsProps` 中的键，通过 `Prefix` 和 `KebabCase` 转换后形成新的键，并且值为 `string` 或 `number` */
  [K in keyof PageTabCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};
