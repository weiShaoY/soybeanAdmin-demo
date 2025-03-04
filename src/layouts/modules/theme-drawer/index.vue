<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

import ConfigOperation from './modules/config-operation.vue'

import DarkMode from './modules/dark-mode.vue'

import LayoutMode from './modules/layout-mode.vue'

import PageFun from './modules/page-fun.vue'

import ThemeColor from './modules/theme-color.vue'

defineOptions({
  name: 'ThemeDrawer',
})

const appStore = useAppStore()
</script>

<template>
  <ElDrawer
    v-model="appStore.themeDrawerVisible"
    title="主题配置"
    :size="360"
  >
    <DarkMode />

    <LayoutMode />

    <ThemeColor />

    <PageFun />

    <template
      #footer
    >
      <ConfigOperation />
    </template>
  </ElDrawer>
</template>

<style scoped></style>
