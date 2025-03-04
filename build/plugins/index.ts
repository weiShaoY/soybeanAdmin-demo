import type { PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'

import progress from 'vite-plugin-progress'

import VueDevtools from 'vite-plugin-vue-devtools'

import { setupHtmlPlugin } from './html'

import { setupElegantRouter } from './router'

import { setupUnocss } from './unocss'

import { setupUnplugin } from './unplugin'

/**
 * 配置 Vite 插件
 *
 * @param viteEnv - 当前环境变量
 * @param buildTime - 构建时间
 * @returns 返回 Vite 插件数组
 */
export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugins: PluginOption = [
    // Vue 3 插件
    vue(),

    // Vue JSX 支持
    vueJsx(),

    // Vue 开发工具
    VueDevtools(),

    // 配置路由
    setupElegantRouter(),

    // 配置 UnoCSS
    setupUnocss(viteEnv),

    // 配置 Unplugin 相关插件
    ...setupUnplugin(viteEnv),

    // 构建进度条
    progress(),

    // 配置 HTML 相关插件
    setupHtmlPlugin(buildTime),
  ]

  return plugins
}
