<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useAppStore } from '@/store/modules/app'

import { useRouteStore } from '@/store/modules/route'

import { SimpleScrollbar } from '@sa/materials'

import { ref, watch } from 'vue'

import { useRoute } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'ReversedHorizontalMixMenu',
})

const route = useRoute()

const appStore = useAppStore()

const routeStore = useRouteStore()

const { routerPushByKeyWithMetaQuery } = useRouterPush()

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
    routerPushByKeyWithMetaQuery(key)
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

  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value)
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
        @select="val => routerPushByKeyWithMetaQuery(val as RouteKey)"
      >
        <!-- 渲染子级菜单项 -->
        <MenuItem
          v-for="item in childLevelMenus"
          :key="item.key"
          :item="item"
          :index="item.key"
        />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
