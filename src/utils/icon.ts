/**
 * 获取本地 SVG 图标
 *
 * @returns {string[]} SVG 图标名称数组
 */
export function getLocalIcons(): string[] {
  /** 导入所有 SVG 图标 */
  const svgIcons = import.meta.glob('/src/assets/svg-icon/*.svg');

  /** 获取并处理图标名称 */
  const keys = Object.keys(svgIcons)
    .map(item => item.split('/').at(-1)?.replace('.svg', '') || '')
    .filter(Boolean);

  return keys;
}
