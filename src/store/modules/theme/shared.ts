import { DARK_CLASS } from '@/constants/app'

import { overrideThemeSettings, themeSettings } from '@/theme/settings'

import { themeVars } from '@/theme/vars'

import { toggleHtmlClass } from '@/utils/common'

import { localStg } from '@/utils/storage'

import {
  addColorAlpha,
  getColorPalette,
  getPaletteColorByNumber,
  getRgb,
} from '@sa/color'

import { defu } from 'defu'

/** 初始化主题设置 */
export function initThemeSettings() {
  const isProd = import.meta.env.PROD

  // 如果是开发模式，主题设置不会被缓存，通过更新 `src/theme/settings.ts` 中的 `themeSettings` 来更新主题设置
  if (!isProd) {
    return themeSettings
  }

  // 如果是生产模式，主题设置将被缓存到 localStorage 中
  // 如果想在发布新版本时更新主题设置，请更新 `src/theme/settings.ts` 中的 `overrideThemeSettings`

  const localSettings = localStg.get('themeSettings')

  let settings = defu(localSettings, themeSettings)

  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME

  if (!isOverride) {
    settings = defu(overrideThemeSettings, settings)
    localStg.set('overrideThemeFlag', BUILD_TIME)
  }

  return settings
}

/**
 * 根据主题设置创建主题令牌 CSS 变量值
 *
 * @param colors 主题颜色
 * @param tokens 主题设置令牌
 * @param recommended 是否使用推荐颜色。默认值为 `false`. Default is `false`
 */
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
  recommended = false,
) {
  const paletteColors = createThemePaletteColors(colors, recommended)

  const { light, dark } = tokens || themeSettings.tokens

  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      ...light.colors,
    },
    boxShadow: {
      ...light.boxShadow,
    },
  }

  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors,
    },
    boxShadow: {
      ...themeTokens.boxShadow,
      ...dark?.boxShadow,
    },
  }

  return {
    themeTokens,
    darkThemeTokens,
  }
}

/**
 * 创建主题调色板颜色
 *
 * @param colors 主题颜色
 * @param [recommended] 是否使用推荐颜色。默认值为 `false`. Default is `false`
 */
function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]

  const colorPaletteVar = {
  } as App.Theme.ThemePaletteColor

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key], recommended)

    colorPaletteVar[key] = colorMap.get(500)!

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  return colorPaletteVar
}

/**
 * 根据令牌获取 CSS 变量
 *
 * @param tokens 主题基础令牌
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  const styles: string[] = []

  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '')
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '')
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue)

      let cssValue = tokens[key][tokenKey]

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey)
        const { r, g, b } = getRgb(cssValue)

        cssValue = `${r} ${g} ${b}`
      }

      styles.push(`${cssVarsKey}: ${cssValue}`)
    }
  }

  const styleStr = styles.join(';')

  return styleStr
}

/**
 * 将主题变量添加到全局
 *
 * @param tokens 主题令牌
 * @param darkTokens 暗黑主题令牌
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens)

  const darkCssVarStr = getCssVarByTokens(darkTokens)

  const css = `:root { ${cssVarStr} }`

  const darkCss = `html.${DARK_CLASS} { ${darkCssVarStr} }`

  const styleId = 'theme-vars'

  const style = document.querySelector(`#${styleId}`) || document.createElement('style')

  style.id = styleId

  style.textContent = css + darkCss

  document.head.appendChild(style)
}

/**
 * 切换 CSS 暗模式
 *
 * @param darkMode 是否为暗模式
 */
export function toggleCssDarkMode(darkMode = false) {
  const { add, remove } = toggleHtmlClass(DARK_CLASS)

  if (darkMode) {
    add()
  }
  else {
    remove()
  }
}

/**
 * 切换辅助色模式
 *
 * @param grayscaleMode 灰度模式
 * @param colourWeakness 色盲模式
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
  const htmlElement = document.documentElement

  htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colourWeakness ? 'invert(80%)' : '']
    .filter(Boolean)
    .join(' ')
}

type NaiveColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'
type NaiveColorKey = `${App.Theme.ThemeColorKey}Color${NaiveColorScene}`
type NaiveThemeColor = Partial<Record<NaiveColorKey, string>>
type NaiveColorAction = {
  scene: NaiveColorScene
  handler: (color: string) => string
}

/**
 * 获取 Naive UI 主题颜色
 *
 * @param colors 主题颜色
 * @param [recommended] 是否使用推荐颜色。默认值为 `false`. Default is `false`
 */
function getNaiveThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorActions: NaiveColorAction[] = [
    {
      scene: '',
      handler: color => color,
    },
    {
      scene: 'Suppl',
      handler: color => color,
    },
    {
      scene: 'Hover',
      handler: color => getPaletteColorByNumber(color, 500, recommended),
    },
    {
      scene: 'Pressed',
      handler: color => getPaletteColorByNumber(color, 700, recommended),
    },
    {
      scene: 'Active',
      handler: color => addColorAlpha(color, 0.1),
    },
  ]

  const themeColors: NaiveThemeColor = {
  }

  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

  colorEntries.forEach((color) => {
    colorActions.forEach((action) => {
      const [colorType, colorValue] = color

      const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`

      themeColors[colorKey] = action.handler(colorValue)
    })
  })

  return themeColors
}

/**
 * 获取 Naive UI 主题
 *
 * @param colors 主题颜色
 * @param [recommended] 是否使用推荐颜色。默认值为 `false`. Default is `false`
 */
export function getNaiveTheme(colors: App.Theme.ThemeColor, recommended = false) {
  const { primary: colorLoading } = colors

  const theme = {
    common: {
      ...getNaiveThemeColors(colors, recommended),
      borderRadius: '6px',
    },
    LoadingBar: {
      colorLoading,
    },
    Tag: {
      borderRadius: '6px',
    },
  }

  return theme
}
