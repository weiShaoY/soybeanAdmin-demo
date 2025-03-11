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

/**
 * 应用全局状态管理
 */
export const useAppStore = defineStore(SetupStoreId.App, () => {
  const themeStore = useThemeStore()

  const routeStore = useRouteStore()

  const scope = effectScope()

  /** 断点管理（用于响应式布局） */
  const breakpoints = useBreakpoints(breakpointsTailwind)

  /** 是否打开主题抽屉 */
  const { bool: isOpenThemeDrawer, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean()

  /** 页面是否需要重新加载 */
  const { bool: isPageReload, setBool: setReloadFlag } = useBoolean(true)

  /** 是否全屏显示 */
  const { bool: isFullContent, toggle: toggleIsFullContent } = useBoolean()

  /** 内容区域是否允许横向滚动 */
  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean()

  /** 侧边栏折叠状态 */
  const { bool: isSiderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean()

  /** 是否固定混合菜单的侧边栏 */
  const { bool: mixSiderFixed, setBool: setMixSiderFixed, toggle: toggleMixSiderFixed } = useBoolean(
    localStg.get('mixSiderFixed') === 'Y',
  )

  /** 是否为移动布局 */
  const isMobile = breakpoints.smaller('sm')

  /**
   * 重新加载页面
   * @param duration 持续时间（毫秒）
   */
  async function triggerIsPageReload(duration = 300) {
    setReloadFlag(false)

    // 根据主题动画配置决定等待时间
    const delay = themeStore.page.animate ? duration : 40

    await new Promise(resolve => setTimeout(resolve, delay))

    setReloadFlag(true)

    // 根据缓存策略重置路由缓存
    if (themeStore.resetCacheStrategy === 'refresh') {
      routeStore.resetRouteCache()
    }
  }

  /** 监听 store 变化 */
  scope.run(() => {
    watch(
      isMobile,
      (newValue) => {
        if (newValue) {
          // 备份移动设备之前的主题设置
          localStg.set('backupThemeSettingBeforeIsMobile', {
            layout: themeStore.layout.mode,
            siderCollapse: isSiderCollapse.value,
          })

          themeStore.setThemeLayout('vertical')
          setSiderCollapse(true)
        }
        else {
          // 还原备份的主题设置
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

  /** 在页面关闭时缓存 mixSiderFixed 状态 */
  useEventListener(window, 'beforeunload', () => {
    localStg.set('mixSiderFixed', mixSiderFixed.value ? 'Y' : 'N')
  })

  /** 作用域销毁时的处理 */
  onScopeDispose(() => scope.stop())

  return {
    /** 是否为移动端布局 */
    isMobile,

    /** 是否重新加载页面 */
    isPageReload,

    /** 重新加载页面 */
    triggerIsPageReload,

    /** 是否全屏显示 */
    isFullContent,

    /** 切换全屏显示 */
    toggleIsFullContent,

    /** 是否打开主题抽屉 */
    isOpenThemeDrawer,

    /** 打开主题抽屉 */
    openThemeDrawer,

    /** 关闭主题抽屉 */
    closeThemeDrawer,

    /** 是否允许内容区域横向滚动 */
    contentXScrollable,

    /** 设置内容区域横向滚动 */
    setContentXScrollable,

    /** 侧边栏折叠状态 */
    isSiderCollapse,

    /** 设置侧边栏折叠状态 */
    setSiderCollapse,

    /** 切换侧边栏折叠状态 */
    toggleSiderCollapse,

    /** 是否固定混合侧边栏 */
    mixSiderFixed,

    /** 设置混合侧边栏固定状态 */
    setMixSiderFixed,

    /** 切换混合侧边栏固定状态 */
    toggleMixSiderFixed,
  }
})
