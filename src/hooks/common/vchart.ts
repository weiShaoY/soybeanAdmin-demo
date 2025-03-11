import type { ISpec, ITheme } from '@visactor/vchart'

import { useThemeStore } from '@/store/modules/theme'

import VChart, { registerLiquidChart } from '@visactor/vchart'

import dark from '@visactor/vchart-theme/public/dark.json'

import light from '@visactor/vchart-theme/public/light.json'

import { useElementSize } from '@vueuse/core'

import {
  computed,
  effectScope,
  onScopeDispose,
  ref,
  watch,
} from 'vue'

registerLiquidChart()

// 注册主题
VChart.ThemeManager.registerTheme('light', light as ITheme)
VChart.ThemeManager.registerTheme('dark', dark as ITheme)

type ChartHooks = {

  /** 渲染图表时的钩子函数 */
  onRender?: (chart: VChart) => void | Promise<void>

  /** 更新图表时的钩子函数 */
  onUpdated?: (chart: VChart) => void | Promise<void>

  /** 销毁图表时的钩子函数 */
  onDestroy?: (chart: VChart) => void | Promise<void>
}

/**
 * 使用 VChart
 *
 * @template T VChart 配置类型
 * @param {() => T} specFactory VChart 配置工厂函数
 * @param {ChartHooks} [hooks] 图表钩子函数. Default is `{}`
 * @returns {{ domRef; updateSpec; setSpec }} 包含图表引用、更新配置和设置配置的方法
 */
export function useVChart<T extends ISpec>(specFactory: () => T, hooks: ChartHooks = {
}) {
  /** 作用域 */
  const scope = effectScope()

  /** 主题存储 */
  const themeStore = useThemeStore()

  /** 暗黑模式 */
  const darkMode = computed(() => themeStore.darkMode)

  /** 图表 DOM 引用 */
  const domRef = ref<HTMLElement | null>(null)

  /** 初始尺寸 */
  const initialSize = {
    width: 0,
    height: 0,
  }

  /** 使用元素尺寸 */
  const { width, height } = useElementSize(domRef, initialSize)

  let chart: VChart | null = null

  const spec: T = specFactory()

  const { onRender, onUpdated, onDestroy } = hooks

  /**
   * 是否可以渲染图表
   *
   * 当 domRef 准备好且 initialSize 有效时
   *
   * @returns 是否可以渲染图表
   */
  function canRender() {
    return domRef.value && initialSize.width > 0 && initialSize.height > 0
  }

  /**
   * 图表是否已渲染
   *
   * @returns {boolean} 图表是否已渲染
   */
  function isRendered(): boolean {
    return Boolean(domRef.value && chart)
  }

  /**
   * 更新图表配置
   *
   * @param {(opts: T, optsFactory: () => T) => ISpec} [callback] 回调函数. Default is `() => spec`
   * @returns {Promise<void>}
   */
  async function updateSpec(callback: (opts: T, optsFactory: () => T) => ISpec = () => spec): Promise<void> {
    if (!isRendered()) {
      return
    }

    const updatedOpts = callback(spec, specFactory)

    Object.assign(spec, updatedOpts)

    if (isRendered()) {
      chart?.release()
    }

    chart?.updateSpec({
      ...updatedOpts,
    }, true)

    await onUpdated?.(chart!)
  }

  /**
   * 设置图表配置
   *
   * @param {T} newSpec 新的图表配置
   */
  function setSpec(newSpec: T): void {
    chart?.updateSpec(newSpec)
  }

  /**
   * 渲染图表
   *
   * @returns {Promise<void>}
   */
  async function render(): Promise<void> {
    if (!isRendered()) {
      // 应用主题
      if (darkMode.value) {
        VChart.ThemeManager.setCurrentTheme('dark')
      }
      else {
        VChart.ThemeManager.setCurrentTheme('light')
      }

      chart = new VChart(spec, {
        dom: domRef.value as HTMLElement,
      })
      chart.renderSync()

      await onRender?.(chart)
    }
  }

  /** 调整图表大小 */
  function resize(): void {
    // chart?.resize();
  }

  /**
   * 销毁图表
   *
   * @returns {Promise<void>}
   */
  async function destroy(): Promise<void> {
    if (!chart) {
      return
    }

    await onDestroy?.(chart)
    chart?.release()
    chart = null
  }

  /**
   * 更改图表主题
   *
   * @returns {Promise<void>}
   */
  async function changeTheme(): Promise<void> {
    await destroy()
    await render()
    await onUpdated?.(chart!)
  }

  /**
   * 根据尺寸渲染图表
   *
   * @param {number} w 宽度
   * @param {number} h 高度
   * @returns {Promise<void>}
   */
  async function renderChartBySize(w: number, h: number): Promise<void> {
    initialSize.width = w
    initialSize.height = h

    // 尺寸异常，销毁图表
    if (!canRender()) {
      await destroy()

      return
    }

    // 调整图表大小
    if (isRendered()) {
      resize()
    }

    // 渲染图表
    await render()
  }

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      renderChartBySize(newWidth, newHeight)
    })

    watch(darkMode, () => {
      changeTheme()
    })
  })

  onScopeDispose(() => {
    destroy()
    scope.stop()
  })

  return {
    domRef,
    updateSpec,
    setSpec,
  }
}
