/** 存储命名空间 */
declare namespace StorageType {
  /** 会话存储 */
  type Session = {
    /** 主题颜色 */
    themeColor: string;
    // /** 主题设置 */
    // themeSettings: App.Theme.ThemeSetting;
  };

  /** 本地存储 */
  type Local = {
    /** i18n 语言 */
    lang: App.I18n.LangType;
    /** 令牌 */
    token: string;
    /** 混合菜单固定侧边栏 */
    mixSiderFixed: CommonType.YesOrNo;
    /** 刷新令牌 */
    refreshToken: string;
    /** 主题颜色 */
    themeColor: string;
    /** 暗模式 */
    darkMode: boolean;
    /** 主题设置 */
    themeSettings: App.Theme.ThemeSetting;
    /**
     * 覆写主题标志
     *
     * 值为项目构建时间
     */
    overrideThemeFlag: string;
    /** 全局标签 */
    globalTabs: App.Global.Tab[];
    /** 移动端之前的备份主题设置 */
    backupThemeSettingBeforeIsMobile: {
      /** 布局模式 */
      layout: UnionKey.ThemeLayoutMode;
      /** 侧边栏折叠状态 */
      siderCollapse: boolean;
    };
  };
}
