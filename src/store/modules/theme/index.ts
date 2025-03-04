import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { useEventListener, usePreferredColorScheme } from '@vueuse/core';
import { getPaletteColorByNumber } from '@sa/color';
import { SetupStoreId } from '@/enum';
import { localStg } from '@/utils/storage';
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getNaiveTheme,
  initThemeSettings,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode
} from './shared';

/** 主题存储 */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope();
  const osTheme = usePreferredColorScheme();

  /** 主题设置 */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings());

  /** 暗模式 */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark';
    }
    return settings.value.themeScheme === 'dark';
  });

  /** 灰度模式 */
  const grayscaleMode = computed(() => settings.value.grayscale);

  /** 色盲模式 */
  const colourWeaknessMode = computed(() => settings.value.colourWeakness);

  /** 主题颜色 */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value;
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info
    };
    console.log("%c Line:48 🥚 colors", "color:#6ec1c2", colors);
    return colors;
  });

  /** UI 主题 */
  const uiTheme = computed(() => getNaiveTheme(themeColors.value, settings.value.recommendColor));

  /**
   * 设置 JSON
   *
   * 用于复制设置
   */
  const settingsJson = computed(() => JSON.stringify(settings.value));

  /** 重置存储 */
  function resetStore() {
    const themeStore = useThemeStore();

    themeStore.$reset();
  }

  /**
   * 设置主题方案
   *
   * @param themeScheme 主题方案
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme;
  }

  /**
   * 设置灰度值
   *
   * @param isGrayscale 是否启用灰度模式
   */
  function setGrayscale(isGrayscale: boolean) {
    settings.value.grayscale = isGrayscale;
  }

  /**
   * 设置色盲值
   *
   * @param isColourWeakness 是否启用色盲模式
   */
  function setColourWeakness(isColourWeakness: boolean) {
    settings.value.colourWeakness = isColourWeakness;
  }

  /** 切换主题方案 */
  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto'];

    const index = themeSchemes.findIndex(item => item === settings.value.themeScheme);

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1;

    const nextThemeScheme = themeSchemes[nextIndex];

    setThemeScheme(nextThemeScheme);
  }

  /**
   * 更新主题颜色
   *
   * @param key 主题颜色键
   * @param color 主题颜色
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    let colorValue = color;

    if (settings.value.recommendColor) {
      // 根据提供的颜色和颜色名称获取调色板，并使用适当的颜色

      colorValue = getPaletteColorByNumber(color, 500, true);
    }

    if (key === 'primary') {
      settings.value.themeColor = colorValue;
    } else {
      settings.value.otherColor[key] = colorValue;
    }
  }

  /**
   * 设置主题布局
   *
   * @param mode 主题布局模式
   */
  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    settings.value.layout.mode = mode;
  }

  /** 设置主题变量到全局 */
  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(
      themeColors.value,
      settings.value.tokens,
      settings.value.recommendColor
    );
    addThemeVarsToGlobal(themeTokens, darkThemeTokens);
  }

  /**
   * 设置布局反转水平混合
   *
   * @param reverse 反转水平混合
   */
  function setLayoutReverseHorizontalMix(reverse: boolean) {
    settings.value.layout.reverseHorizontalMix = reverse;
  }

  /** 缓存主题设置 */
  function cacheThemeSettings() {
    const isProd = import.meta.env.PROD;

    if (!isProd) return;

    localStg.set('themeSettings', settings.value);
  }

  // 页面关闭或刷新时缓存主题设置
  useEventListener(window, 'beforeunload', () => {
    cacheThemeSettings();
  });

  // 监听存储
  scope.run(() => {
    // 监听暗模式
    watch(
      darkMode,
      val => {
        toggleCssDarkMode(val);
        localStg.set('darkMode', val);
      },
      { immediate: true }
    );

    watch(
      [grayscaleMode, colourWeaknessMode],
      val => {
        toggleAuxiliaryColorModes(val[0], val[1]);
      },
      { immediate: true }
    );

    // 主题颜色变化时，更新 CSS 变量并存储主题颜色
    watch(
      themeColors,
      val => {
        setupThemeVarsToGlobal();
        localStg.set('themeColor', val.primary);
      },
      { immediate: true }
    );
  });

  /** 在作用域销毁时 */
  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...toRefs(settings.value),
    darkMode,
    themeColors,
    uiTheme,
    settingsJson,
    setGrayscale,
    setColourWeakness,
    resetStore,
    setThemeScheme,
    toggleThemeScheme,
    updateThemeColors,
    setThemeLayout,
    setLayoutReverseHorizontalMix
  };
});
