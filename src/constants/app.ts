import { transformRecordToOption } from '@/utils'

/** 全局头部菜单ID */
export const GLOBAL_HEADER_MENU_ID = '__GLOBAL_HEADER_MENU__'

/** 全局侧边菜单ID */
export const GLOBAL_SIDER_MENU_ID = '__GLOBAL_SIDER_MENU__'

/** 主题方案记录 */
export const themeSchemaRecord = {
  light: '亮色模式',
  dark: '暗黑模式',
  auto: '跟随系统',
}

/** 主题方案选项 */
export const themeSchemaOptions = transformRecordToOption(themeSchemaRecord)

/** 登录模块记录 */
export const loginModuleRecord = {
  'pwd-login': '密码登录',
  'code-login': '验证码登录',
  'register': '注册账号',
  'reset-pwd': '重置密码',
  'bind-wechat': '绑定微信',
}

/** 主题布局模式记录 */
export const themeLayoutModeRecord = {
  'vertical': '左侧菜单模式',
  'vertical-mix': '左侧菜单混合模式',
  'horizontal': '顶部菜单模式',
  'horizontal-mix': '顶部菜单混合模式',
}

/** 主题布局模式选项 */
export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord)

/** 主题滚动模式记录 */
export const themeScrollModeRecord = {
  wrapper: '外层滚动',
  content: '主体滚动',
}

/** 主题滚动模式选项 */
export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord)

/** 主题标签模式记录 */
export const themeTabModeRecord = {
  chrome: '谷歌风格',
  button: '按钮风格',
}

/** 主题标签模式选项 */
export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord)

/** 主题页面动画模式记录 */
export const themePageAnimationModeRecord = {
  'fade-slide': '滑动',
  'fade': '淡入淡出',
  'fade-bottom': '底部消退',
  'fade-scale': '缩放消退',
  'zoom-fade': '渐变',
  'zoom-out': '闪现',
  'none': '无',
}

/** 主题页面动画模式选项 */
export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord)

/** 重置缓存策略记录 */
export const resetCacheStrategyRecord = {
  close: '关闭页面',
  refresh: '刷新页面',
}

/** 重置缓存策略选项 */
export const resetCacheStrategyOptions = transformRecordToOption(resetCacheStrategyRecord)

/** 暗黑模式类名 */
export const DARK_CLASS = 'dark'
