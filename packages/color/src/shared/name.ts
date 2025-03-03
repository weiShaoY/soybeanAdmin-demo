import { colorNames } from '../constant';

import { getHex, getHsl, getRgb } from './colord';

/**
 * 获取颜色名称
 *
 * @param color 颜色值
 * @returns 颜色名称
 */
export function getColorName(color: string) {
  const hex = getHex(color); // 获取颜色的HEX值

  const rgb = getRgb(color); // 获取颜色的RGB值

  const hsl = getHsl(color); // 获取颜色的HSL值

  let ndf = 0; // 临时变量，存储颜色差值的计算结果

  let ndf1 = 0; // RGB颜色差值

  let ndf2 = 0; // HSL颜色差值

  let cl = -1; // 最接近的颜色名称索引

  let df = -1; // 最小的颜色差值

  let name = ''; // 最终的颜色名称

  // 遍历所有颜色名称
  colorNames.some((item, index) => {
    const [hexValue, colorName] = item; // 解构得到HEX值和颜色名称

    const match = hex === hexValue; // 判断HEX值是否匹配

    if (match) {
      name = colorName; // 如果匹配，直接返回颜色名称
    } else {
      // 如果不匹配，计算颜色的差异
      const { r, g, b } = getRgb(hexValue); // 获取当前颜色的RGB值

      const { h, s, l } = getHsl(hexValue); // 获取当前颜色的HSL值

      // 计算RGB和HSL差值的平方和
      ndf1 = (rgb.r - r) ** 2 + (rgb.g - g) ** 2 + (rgb.b - b) ** 2;
      ndf2 = (hsl.h - h) ** 2 + (hsl.s - s) ** 2 + (hsl.l - l) ** 2;

      // 总的颜色差值，RGB差值和HSL差值加权计算
      ndf = ndf1 + ndf2 * 2;

      // 判断是否是最接近的颜色
      if (df < 0 || df > ndf) {
        df = ndf; // 更新最小的颜色差值
        cl = index; // 更新最接近的颜色名称索引
      }
    }

    return match; // 如果找到匹配的颜色，返回true停止遍历
  });

  name = colorNames[cl][1]; // 获取最终的颜色名称

  return name; // 返回颜色名称
}
