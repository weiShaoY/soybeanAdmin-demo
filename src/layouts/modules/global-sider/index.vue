<script setup lang="ts">
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { computed } from 'vue'

import GlobalLogo from '../global-logo/index.vue'

defineOptions({
  name: 'GlobalSider',
})

const appStore = useAppStore()

const themeStore = useThemeStore()

/**
 * 判断是否为垂直混合布局模式
 */
const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix')

/**
 * 判断是否为水平混合布局模式
 */
const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix')

/**
 * 计算是否启用暗色菜单模式
 */
const darkMenu = computed(() => !themeStore.darkMode && !isHorizontalMix.value && themeStore.sider.inverted)

/**
 * 计算是否显示 Logo
 */
const showLogo = computed(() => !isVerticalMix.value && !isHorizontalMix.value)

/**
 * 计算菜单容器的 CSS 类
 */
const menuWrapperClass = computed(() => (showLogo.value ? 'flex-1-hidden' : 'h-full'))
</script>

<template>
  <!-- 侧边栏容器，支持暗黑模式 -->
  <DarkModeContainer
    class="size-full flex-col-stretch shadow-sider"
    :inverted="darkMenu"
  >
    <!-- 全局 Logo，控制是否显示标题 -->
    <GlobalLogo
      v-if="showLogo"
      :show-title="!appStore.isSiderCollapse"
      :style="{ height: `${themeStore.header.height}px` }"
    />

    <!-- 侧边栏菜单容器 -->
    <div
      :id="GLOBAL_SIDER_MENU_ID"
      :class="menuWrapperClass"
    />
  </DarkModeContainer>
</template>

<style scoped></style>
