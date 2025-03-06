import SvgIcon from '@/components/custom/svg-icon.vue'

import { useSvgIconRender } from '@sa/hooks'

/**
 * 使用 SVG 图标
 *
 * @returns 包含 SVG 图标 VNode 的对象
 */
export function useSvgIcon() {
  /**
   * 渲染 SVG 图标的 VNode
   */
  const { SvgIconVNode } = useSvgIconRender(SvgIcon)

  return {
    SvgIconVNode,
  }
}
