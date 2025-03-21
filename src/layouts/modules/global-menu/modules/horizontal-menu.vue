<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_HEADER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useRouteStore } from '@/store/modules/route'

import { useMenu } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'HorizontalMenu',
})

const routeStore = useRouteStore()

const { routerPushByKeyWithMetaQuery } = useRouterPush()

const { selectedKey } = useMenu()

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
      @select="val => routerPushByKeyWithMetaQuery(val as RouteKey)"
    >
      <!-- 渲染菜单项 -->
      <MenuItem
        v-for="item in routeStore.menuList"
        :key="item.routePath"
        :item="item"
        :index="item.routePath"
      />
    </ElMenu>
  </Teleport>
</template>

<style scoped></style>
