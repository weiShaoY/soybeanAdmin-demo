<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme'

import Clipboard from 'clipboard'

import {
  computed,
  onMounted,
  ref,
} from 'vue'

defineOptions({
  name: 'ConfigOperation',
})

// 获取主题配置 store
const themeStore = useThemeStore()

// 创建 DOM 元素引用
const domRef = ref<HTMLElement | null>(null)

/**
 * 初始化剪贴板功能
 * 将目标元素与剪贴板绑定，复制成功后弹出提示信息
 */
function initClipboard() {
  if (!domRef.value) {
    return
  }

  const clipboard = new Clipboard(domRef.value)

  clipboard.on('success', () => {
    window.$message?.success('复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings')
  })
}

/**
 * 获取剪贴板的文本内容
 * 通过正则表达式处理 themeStore 中的 settingsJson
 */
function getClipboardText() {
  const reg = /"\w+":/g

  const json = themeStore.settingsJson

  return json.replace(reg, match => match.replace(/"/g, ''))
}

/**
 * 重置配置
 * 调用 store 中的重置方法，重置主题配置
 */
function handleReset() {
  themeStore.resetStore()

  setTimeout(() => {
    window.$message?.success('重置成功')
  }, 50)
}

/**
 *  计算属性，获取处理后的剪贴板文本内容
 */
const dataClipboardText = computed(() => getClipboardText())

// 组件挂载后初始化剪贴板功能
onMounted(() => {
  initClipboard()
})
</script>

<template>
  <div
    class="w-full flex justify-between"
  >
    <!-- 隐藏的文本区域，用于存储剪贴板内容 -->
    <textarea
      id="themeConfigCopyTarget"
      v-model="dataClipboardText"
      class="absolute opacity-0 -z-1"
    />

    <!-- 重置配置按钮 -->
    <ElButton
      type="danger"
      plain
      @click="handleReset"
    >
      {{ '重置配置' }}
    </ElButton>

    <!-- 复制配置按钮 -->
    <div
      ref="domRef"
      data-clipboard-target="#themeConfigCopyTarget"
    >
      <ElButton
        type="primary"
      >
        {{ '复制配置' }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped></style>
