<script setup lang="ts">
import type { WatermarkProps } from 'element-plus'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { computed } from 'vue'

import { useThemeStore } from './store/modules/theme'

// 组件名称
defineOptions({
  name: 'App',
})

/**
 * 获取主题状态管理
 */
const themeStore = useThemeStore()

/**
 * 计算水印属性
 */
const watermarkProps = computed<WatermarkProps>(() => {
  return {
    /** 设置水印内容，如果水印可见则显示对应文本，否则为空 */
    content: themeStore.watermark.visible ? themeStore.watermark.text || 'SoybeanAdmin' : '',

    /** 是否交叉显示水印 */
    cross: true,

    /** 字体大小 */
    fontSize: 16,

    /** 行高 */
    lineHeight: 16,

    /** 水印之间的间距 */
    gap: [100, 120],

    /** 旋转角度 */
    rotate: -15,

    /** 水印的层级 */
    zIndex: 9999,
  }
})

</script>

<template>
  <!-- 全局配置提供器，绑定当前语言 -->
  <ElConfigProvider
    :locale="zhCn"
  >
    <AppProvider>
      <!-- 水印组件，应用全局水印 -->
      <ElWatermark
        class="h-full"
        v-bind="watermarkProps"
      >
        <RouterView
          class="bg-layout"
        />
      </ElWatermark>
    </AppProvider>
  </ElConfigProvider>
</template>

<style scoped></style>
