import type {
  ColorPalette,
  ColorPaletteFamily,
  ColorPaletteFamilyWithNearestPalette,
  ColorPaletteMatch,
  ColorPaletteNumber,
} from '../types'

import { colorPalettes } from '../constant'

import {
  getColorName,
  getDeltaE,
  getHsl,
  isValidColor,
  transformHslToHex,
} from '../shared'

/**
 * 根据提供的颜色获取推荐的颜色调色板
 *
 * @param color 提供的颜色
 * @returns 推荐的颜色调色板
 */
export function getRecommendedColorPalette(color: string) {
  const colorPaletteFamily = getRecommendedColorPaletteFamily(color)

  const colorMap = new Map<ColorPaletteNumber, ColorPalette>()

  colorPaletteFamily.palettes.forEach((palette) => {
    colorMap.set(palette.number, palette)
  })

  const mainColor = colorMap.get(500)!

  const matchColor = colorPaletteFamily.palettes.find(palette => palette.hex === color)!

  const colorPalette: ColorPaletteMatch = {
    ...colorPaletteFamily,
    colorMap,
    main: mainColor,
    match: matchColor,
  }

  return colorPalette
}

/**
 * 根据提供的颜色和调色板编号获取推荐的调色板颜色
 *
 * @param color 提供的颜色
 * @param number 调色板编号
 * @returns 推荐的颜色（HEX）
 */
export function getRecommendedPaletteColorByNumber(color: string, number: ColorPaletteNumber) {
  const colorPalette = getRecommendedColorPalette(color)

  const { hex } = colorPalette.colorMap.get(number)!

  return hex
}

/**
 * 根据提供的颜色和颜色名称获取推荐的颜色调色板家族
 *
 * @param color 提供的颜色
 * @returns 推荐的颜色调色板家族
 */
export function getRecommendedColorPaletteFamily(color: string) {
  if (!isValidColor(color)) {
    throw new Error('无效的颜色，请检查颜色值！')
  }

  let colorName = getColorName(color)

  colorName = colorName.toLowerCase().replace(/\s/g, '-')

  const { h: h1, s: s1 } = getHsl(color)

  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(color, colorPalettes)

  const { number, hex } = nearestLightnessPalette

  const { h: h2, s: s2 } = getHsl(hex)

  const deltaH = h1 - h2

  const sRatio = s1 / s2

  const colorPaletteFamily: ColorPaletteFamily = {
    name: colorName,
    palettes: palettes.map((palette) => {
      let hexValue = color

      const isSame = number === palette.number

      if (!isSame) {
        const { h: h3, s: s3, l } = getHsl(palette.hex)

        const newH = deltaH < 0 ? h3 + deltaH : h3 - deltaH

        const newS = s3 * sRatio

        hexValue = transformHslToHex({
          h: newH,
          s: newS,
          l,
        })
      }

      return {
        hex: hexValue,
        number: palette.number,
      }
    }),
  }

  return colorPaletteFamily
}

/**
 * 根据提供的颜色和多个颜色调色板家族，获取最近的颜色调色板家族
 *
 * @param color 提供的颜色
 * @param families 颜色调色板家族的数组
 * @returns 最近的颜色调色板家族
 */
function getNearestColorPaletteFamily(color: string, families: ColorPaletteFamily[]) {
  const familyWithConfig = families.map((family) => {
    const palettes = family.palettes.map((palette) => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hex),
      }
    })

    const nearestPalette = palettes.reduce((prev, curr) => (prev.delta < curr.delta ? prev : curr))

    return {
      ...family,
      palettes,
      nearestPalette,
    }
  })

  const nearestPaletteFamily = familyWithConfig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr,
  )

  const { l } = getHsl(color)

  const paletteFamily: ColorPaletteFamilyWithNearestPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce((prev, curr) => {
      const { l: prevLightness } = getHsl(prev.hex)

      const { l: currLightness } = getHsl(curr.hex)

      const deltaPrev = Math.abs(prevLightness - l)

      const deltaCurr = Math.abs(currLightness - l)

      return deltaPrev < deltaCurr ? prev : curr
    }),
  }

  return paletteFamily
}
