import { defineConfig } from '@unocss/vite';

import transformerDirectives from '@unocss/transformer-directives';

import transformerVariantGroup from '@unocss/transformer-variant-group';

import presetUno from '@unocss/preset-uno';

import type { Theme } from '@unocss/preset-uno';

import { presetSoybeanAdmin } from '@sa/uno-preset';

import { themeVars } from './src/theme/vars';

export default defineConfig<Theme>({
  content: {
    pipeline: {
      /** 设置 UnoCSS 处理的文件范围，排除 node_modules 和 dist 目录，提高构建性能 */
      exclude: ['node_modules', 'dist']
    }
  },
  theme: {
    ...themeVars,
    /** 自定义字体大小 */
    fontSize: {
      'icon-xs': '0.875rem', // 超小图标大小（14px）
      'icon-small': '1rem', // 小图标大小（16px）
      icon: '1.125rem', // 默认图标大小（18px）
      'icon-large': '1.5rem', // 大图标大小（24px）
      'icon-xl': '2rem' // 超大图标大小（32px）
    }
  },
  /** 自定义 UnoCSS 快捷类 */
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm'
  },
  transformers: [
    /** 启用 @apply 及其他 UnoCSS 指令支持 */
    transformerDirectives(),
    /** 启用 UnoCSS 变体支持 例如 hover:(text-red bg-blue) */
    transformerVariantGroup()
  ],
  presets: [
    /** 使用 UnoCSS 默认预设，并设置深色模式为 `class` */
    presetUno({ dark: 'class' }),
    /** 加载 SoybeanAdmin 预设，提供额外的 UI 组件样式 */
    presetSoybeanAdmin()
  ]
});
