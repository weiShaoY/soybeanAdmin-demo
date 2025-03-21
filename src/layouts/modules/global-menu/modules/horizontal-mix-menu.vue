<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { useRouter } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import FirstLevelMenu from '../components/first-level-menu.vue'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'HorizontalMixMenu',
})

const router = useRouter()

const appStore = useAppStore()

const themeStore = useThemeStore()

const { allMenus, childLevelMenus, activeFirstLevelMenuKey, setActiveFirstLevelMenuKey } = useMixMenuContext()

const { selectedKey } = useMenu()

/**
 * 处理选择混合菜单事件
 * @param menu 菜单项
 */
function handleSelectMixMenu(menu: App.Global.Menu) {
  setActiveFirstLevelMenuKey(menu.key)

  if (!menu.children?.length) {
    getSelectedKey(menu.routeKey)
  }
}

function getSelectedKey(value: string) {
  router.push(value)
}
</script>

<template>
  <!-- 将菜单传送到全局头部菜单 -->
  <Teleport
    :to="`#${GLOBAL_HEADER_MENU_ID}`"
  >
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="selectedKey"
      @select="val => getSelectedKey(val as RouteKey)"
    >
      <!-- 渲染子级菜单项 -->
      <MenuItem
        v-for="item in childLevelMenus"
        :key="item.routePath"
        :item="item"
        :index="item.routePath"
      />
    </ElMenu>
  </Teleport>

  <!-- 将一级菜单传送到全局侧边菜单 -->
  <Teleport
    :to="`#${GLOBAL_SIDER_MENU_ID}`"
  >
    <FirstLevelMenu
      :menus="allMenus"
      :active-menu-key="activeFirstLevelMenuKey"
      :sider-collapse="appStore.isSiderCollapse"
      :dark-mode="themeStore.darkMode"
      :theme-color="themeStore.themeColor"
      @select="handleSelectMixMenu"
      @toggle-sider-collapse="appStore.toggleSiderCollapse"
    />
  </Teleport>
</template>

<style scoped></style>
