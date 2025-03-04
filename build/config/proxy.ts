import type { HttpProxy, ProxyOptions } from 'vite'

import { createServiceConfig } from '../../src/utils/service'

import { clearScreen, createColors } from './cli-helper'

const colors = createColors()

/**
 * 配置 HTTP 代理
 *
 * @param env - 当前环境变量
 * @param enable - 是否启用 HTTP 代理
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  /** 判断是否启用 HTTP 代理 */
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y'

  if (!isEnableHttpProxy) { return undefined }

  // 获取服务配置，包括基础 URL、代理模式等
  const { baseURL, proxyPattern, other } = createServiceConfig(env)

  /** 代理配置 */
  const proxy: Record<string, ProxyOptions> = createProxyItem({
    baseURL,
    proxyPattern,
  })

  // 处理其他代理配置
  other.forEach((item) => {
    Object.assign(proxy, createProxyItem(item))
  })

  return proxy
}

/**
 * 创建代理项
 *
 * @param item - 服务配置项
 */
function createProxyItem(item: App.Service.ServiceConfigItem) {
  const proxy: Record<string, ProxyOptions> = {
  }

  proxy[item.proxyPattern] = {
    /** 代理目标 */
    target: item.baseURL,

    /** 是否更改请求源 */
    changeOrigin: true,

    /** 代理配置 */
    configure: (_proxy: HttpProxy.Server, options: ProxyOptions) => {
      _proxy.on('proxyReq', (_proxyReq, req, _res) => {
        clearScreen()

        // 打印代理请求信息

        console.log(colors.bgYellow(`  ${req.method}  `), colors.green(`${options.target}${req.url}`))
      })
      _proxy.on('error', (_err, req, _res) => {
        // 代理请求出错时打印错误信息

        console.log(colors.bgRed(`Error：${req.method}  `), colors.green(`${options.target}${req.url}`))
      })
    },

    /** 重写路径 */
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), ''),
  }

  return proxy
}
