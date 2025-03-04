/**
 * 颜色调色板的编号
 *
 * 主色的编号是 500
 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

/** 颜色调色板 */
export type ColorPalette = {

  /** 颜色的 HEX 值 */
  hex: string

  /**
   * 颜色的编号
   *
   * - 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
   */
  number: ColorPaletteNumber
}

/** 颜色调色板家族 */
export type ColorPaletteFamily = {

  /** 颜色调色板家族名称 */
  name: string

  /** 颜色调色板集合 */
  palettes: ColorPalette[]
}

/** 带有色差的颜色调色板 */
export type ColorPaletteWithDelta = ColorPalette & {
  delta: number // 色差
}

/** 带有最近调色板的颜色调色板家族 */
export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestPalette: ColorPaletteWithDelta // 最近的调色板
  nearestLightnessPalette: ColorPaletteWithDelta // 最近的亮度调色板
}

/** 颜色调色板匹配 */
export type ColorPaletteMatch = ColorPaletteFamily & {

  /** 调色板的颜色映射 */
  colorMap: Map<ColorPaletteNumber, ColorPalette>

  /**
   * 调色板的主色
   *
   * 主色的编号是 500
   */
  main: ColorPalette

  /** 调色板的匹配色 */
  match: ColorPalette
}

/**
 * 颜色调色板的索引
 *
 * 从左到右，颜色从浅到深，第 6 个是主色
 */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
