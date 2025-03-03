import { h } from 'vue';
import type { Component, VNode } from 'vue';

/** 图标配置类型定义 */
type IconConfig = {
  /** Iconify 图标名称 */
  icon?: string;
  /** 本地图标名称 */
  localIcon?: string;
  /** 图标颜色 */
  color?: string;
  /** 图标大小 */
  fontSize?: number;
};

/**
 * Svg 图标渲染 hook
 *
 * @param SvgIcon Svg 图标组件
 * @returns 包含 Svg 图标 VNode 渲染函数的对象
 */
export default function useSvgIconRender(SvgIcon: Component): {
  SvgIconVNode: (config: IconConfig) => (() => VNode | undefined) | undefined;
} {
  /** 图标样式类型定义 */
  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>;

  /**
   * Svg 图标 VNode
   *
   * @param config 图标配置
   * @returns 返回一个函数，该函数返回渲染的 VNode 或 undefined
   */
  const SvgIconVNode = (config: IconConfig): (() => VNode | undefined) | undefined => {
    const { color, fontSize, icon, localIcon } = config;

    const style: IconStyle = {};

    // 设置图标颜色
    if (color) {
      style.color = color;
    }

    // 设置图标大小
    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }

    // 如果没有提供图标名称或本地图标名称，则返回 undefined
    if (!icon && !localIcon) {
      return undefined;
    }

    // 返回渲染的 Svg 图标 VNode
    return () => h(SvgIcon, { icon, localIcon, style });
  };

  return {
    SvgIconVNode
  };
}
