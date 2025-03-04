import type { PageTabCssVars, PageTabCssVarsProps } from '../../types'

import { addColorAlpha, transformColorWithOpacity } from '@sa/color'

/** 标签的激活颜色 */
export const ACTIVE_COLOR = '#1890ff'

/**
 * 通过属性创建 CSS 变量
 *
 * @param props CSS 变量属性
 * @returns CSS 变量
 */
function createCssVars(props: PageTabCssVarsProps): PageTabCssVars {
  const cssVars: PageTabCssVars = {
    /** 主颜色 */
    '--soy-primary-color': props.primaryColor,

    /** 主颜色的变体1 */
    '--soy-primary-color1': props.primaryColor1,

    /** 主颜色的变体2 */
    '--soy-primary-color2': props.primaryColor2,

    /** 主颜色的不透明度1 */
    '--soy-primary-color-opacity1': props.primaryColorOpacity1,

    /** 主颜色的不透明度2 */
    '--soy-primary-color-opacity2': props.primaryColorOpacity2,

    /** 主颜色的不透明度3 */
    '--soy-primary-color-opacity3': props.primaryColorOpacity3,
  }

  return cssVars
}

/**
 * 创建标签 CSS 变量
 *
 * @param primaryColor 主颜色
 * @returns CSS 变量
 */
export function createTabCssVars(primaryColor: string): PageTabCssVars {
  const cssProps: PageTabCssVarsProps = {
    primaryColor,
    primaryColor1: transformColorWithOpacity(primaryColor, 0.1, '#ffffff'),
    primaryColor2: transformColorWithOpacity(primaryColor, 0.3, '#000000'),
    primaryColorOpacity1: addColorAlpha(primaryColor, 0.1),
    primaryColorOpacity2: addColorAlpha(primaryColor, 0.15),
    primaryColorOpacity3: addColorAlpha(primaryColor, 0.3),
  }

  return createCssVars(cssProps)
}
