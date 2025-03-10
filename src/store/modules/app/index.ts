import { SetupStoreId } from '@/enum'

import { localStg } from '@/utils'

import { useBoolean } from '@sa/hooks'

import {
  breakpointsTailwind,
  useBreakpoints,
  useEventListener,
} from '@vueuse/core'

import { defineStore } from 'pinia'

import {
  effectScope,
  nextTick,
  onScopeDispose,
  watch,
} from 'vue'

import { useRouteStore } from '../route'

import { useThemeStore } from '../theme'

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const themeStore = useThemeStore()

  const routeStore = useRouteStore()

  const scope = effectScope()

  const breakpoints = useBreakpoints(breakpointsTailwind)

  const {
    bool: themeDrawerVisible,
    setTrue: openThemeDrawer,
    setFalse: closeThemeDrawer,
  } = useBoolean()

  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true)

  const { bool: fullContent, toggle: toggleFullContent } = useBoolean()

  const { bool: contentXScrollable, setBool: setContentXScrollable }
    = useBoolean()

  const {
    bool: siderCollapse,
    setBool: setSiderCollapse,
    toggle: toggleSiderCollapse,
  } = useBoolean()

  const {
    bool: mixSiderFixed,
    setBool: setMixSiderFixed,
    toggle: toggleMixSiderFixed,
  } = useBoolean(localStg.get('mixSiderFixed') === 'Y')

  /** 是否为移动布局 */
  const isMobile = breakpoints.smaller('sm')

  /**
   * 重新加载页面
   *
   * @param {number} duration 持续时间
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false)

    const d = themeStore.page.animate ? duration : 40

    await new Promise((resolve) => {
      setTimeout(resolve, d)
    })

    setReloadFlag(true)

    if (themeStore.resetCacheStrategy === 'refresh') {
      routeStore.resetRouteCache()
    }
  }

  /** 初始化 */
  function init() {}

  // 监听 store
  scope.run(() => {
    // 监听 isMobile，如果是移动设备，折叠菜单
    watch(
      isMobile,
      (newValue) => {
        if (newValue) {
          // 备份移动设备之前的主题设置
          localStg.set('backupThemeSettingBeforeIsMobile', {
            layout: themeStore.layout.mode,
            siderCollapse: siderCollapse.value,
          })

          themeStore.setThemeLayout('vertical')
          setSiderCollapse(true)
        }
        else {
          // 如果不是移动设备，恢复备份的主题设置
          const backup = localStg.get('backupThemeSettingBeforeIsMobile')

          if (backup) {
            nextTick(() => {
              themeStore.setThemeLayout(backup.layout)
              setSiderCollapse(backup.siderCollapse)

              localStg.remove('backupThemeSettingBeforeIsMobile')
            })
          }
        }
      },
      {
        immediate: true,
      },
    )
  })

  // 缓存 mixSiderFixed
  useEventListener(window, 'beforeunload', () => {
    localStg.set('mixSiderFixed', mixSiderFixed.value ? 'Y' : 'N')
  })

  /** 作用域销毁时的处理 */
  onScopeDispose(() => {
    scope.stop()
  })

  // 初始化
  init()

  return {
    isMobile,
    reloadFlag,
    reloadPage,
    fullContent,
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    toggleFullContent,
    contentXScrollable,
    setContentXScrollable,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    mixSiderFixed,
    setMixSiderFixed,
    toggleMixSiderFixed,
  }
})
