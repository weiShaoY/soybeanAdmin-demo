<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { useFullscreen } from '@vueuse/core'

import GlobalBreadcrumb from '../global-breadcrumb/index.vue'

import GlobalLogo from '../global-logo/index.vue'

import GlobalSearch from '../global-search/index.vue'

import ThemeButton from './components/theme-button.vue'

defineOptions({
  name: 'GlobalHeader',
})

defineProps<Props>()

type Props = {

  /**
   *  是否显示 Logo
   */
  showLogo?: App.Global.HeaderProps['showLogo']

  /**
   *  是否显示菜单切换按钮
   */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler']

  /**
   *  是否显示菜单
   */
  showMenu?: App.Global.HeaderProps['showMenu']
}

const appStore = useAppStore()

const themeStore = useThemeStore()

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <DarkModeContainer
    class="h-full flex-y-center px-[12px] shadow-header"
  >
    <!-- 全局Logo -->
    <GlobalLogo
      v-if="showLogo"
      class="h-full"
      :style="{ width: `${themeStore.sider.width}px` }"
    />

    <!-- 菜单切换按钮 -->
    <MenuToggler
      v-if="showMenuToggler"
      :collapsed="appStore.siderCollapse"
      @click="appStore.toggleSiderCollapse"
    />

    <!-- 菜单 -->
    <div
      v-if="showMenu"
      :id="GLOBAL_HEADER_MENU_ID"
      class="h-full flex-y-center flex-1-hidden"
    />

    <!-- 面包屑导航 -->
    <div
      v-else
      class="h-full flex-y-center flex-1-hidden"
    >
      <GlobalBreadcrumb
        v-if="!appStore.isMobile"
        class="ml-[12px]"
      />
    </div>

    <!-- 右侧操作区 -->
    <div
      class="h-full flex-y-center justify-end"
    >
      <GlobalSearch />

      <!-- 全屏按钮 -->
      <div>
        <FullScreen
          v-if="!appStore.isMobile"
          :full="isFullscreen"
          @click="toggle"
        />
      </div>

      <!-- 主题色切换按钮 -->
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleThemeScheme"
      />

      <!-- 主题按钮 -->
      <div>
        <ThemeButton />
      </div>
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
