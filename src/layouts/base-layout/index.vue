<script setup lang="ts">
import type { LayoutMode } from '@sa/materials'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { AdminLayout, LAYOUT_SCROLL_EL_ID } from '@sa/materials'

import { computed, defineAsyncComponent } from 'vue'

import { setupMixMenuContext } from '../context'

import GlobalContent from '../modules/global-content/index.vue'

import GlobalFooter from '../modules/global-footer/index.vue'

import GlobalHeader from '../modules/global-header/index.vue'

import GlobalSider from '../modules/global-sider/index.vue'

import GlobalTab from '../modules/global-tab/index.vue'

import ThemeDrawer from '../modules/theme-drawer/index.vue'

defineOptions({
  name: 'BaseLayout',
})

const appStore = useAppStore()

const themeStore = useThemeStore()

const { childLevelMenus, isActiveFirstLevelMenuHasChildren } = setupMixMenuContext()

const GlobalMenu = defineAsyncComponent(() => import('../modules/global-menu/index.vue'))

/**
 * 获取布局模式
 */
const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical'

  const horizontal: LayoutMode = 'horizontal'

  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal
})

/**
 * 获取头部属性配置
 */
const headerProps = computed(() => {
  const { mode, reverseHorizontalMix } = themeStore.layout

  const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
    'vertical': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true,
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false,
    },
    'horizontal': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false,
    },
    'horizontal-mix': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: reverseHorizontalMix && isActiveFirstLevelMenuHasChildren.value,
    },
  }

  return headerPropsConfig[mode]
})

/**
 * 判断侧边栏是否可见
 */
const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal')

/**
 * 判断是否为垂直混合模式
 */
const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix')

/**
 * 判断是否为水平混合模式
 */
const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix')

/**
 * 获取侧边栏宽度
 */
const siderWidth = computed(() => getSiderWidth())

/**
 * 获取侧边栏折叠宽度
 */
const siderCollapsedWidth = computed(() => getSiderCollapsedWidth())

/**
 * 计算侧边栏宽度
 */
function getSiderWidth() {
  const { reverseHorizontalMix } = themeStore.layout

  const { width, mixWidth, mixChildMenuWidth } = themeStore.sider

  if (isHorizontalMix.value && reverseHorizontalMix) {
    return isActiveFirstLevelMenuHasChildren.value ? width : 0
  }

  let w = isVerticalMix.value || isHorizontalMix.value ? mixWidth : width

  if (isVerticalMix.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    w += mixChildMenuWidth
  }

  return w
}

/**
 * 计算侧边栏折叠宽度
 */
function getSiderCollapsedWidth() {
  const { reverseHorizontalMix } = themeStore.layout

  const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = themeStore.sider

  if (isHorizontalMix.value && reverseHorizontalMix) {
    return isActiveFirstLevelMenuHasChildren.value ? collapsedWidth : 0
  }

  let w = isVerticalMix.value || isHorizontalMix.value ? mixCollapsedWidth : collapsedWidth

  if (isVerticalMix.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    w += mixChildMenuWidth
  }

  return w
}
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.isSiderCollapse"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :is-full-content="appStore.isFullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :footer-height="themeStore.footer.height"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
  >
    <!-- 头部插槽 -->
    <template
      #header
    >
      <GlobalHeader
        v-bind="headerProps"
      />
    </template>

    <!-- 标签栏插槽 -->
    <template
      #tab
    >
      <GlobalTab />
    </template>

    <!-- 侧边栏插槽 -->
    <template
      #sider
    >
      <GlobalSider />
    </template>

    <!-- 菜单组件 -->
    <GlobalMenu />

    <!-- 内容组件 -->
    <GlobalContent />

    <!-- 主题抽屉组件 -->
    <ThemeDrawer />

    <!-- 底部插槽 -->
    <template
      #footer
    >
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar();
}
</style>
