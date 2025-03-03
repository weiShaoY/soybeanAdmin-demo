import type { AnyColor } from 'colord';

import type { ColorPaletteNumber } from '../types';

import { getHex } from '../shared';

import { getAntDColorPalette } from './antd';

import { getRecommendedColorPalette } from './recommend';

/**
 * 根据提供的颜色获取颜色调色板
 *
 * @param color 提供的颜色
 * @param recommended 是否获取推荐的颜色调色板（提供的颜色可能不是主色）
 */
export function getColorPalette(color: AnyColor, recommended = false) {
  const colorMap = new Map<ColorPaletteNumber, string>();

  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color));

    colorPalette.palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });
  } else {
    const colors = getAntDColorPalette(color);

    const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index]);
    });
  }

  return colorMap;
}

/**
 * 根据数字获取颜色调色板中的颜色
 *
 * @param color 提供的颜色
 * @param number 颜色调色板的数字
 * @param recommended 是否获取推荐的颜色调色板（提供的颜色可能不是主色）
 */
export function getPaletteColorByNumber(color: AnyColor, number: ColorPaletteNumber, recommended = false) {
  const colorMap = getColorPalette(color, recommended);

  return colorMap.get(number as ColorPaletteNumber)!;
}
