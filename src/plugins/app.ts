import type { App } from 'vue'

import { ElButton } from 'element-plus'

import { h } from 'vue'

/**
 * 设置 Vue 应用的全局错误处理程序
 *
 * @param app Vue 应用实例
 */
export function setupAppErrorHandle(app: App) {
  app.config.errorHandler = (err, vm, info) => {
    console.error(err, vm, info)
  }
}

/** 监听应用版本更新，并在有新版本时通知用户 */
export function setupAppVersionNotification() {
  /** 更新检查间隔（毫秒） */
  const UPDATE_CHECK_INTERVAL = 3 * 60 * 1000

  /** 是否允许自动检测更新 */
  const canAutoUpdateApp = import.meta.env.VITE_AUTOMATICALLY_DETECT_UPDATE === 'Y' && import.meta.env.PROD

  if (!canAutoUpdateApp) {
    return
  }

  let isShow = false

  let updateInterval: ReturnType<typeof setInterval> | undefined

  /** 检查是否有新的构建版本 */
  const checkForUpdates = async () => {
    if (isShow) {
      return
    }

    const buildTime = await getHtmlBuildTime()

    // 如果构建时间未变化，则无需更新
    if (buildTime === BUILD_TIME) {
      return
    }

    isShow = true

    /** 显示更新通知 */
    const n = window.$notification!({
      title: '系统版本更新通知',
      message: h('div', {
      }, [
        h('p', {
        }, '检测到系统有新版本发布，是否立即刷新页面？'),
        h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'end',
              gap: '12px',
            },
          },
          [
            h(
              ElButton,
              {
                onClick() {
                  n?.close()
                },
              },
              () => '稍后再说',
            ),
            h(
              ElButton,
              {
                type: 'primary',
                onClick() {
                  location.reload()
                },
              },
              () => '立即刷新',
            ),
          ],
        ),
      ]),
    })
  }

  /** 开始定期检查更新 */
  const startUpdateInterval = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
    }

    updateInterval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL)
  }

  // 如果当前页面可见，则设置监听并启动更新检查
  if (!isShow && document.visibilityState === 'visible') {
    // 当文档可见时检查更新
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates()
        startUpdateInterval()
      }
    })

    // 启动更新间隔
    startUpdateInterval()
  }
}

/**
 * 获取 `index.html` 中的构建时间
 *
 * @returns 返回构建时间字符串，如果获取失败则返回空字符串
 */
async function getHtmlBuildTime() {
  const baseUrl = import.meta.env.VITE_BASE_URL || '/'

  const res = await fetch(`${baseUrl}index.html?time=${Date.now()}`)

  const html = await res.text()

  const match = html.match(/<meta name="buildTime" content="(.*)">/)

  const buildTime = match?.[1] || ''

  return buildTime
}
