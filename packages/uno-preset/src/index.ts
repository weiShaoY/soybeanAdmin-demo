// @unocss-include

import type { Preset } from '@unocss/core';
import type { Theme } from '@unocss/preset-uno';

/**
 * Soybean Admin 预设
 *
 * @returns {Preset<Theme>} 返回一个包含 Soybean Admin 预设的对象
 */
export function presetSoybeanAdmin(): Preset<Theme> {
  const preset: Preset<Theme> = {
    name: 'preset-soybean-admin',
    shortcuts: [
      {
        /** 水平居中和垂直居中 */
        'flex-center': 'flex justify-center items-center',
        /** 水平居中 */
        'flex-x-center': 'flex justify-center',
        /** 垂直居中 */
        'flex-y-center': 'flex items-center',
        /** 垂直方向的 Flex 布局 */
        'flex-col': 'flex flex-col',
        /** 垂直方向的 Flex 布局并水平垂直居中 */
        'flex-col-center': 'flex-center flex-col',
        /** 垂直方向的 Flex 布局并拉伸 */
        'flex-col-stretch': 'flex-col items-stretch',
        /** 水平居中和垂直居中的 Inline Flex 布局 */
        'i-flex-center': 'inline-flex justify-center items-center',
        /** 水平居中的 Inline Flex 布局 */
        'i-flex-x-center': 'inline-flex justify-center',
        /** 垂直居中的 Inline Flex 布局 */
        'i-flex-y-center': 'inline-flex items-center',
        /** 垂直方向的 Inline Flex 布局 */
        'i-flex-col': 'flex-col inline-flex',
        /** 垂直方向的 Inline Flex 布局并水平垂直居中 */
        'i-flex-col-center': 'flex-col i-flex-center',
        /** 垂直方向的 Inline Flex 布局并拉伸 */
        'i-flex-col-stretch': 'i-flex-col items-stretch',
        /** Flex 布局并隐藏溢出 */
        'flex-1-hidden': 'flex-1 overflow-hidden'
      },
      {
        /** 左上角绝对定位 */
        'absolute-lt': 'absolute left-0 top-0',
        /** 左下角绝对定位 */
        'absolute-lb': 'absolute left-0 bottom-0',
        /** 右上角绝对定位 */
        'absolute-rt': 'absolute right-0 top-0',
        /** 右下角绝对定位 */
        'absolute-rb': 'absolute right-0 bottom-0',
        /** 左上角绝对定位（别名） */
        'absolute-tl': 'absolute-lt',
        /** 右上角绝对定位（别名） */
        'absolute-tr': 'absolute-rt',
        /** 左下角绝对定位（别名） */
        'absolute-bl': 'absolute-lb',
        /** 右下角绝对定位（别名） */
        'absolute-br': 'absolute-rb',
        /** 绝对定位居中 */
        'absolute-center': 'absolute-lt flex-center size-full',
        /** 左上角固定定位 */
        'fixed-lt': 'fixed left-0 top-0',
        /** 左下角固定定位 */
        'fixed-lb': 'fixed left-0 bottom-0',
        /** 右上角固定定位 */
        'fixed-rt': 'fixed right-0 top-0',
        /** 右下角固定定位 */
        'fixed-rb': 'fixed right-0 bottom-0',
        /** 左上角固定定位（别名） */
        'fixed-tl': 'fixed-lt',
        /** 右上角固定定位（别名） */
        'fixed-tr': 'fixed-rt',
        /** 左下角固定定位（别名） */
        'fixed-bl': 'fixed-lb',
        /** 右下角固定定位（别名） */
        'fixed-br': 'fixed-rb',
        /** 固定定位居中 */
        'fixed-center': 'fixed-lt flex-center size-full'
      },
      {
        /** 溢出隐藏并保持单行 */
        'nowrap-hidden': 'overflow-hidden whitespace-nowrap',
        /** 溢出隐藏并显示省略号 */
        'ellipsis-text': 'nowrap-hidden text-ellipsis'
      }
    ]
  };

  return preset;
}

export default presetSoybeanAdmin;
