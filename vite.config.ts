import process from 'node:process'

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import { createViteProxy, getBuildTime } from './build/config'

import { setupVitePlugins } from './build/plugins'

export default defineConfig((configEnv) => {
  // 加载环境变量
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta

  /** 获取构建时间 */
  const buildTime = getBuildTime()

  /** 判断是否启用代理（仅在开发环境且非预览模式下启用） */
  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview

  return {
    /** 项目根路径 */
    base: viteEnv.VITE_BASE_URL,

    /** 路径别名 */
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    /** CSS 预处理器选项 */
    css: {
      // 预处理器选项
      preprocessorOptions: {
        scss: {
          // 全局引入 SCSS 变量
          api: 'modern-compiler',

          // 全局引入 SCSS 文件
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
        },
      },
    },

    /** Vite插件数组 */
    plugins: setupVitePlugins(viteEnv, buildTime),

    /** 定义全局常量替换方式 */
    define: {
      // 定义构建时间变量
      BUILD_TIME: JSON.stringify(buildTime),
    },

    /** 开发服务器选项 */
    server: {
      /** 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址 */
      host: '0.0.0.0',

      /** 指定开发服务器端口 */
      port: 9527,

      /** 自动打开浏览器 */
      open: true,

      /** 为开发服务器配置自定义代理规则 */
      proxy: createViteProxy(viteEnv, enableProxy),
    },

    /** 预览选项 */
    preview: {
      /** 指定开发服务器端口 */
      port: 9725,
    },

    /** 构建选项 */
    build: {
      /** 启用/禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,

      /** 构建后是否生成 source map 文件 */
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',

      /** 传递给 @rollup/plugin-commonjs 插件的选项。 */
      commonjsOptions: {
        // 允许 CommonJS 代码中的 try-catch
        ignoreTryCatch: false,
      },
    },
  }
})
