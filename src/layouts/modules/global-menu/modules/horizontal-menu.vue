<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_HEADER_MENU_ID } from '@/constants/app'

import { useRouteStore } from '@/store/modules/route'

import { useRouter } from 'vue-router'

import { useMenu } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'HorizontalMenu',
})

const routeStore = useRouteStore()

const router = useRouter()

const { selectedKey } = useMenu()

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
