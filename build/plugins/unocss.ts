import path from 'node:path'

import process from 'node:process'

import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

import presetIcons from '@unocss/preset-icons'

import unocss from '@unocss/vite'

/**
 * 配置 UnoCSS，支持图标加载
 *
 * @param {Env.ImportMeta} viteEnv - Vite 环境变量
 * @returns {ReturnType<typeof unocss>} UnoCSS 配置对象
 */
export function setupUnocss(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv

  /** 本地图标存放路径 */
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon')

  /** 本地图标集合名称 */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '')

  return unocss({
    /**
     * UnoCSS 预设配置
     *
     * 这里使用 `presetIcons` 以支持图标功能
     */
    presets: [
      presetIcons({
        /** 统一的图标前缀 例如：如果 `VITE_ICON_PREFIX` 是 `icon`, 则最终的类名形如 `icon-home` */
        prefix: `${VITE_ICON_PREFIX}-`,

        /** 图标默认缩放比例 1 表示原始大小， 调整此值可缩放图标大小 */
        scale: 1,

        /** 额外的 CSS 样式 这里确保图标内联显示，不影响行内布局 */
        extraProperties: {
          display: 'inline-block',
        },

        /** 图标集合 `collections` 允许定义多个图标库，这里添加自定义的本 */
        collections: {
          [collectionName]: FileSystemIconLoader(localIconPath, svg =>
            svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')),
        },

        /** 是否显示警告信息 */
        warn: true,
      }),
    ],
  })
}
