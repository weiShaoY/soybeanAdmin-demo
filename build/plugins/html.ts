import type { Plugin } from 'vite'

/**
 * 生成 Vite 插件，在构建时向 HTML 添加 `buildTime` 元数据
 *
 * @param buildTime 构建时间，格式如 "2025-03-02 12:34:56"
 * @returns Vite 插件对象
 */
export function setupHtmlPlugin(buildTime: string) {
  const plugin: Plugin = {
    /** 插件名称，在 Vite 插件系统中用于标识此插件 */
    name: 'html-plugin',

    /**
     * 插件适用的构建阶段
     *
     * - 'build': 仅在构建生产环境时生效
     * - 'serve': 仅在开发模式下生效
     */
    apply: 'build',

    /**
     * 处理 HTML 文件，在 `<head>` 标签中插入 `buildTime` 元数据
     *
     * @param html 原始 HTML 内容
     * @returns 处理后的 HTML 内容
     */
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`)
    },
  }

  return plugin
}
