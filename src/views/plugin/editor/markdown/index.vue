<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme'

import Vditor from 'vditor'

import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

import 'vditor/dist/index.css'

defineOptions({
  name: 'MarkdownPage',
})

const theme = useThemeStore()

const vditor = ref<Vditor>()

const domRef = ref<HTMLElement>()

function renderVditor() {
  if (!domRef.value) { return }

  vditor.value = new Vditor(domRef.value, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: {
      enable: false,
    },
  })
}

const stopHandle = watch(
  () => theme.darkMode,
  (newValue) => {
    const themeMode = newValue ? 'dark' : 'classic'

    vditor.value?.setTheme(themeMode)
  },
)

onMounted(() => {
  renderVditor()
})

onUnmounted(() => {
  stopHandle()
})
</script>

<template>
  <div
    class="h-full"
  >
    <ElCard
      header="markdown插件"
      class="card-wrapper"
    >
      <div
        ref="domRef"
      />

      <template
        #footer
      >
        <GithubLink
          link="https://github.com/Vanessa219/vditor"
        />
      </template>
    </ElCard>
  </div>
</template>

<style scoped></style>
