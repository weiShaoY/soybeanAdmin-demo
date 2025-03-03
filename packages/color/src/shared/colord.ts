import type { AnyColor, HslColor, RgbColor } from 'colord';

import { colord, extend } from 'colord';

import labPlugin from 'colord/plugins/lab';

import mixPlugin from 'colord/plugins/mix';

import namesPlugin from 'colord/plugins/names';

extend([namesPlugin, mixPlugin, labPlugin]);

/**
 * 判断颜色是否有效
 *
 * @param color 颜色
 * @returns 是否有效的颜色
 */
export function isValidColor(color: AnyColor) {
  return colord(color).isValid();
}

/**
 * 获取颜色的HEX值
 *
 * @param color 颜色
 * @returns 颜色的HEX值
 */
export function getHex(color: AnyColor) {
  return colord(color).toHex();
}

/**
 * 获取颜色的RGB值
 *
 * @param color 颜色
 * @returns 颜色的RGB值
 */
export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

/**
 * 获取颜色的HSL值
 *
 * @param color 颜色
 * @returns 颜色的HSL值
 */
export function getHsl(color: AnyColor) {
  return colord(color).toHsl();
}

/**
 * 获取颜色的HSV值
 *
 * @param color 颜色
 * @returns 颜色的HSV值
 */
export function getHsv(color: AnyColor) {
  return colord(color).toHsv();
}

/**
 * 计算两个颜色之间的Delta E值
 *
 * @param color1 颜色1
 * @param color2 颜色2
 * @returns 两个颜色之间的Delta E值
 */
export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2);
}

/**
 * 将HSL颜色转换为HEX颜色
 *
 * @param color HSL颜色
 * @returns HEX颜色
 */
export function transformHslToHex(color: HslColor) {
  return colord(color).toHex();
}

/**
 * 添加透明度到颜色
 *
 * @param color 颜色
 * @param alpha 透明度 (0 - 1)
 * @returns 带有透明度的HEX颜色
 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/**
 * 混合两种颜色
 *
 * @param firstColor 第一种颜色
 * @param secondColor 第二种颜色
 * @param ratio 第二种颜色的比例 (0 - 1)
 * @returns 混合后的HEX颜色
 */
export function mixColor(firstColor: AnyColor, secondColor: AnyColor, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/**
 * 将带透明度的颜色转换为不带透明度的相似颜色
 *
 * @param color 颜色
 * @param alpha 透明度 (0 - 1)
 * @param bgColor 背景颜色（通常为白色或黑色）
 * @returns 转换后的HEX颜色
 */
export function transformColorWithOpacity(color: AnyColor, alpha: number, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha);

  const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();

  const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();

  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al;
  }

  const resultRgb: RgbColor = {
    r: calRgb(oR, bgR, alpha),
    g: calRgb(oG, bgG, alpha),
    b: calRgb(oB, bgB, alpha)
  };

  return colord(resultRgb).toHex();
}

/**
 * 判断颜色是否为白色
 *
 * @param color 颜色
 * @returns 是否为白色
 */
export function isWhiteColor(color: AnyColor) {
  return colord(color).isEqual('#ffffff');
}

export { colord };
