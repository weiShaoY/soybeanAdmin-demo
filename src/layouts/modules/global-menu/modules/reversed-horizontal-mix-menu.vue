<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useAppStore } from '@/store/modules/app'

import { SimpleScrollbar } from '@sa/materials'

import { ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'ReversedHorizontalMixMenu',
})

const route = useRoute()

const appStore = useAppStore()

const router = useRouter()

const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren,
} = useMixMenuContext()

const { selectedKey } = useMenu()

/**
 * 处理选择混合菜单事件
 * @param key 路由键
 */
function handleSelectMixMenu(key: RouteKey) {
  setActiveFirstLevelMenuKey(key)

  if (!isActiveFirstLevelMenuHasChildren.value) {
    getSelectedKey(key)
  }
}

const expandedKeys = ref<string[]>([])

/**
 * 更新展开的菜单项
 */
function updateExpandedKeys() {
  if (appStore.isSiderCollapse || !selectedKey.value) {
    expandedKeys.value = []
    return
  }

  expandedKeys.value = [selectedKey.value]
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  {
    immediate: true,
  },
)

function getSelectedKey(value: string) {
  router.push(value)
}
</script>

<template>
  <!-- 将一级菜单传送到全局头部菜单 -->
  <Teleport
    :to="`#${GLOBAL_HEADER_MENU_ID}`"
  >
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="activeFirstLevelMenuKey"
      @select="val => handleSelectMixMenu(val as RouteKey)"
    >
      <!-- 渲染一级菜单项 -->
      <MenuItem
        v-for="item in firstLevelMenus"
        :key="item.key"
        :item="item"
        :index="item.key"
      />
    </ElMenu>
  </Teleport>

  <!-- 将子级菜单传送到全局侧边菜单 -->
  <Teleport
    :to="`#${GLOBAL_SIDER_MENU_ID}`"
  >
    <SimpleScrollbar>
      <ElMenu
        mode="vertical"
        :default-active="selectedKey"
        :collapse="appStore.isSiderCollapse"
        @select="val => getSelectedKey(val)"
      >
        <!-- 渲染子级菜单项 -->
        <MenuItem
          v-for="item in childLevelMenus"
          :key="item.routePath"
          :item="item"
          :index="item.routePath"
        />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
