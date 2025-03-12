<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useAppStore } from '@/store/modules/app'

import { useRouteStore } from '@/store/modules/route'

import { SimpleScrollbar } from '@sa/materials'

import { ref, watch } from 'vue'

import { useRoute } from 'vue-router'

import { useMenu } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'VerticalMenu',
})

const route = useRoute()

const appStore = useAppStore()

const routeStore = useRouteStore()

const { routerPushByKeyWithMetaQuery } = useRouterPush()

const { selectedKey } = useMenu()

// const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

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
  <!-- 将菜单传送到全局侧边菜单 -->
  <Teleport
    :to="`#${GLOBAL_SIDER_MENU_ID}`"
  >
    <SimpleScrollbar>
      <ElMenu
        mode="vertical"
        :default-active="selectedKey"
        :default-openeds="expandedKeys"
        :collapse="appStore.isSiderCollapse"
        @select="val => routerPushByKeyWithMetaQuery(val as RouteKey)"
      >
        <!-- 渲染菜单项 -->
        <MenuItem
          v-for="item in routeStore.menuList"
          :key="item.key"
          :item="item"
          :index="item.key"
        />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
