<script setup lang="ts">
import type { Component } from 'vue'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { computed } from 'vue'

import HorizontalMenu from './modules/horizontal-menu.vue'

import HorizontalMixMenu from './modules/horizontal-mix-menu.vue'

import ReversedHorizontalMixMenu from './modules/reversed-horizontal-mix-menu.vue'

import VerticalMenu from './modules/vertical-menu.vue'

import VerticalMixMenu from './modules/vertical-mix-menu.vue'

defineOptions({
  name: 'GlobalMenu',
})

const appStore = useAppStore()

const themeStore = useThemeStore()

/**
 *  根据当前的布局模式动态选择菜单组件
 */
const activeMenu = computed(() => {
  const menuMap: Record<UnionKey.ThemeLayoutMode, Component> = {
    'vertical': VerticalMenu,
    'vertical-mix': VerticalMixMenu,
    'horizontal': HorizontalMenu,
    'horizontal-mix': themeStore.layout.reverseHorizontalMix ? ReversedHorizontalMixMenu : HorizontalMixMenu,
  }

  // 返回当前布局模式对应的菜单组件
  return menuMap[themeStore.layout.mode]
})

/**
 *  当布局为纵向且设备为移动端时，强制重新渲染菜单
 */
const reRenderVertical = computed(() => themeStore.layout.mode === 'vertical' && appStore.isMobile)
</script>

<template>
  <component
    :is="activeMenu"
    :key="reRenderVertical"
  />
</template>

<style scoped></style>
