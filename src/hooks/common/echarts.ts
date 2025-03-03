import { computed, effectScope, nextTick, onScopeDispose, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, GaugeChart, LineChart, PictorialBarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts';
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption
} from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useElementSize } from '@vueuse/core';
import { useThemeStore } from '@/store/modules/theme';

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | PictorialBarSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

type ChartHooks = {
  /** 渲染图表时的钩子函数 */
  onRender?: (chart: echarts.ECharts) => void | Promise<void>;
  /** 更新图表时的钩子函数 */
  onUpdated?: (chart: echarts.ECharts) => void | Promise<void>;
  /** 销毁图表时的钩子函数 */
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>;
};

/**
 * 使用 ECharts
 *
 * @param optionsFactory ECharts 配置工厂函数
 * @param hooks 图表钩子函数
 */
export function useEcharts<T extends ECOption>(optionsFactory: () => T, hooks: ChartHooks = {}) {
  const scope = effectScope();

  const themeStore = useThemeStore();
  const darkMode = computed(() => themeStore.darkMode);

  const domRef = ref<HTMLElement | null>(null);
  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  let chart: echarts.ECharts | null = null;
  const chartOptions: T = optionsFactory();

  const {
    onRender = instance => {
      const textColor = darkMode.value ? 'rgb(224, 224, 224)' : 'rgb(31, 31, 31)';
      const maskColor = darkMode.value ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';

      instance.showLoading({
        color: themeStore.themeColor,
        textColor,
        fontSize: 14,
        maskColor
      });
    },
    onUpdated = instance => {
      instance.hideLoading();
    },
    onDestroy
  } = hooks;

  /**
   * 是否可以渲染图表
   *
   * 当 domRef 准备好且 initialSize 有效时
   *
   * @returns 是否可以渲染图表
   */
  function canRender() {
    return domRef.value && initialSize.width > 0 && initialSize.height > 0;
  }

  /**
   * 图表是否已渲染
   *
   * @returns 图表是否已渲染
   */
  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  /**
   * 更新图表选项
   *
   * @param callback 回调函数. Default is `() => chartOptions`. Default is `() => chartOptions`
   */
  async function updateOptions(callback: (opts: T, optsFactory: () => T) => ECOption = () => chartOptions) {
    if (!isRendered()) return;

    const updatedOpts = callback(chartOptions, optionsFactory);

    Object.assign(chartOptions, updatedOpts);

    if (isRendered()) {
      chart?.clear();
    }

    chart?.setOption({ ...updatedOpts, backgroundColor: 'transparent' });

    await onUpdated?.(chart!);
  }

  /**
   * 设置图表选项
   *
   * @param {T} options 图表选项
   */
  function setOptions(options: T) {
    chart?.setOption(options);
  }

  /** 渲染图表 */
  async function render() {
    if (!isRendered()) {
      const chartTheme = darkMode.value ? 'dark' : 'light';

      await nextTick();

      chart = echarts.init(domRef.value, chartTheme);

      chart.setOption({ ...chartOptions, backgroundColor: 'transparent' });

      await onRender?.(chart);
    }
  }

  /** 调整图表大小 */
  function resize() {
    chart?.resize();
  }

  /** 销毁图表 */
  async function destroy() {
    if (!chart) return;

    await onDestroy?.(chart);
    chart?.dispose();
    chart = null;
  }

  /** 更改图表主题 */
  async function changeTheme() {
    await destroy();
    await render();
    await onUpdated?.(chart!);
  }

  /**
   * 根据尺寸渲染图表
   *
   * @param w 宽度
   * @param h 高度
   */
  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w;
    initialSize.height = h;

    // 尺寸异常，销毁图表
    if (!canRender()) {
      await destroy();

      return;
    }

    // 调整图表大小
    if (isRendered()) {
      resize();
    }

    // 渲染图表
    await render();
  }

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      renderChartBySize(newWidth, newHeight);
    });

    watch(darkMode, () => {
      changeTheme();
    });
  });

  onScopeDispose(() => {
    destroy();
    scope.stop();
  });

  return {
    domRef,
    updateOptions,
    setOptions
  };
}
