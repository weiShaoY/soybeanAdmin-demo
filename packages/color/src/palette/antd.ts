import type { AnyColor, HsvColor } from 'colord'

import type { ColorIndex } from '../types'

import {
  getHex,
  getHsv,
  isValidColor,
  mixColor,
} from '../shared'

/** 色相步进 */
const hueStep = 2

/** 饱和度步进，浅色部分 */
const saturationStep = 16

/** 饱和度步进，深色部分 */
const saturationStep2 = 5

/** 亮度步进，浅色部分 */
const brightnessStep1 = 5

/** 亮度步进，深色部分 */
const brightnessStep2 = 15

/** 浅色数量，主色偏上 */
const lightColorCount = 5

/** 深色数量，主色偏下 */
const darkColorCount = 4

/**
 * 根据索引获取 AntD 调色板颜色
 *
 * @param color - 颜色
 * @param index - 调色板中的颜色索引（主色索引为 6）
 * @returns 十六进制颜色
 */
export function getAntDPaletteColorByIndex(color: AnyColor, index: ColorIndex): string {
  if (!isValidColor(color)) {
    throw new Error('无效的输入颜色值')
  }

  if (index === 6) {
    return getHex(color)
  }

  const isLight = index < 6

  const hsv = getHsv(color)

  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1

  const newHsv: HsvColor = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight),
  }

  return getHex(newHsv)
}

/** 深色调色板索引与透明度的映射 */
const darkColorMap = [
  {
    index: 7,
    opacity: 0.15,
  },
  {
    index: 6,
    opacity: 0.25,
  },
  {
    index: 5,
    opacity: 0.3,
  },
  {
    index: 5,
    opacity: 0.45,
  },
  {
    index: 5,
    opacity: 0.65,
  },
  {
    index: 5,
    opacity: 0.85,
  },
  {
    index: 5,
    opacity: 0.9,
  },
  {
    index: 4,
    opacity: 0.93,
  },
  {
    index: 3,
    opacity: 0.95,
  },
  {
    index: 2,
    opacity: 0.97,
  },
  {
    index: 1,
    opacity: 0.98,
  },
]

/**
 * 获取 AntD 颜色调色板
 *
 * @param color - 颜色
 * @param darkTheme - 是否使用暗色主题
 * @param darkThemeMixColor - 暗色主题混合颜色（默认：#141414）
 */
export function getAntDColorPalette(color: AnyColor, darkTheme = false, darkThemeMixColor = '#141414'): string[] {
  const indexes: ColorIndex[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  const patterns = indexes.map(index => getAntDPaletteColorByIndex(color, index))

  if (darkTheme) {
    const darkPatterns = darkColorMap.map(({ index, opacity }) => {
      const darkColor = mixColor(darkThemeMixColor, patterns[index], opacity)

      return darkColor
    })

    return darkPatterns.map(item => getHex(item))
  }

  return patterns
}

/**
 * 获取色相
 *
 * @param hsv - Hsv 格式颜色
 * @param i - 相对于 6 的位置
 * @param isLight - 是否为浅色
 */
function getHue(hsv: HsvColor, i: number, isLight: boolean) {
  let hue: number

  const hsvH = Math.round(hsv.h)

  if (hsvH >= 60 && hsvH <= 240) {
    hue = isLight ? hsvH - hueStep * i : hsvH + hueStep * i
  }
  else {
    hue = isLight ? hsvH + hueStep * i : hsvH - hueStep * i
  }

  if (hue < 0) {
    hue += 360
  }

  if (hue >= 360) {
    hue -= 360
  }

  return hue
}

/**
 * 获取饱和度
 *
 * @param hsv - Hsv 格式颜色
 * @param i - 相对于 6 的位置
 * @param isLight - 是否为浅色
 */
function getSaturation(hsv: HsvColor, i: number, isLight: boolean) {
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s
  }

  let saturation: number

  if (isLight) {
    saturation = hsv.s - saturationStep * i
  }
  else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep
  }
  else {
    saturation = hsv.s + saturationStep2 * i
  }

  if (saturation > 100) {
    saturation = 100
  }

  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10
  }

  if (saturation < 6) {
    saturation = 6
  }

  return saturation
}

/**
 * 获取亮度值
 *
 * @param hsv - Hsv 格式颜色
 * @param i - 相对于 6 的位置
 * @param isLight - 是否为浅色
 */
function getValue(hsv: HsvColor, i: number, isLight: boolean) {
  let value: number

  if (isLight) {
    value = hsv.v + brightnessStep1 * i
  }
  else {
    value = hsv.v - brightnessStep2 * i
  }

  if (value > 100) {
    value = 100
  }

  return value
}
