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

const themeStore = useThemeStore()

const domRef = ref<HTMLElement | null>(null)

function initClipboard() {
  if (!domRef.value) {
    return
  }

  const clipboard = new Clipboard(domRef.value)

  clipboard.on('success', () => {
    window.$message?.success('复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings')
  })
}

function getClipboardText() {
  const reg = /"\w+":/g

  const json = themeStore.settingsJson

  return json.replace(reg, match => match.replace(/"/g, ''))
}

function handleReset() {
  themeStore.resetStore()

  setTimeout(() => {
    window.$message?.success('重置成功')
  }, 50)
}

const dataClipboardText = computed(() => getClipboardText())

onMounted(() => {
  initClipboard()
})
</script>

<template>
  <div
    class="w-full flex justify-between"
  >
    <textarea
      id="themeConfigCopyTarget"
      v-model="dataClipboardText"
      class="absolute opacity-0 -z-1"
    />

    <ElButton
      type="danger"
      plain
      @click="handleReset"
    >
      {{ '重置配置' }}
    </ElButton>

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
