/**
 * 创建调色板变量
 * 生成包含基础颜色（primary、info、success等）及其不同深浅程度的 CSS 变量
 */
function createColorPaletteVars() {
  /** 主题基础颜色列表 */
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error']

  /** 颜色的不同深浅级别 */
  const colorPaletteNumbers: App.Theme.ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  /** 存储生成的调色板变量 */
  const colorPaletteVar = {
  } as App.Theme.ThemePaletteColor

  colors.forEach((color) => {
    // 生成基础颜色变量，例如：primary -> rgb(var(--primary-color))
    colorPaletteVar[color] = `rgb(var(--${color}-color))`

    colorPaletteNumbers.forEach((number) => {
      // 生成不同深浅程度的颜色变量，例如：primary-100 -> rgb(var(--primary-100-color))
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`
    })
  })

  return colorPaletteVar
}

/** 调色板变量 */
const colorPaletteVars = createColorPaletteVars()

/** 主题变量 */
export const themeVars: App.Theme.ThemeTokenCSSVars = {
  /** 颜色变量集合 */
  colors: {
    ...colorPaletteVars,

    /** 进度条颜色 */
    'nprogress': 'rgb(var(--nprogress-color))',

    /** 容器背景色 */
    'container': 'rgb(var(--container-bg-color))',

    /** 布局背景色 */
    'layout': 'rgb(var(--layout-bg-color))',

    /** 反色背景 */
    'inverted': 'rgb(var(--inverted-bg-color))',

    /** 基础文本颜色 */
    'base-text': 'rgb(var(--base-text-color))',
  },

  /** 盒子阴影 */
  boxShadow: {
    /** 顶部栏阴影 */
    header: 'var(--header-box-shadow)',

    /** 侧边栏阴影 */
    sider: 'var(--sider-box-shadow)',

    /** 标签栏阴影 */
    tab: 'var(--tab-box-shadow)',
  },
}
