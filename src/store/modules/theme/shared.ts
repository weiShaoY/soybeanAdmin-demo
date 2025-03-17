import { DARK_CLASS } from '@/constants/app' // 导入暗黑模式的 CSS 类名常量

import { overrideThemeSettings, themeSettings } from '@/theme/settings' // 导入主题设置和覆盖主题设置

import { themeVars } from '@/theme/vars' // 导入主题变量

import { localStg, toggleHtmlClass } from '@/utils' // 导入本地存储工具函数和切换 HTML 类名的工具函数

import {
  getColorPalette,
  getRgb,
} from '@sa/color' // 导入颜色工具函数

import { defu } from 'defu' // 导入对象合并工具函数

/** 初始化主题设置 */
export function initThemeSettings() {
  const isProd = import.meta.env.PROD // 判断是否为生产环境

  // 如果是开发模式，主题设置不会被缓存，通过更新 `src/theme/settings.ts` 中的 `themeSettings` 来更新主题设置
  if (!isProd) {
    return themeSettings // 直接返回主题设置
  }

  // 如果是生产模式，主题设置将被缓存到 localStorage 中
  // 如果想在发布新版本时更新主题设置，请更新 `src/theme/settings.ts` 中的 `overrideThemeSettings`
  /**
   *  从本地存储中获取主题设置
   */
  const localSettings = localStg.get('themeSettings')

  /**
   *  合并本地设置和默认主题设置
   */
  let settings = defu(localSettings, themeSettings)

  /**
   *  判断是否需要覆盖主题设置
   */
  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME

  if (!isOverride) {
    // 合并覆盖主题设置
    settings = defu(overrideThemeSettings, settings)

    // 设置覆盖标志
    localStg.set('overrideThemeFlag', BUILD_TIME)
  }

  // 返回最终的主题设置
  return settings
}

/**
 * 根据主题设置创建主题令牌 CSS 变量值
 * @param colors 主题颜色
 * @param tokens 主题设置令牌
 * @param recommended 是否使用推荐颜色。默认值为 `false`. Default is `false`
 */
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
  recommended = false,
) {
  /**
   *  创建主题调色板颜色
   */
  const paletteColors = createThemePaletteColors(colors, recommended)

  // 获取主题令牌，默认为默认主题设置中的令牌
  const { light, dark } = tokens || themeSettings.tokens

  /**
   *   亮色主题令牌
   */
  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors, // 调色板颜色
      nprogress: paletteColors.primary, // NProgress 颜色
      ...light.colors, // 亮色主题颜色
    },
    boxShadow: {
      ...light.boxShadow, // 亮色主题阴影
    },
  }

  /**
   *   暗色主题令牌
   */
  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      // 继承亮色主题颜色
      ...themeTokens.colors,

      // 暗色主题颜色
      ...dark?.colors,
    },
    boxShadow: {
      // 继承亮色主题阴影
      ...themeTokens.boxShadow,

      // 暗色主题阴影
      ...dark?.boxShadow,
    },
  }

  return {
    /**
     *  亮色主题令牌
     */
    themeTokens,

    /**
     *  暗色主题令牌
     */
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
  /**
   *  获取颜色键
   */
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]

  /**
   *  初始化调色板颜色变量
   */
  const colorPaletteVar = {
  } as App.Theme.ThemePaletteColor

  colorKeys.forEach((key) => {
    /**
     *  获取颜色调色板
     */
    const colorMap = getColorPalette(colors[key], recommended)

    // 设置主色调
    colorPaletteVar[key] = colorMap.get(500)!

    colorMap.forEach((hex, number) => {
      // 设置不同色阶的颜色
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  // 返回调色板颜色
  return colorPaletteVar
}

/**
 * 根据令牌获取 CSS 变量
 * @param tokens 主题基础令牌
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  /**
   *  初始化样式数组
   */
  const styles: string[] = []

  /**
   *   移除 CSS 变量前缀
   */
  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '')
  }

  /**
   *  移除 RGB 前缀
   */
  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '')
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      /**
       *  获取 CSS 变量键
       */
      let cssVarsKey = removeVarPrefix(tokenValue)

      /**
       *  获取 CSS 变量值
       */
      let cssValue = tokens[key][tokenKey]

      if (key === 'colors') {
        // 如果是颜色，移除 RGB 前缀
        cssVarsKey = removeRgbPrefix(cssVarsKey)

        // 获取 RGB 值
        const { r, g, b } = getRgb(cssValue)

        // 设置 RGB 格式的值
        cssValue = `${r} ${g} ${b}`
      }

      // 将 CSS 变量添加到样式数组
      styles.push(`${cssVarsKey}: ${cssValue}`)
    }
  }

  /**
   *  将样式数组拼接成字符串
   */
  const styleStr = styles.join(';')

  // 返回样式字符串
  return styleStr
}

/**
 * 将主题变量添加到全局
 *
 * @param tokens 主题令牌
 * @param darkTokens 暗黑主题令牌
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  /**
   *  获取亮色主题的 CSS 变量字符串
   */
  const cssVarStr = getCssVarByTokens(tokens)

  /**
   *  获取暗黑主题的 CSS 变量字符串
   */
  const darkCssVarStr = getCssVarByTokens(darkTokens)

  /**
   *  创建亮色主题的 CSS
   */
  const css = `:root { ${cssVarStr} }`

  /**
   *  创建暗黑主题的 CSS
   */
  const darkCss = `html.${DARK_CLASS} { ${darkCssVarStr} }`

  /**
   *  样式 ID
   */
  const styleId = 'theme-vars'

  /**
   *  获取样式元素
   */
  const style = document.querySelector(`#${styleId}`) || document.createElement('style')

  // 设置样式 ID
  style.id = styleId

  // 设置样式内容
  style.textContent = css + darkCss

  // 将样式添加到文档头部
  document.head.appendChild(style)
}

/**
 * 切换 CSS 暗模式
 * @param darkMode 是否为暗模式
 */
export function toggleCssDarkMode(darkMode = false) {
  // 获取切换 HTML 类名的函数
  const { add, remove } = toggleHtmlClass(DARK_CLASS)

  if (darkMode) {
    // 添加暗黑模式类名
    add()
  }
  else {
    // 移除暗黑模式类名
    remove()
  }
}

/**
 * 切换辅助色模式
 * @param grayscaleMode 灰度模式
 * @param colourWeakness 色盲模式
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
  /**
   *  获取 HTML 元素
   */
  const htmlElement = document.documentElement

  // 设置滤镜效果
  htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colourWeakness ? 'invert(80%)' : '']
    .filter(Boolean)
    .join(' ')
}
