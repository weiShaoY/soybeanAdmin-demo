<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { useRouterPush } from '@/hooks/common/router'

import { useRouteStore } from '@/store/modules/route'

import { useThemeStore } from '@/store/modules/theme'

import { createReusableTemplate } from '@vueuse/core'

defineOptions({
  name: 'GlobalBreadcrumb',
})

const themeStore = useThemeStore()

const routeStore = useRouteStore()

const { routerPushByKey } = useRouterPush()

type BreadcrumbContentProps = {
  breadcrumb: App.Global.Menu
}

const [DefineBreadcrumbContent, BreadcrumbContent] = createReusableTemplate<BreadcrumbContentProps>()

/**
 * 处理点击菜单项事件
 * @param key 路由键
 */
function handleClickMenu(key: RouteKey) {
  routerPushByKey(key)
}
</script>

<template>
  <ElBreadcrumb
    v-if="themeStore.header.breadcrumb.visible"
  >
    <!-- 定义组件：BreadcrumbContent -->
    <DefineBreadcrumbContent
      v-slot="{ breadcrumb }"
    >
      <div
        class="i-flex-y-center align-middle"
      >
        <component
          :is="breadcrumb.icon"
          v-if="themeStore.header.breadcrumb.showIcon"
          class="mr-[4px] text-icon"
        />
        {{ breadcrumb.label }}
      </div>
    </DefineBreadcrumbContent>
    <!-- 组件定义结束：BreadcrumbContent -->

    <!-- 渲染面包屑项 -->
    <ElBreadcrumbItem
      v-for="item in routeStore.breadcrumbs"
      :key="item.key"
    >
      <ElDropdown
        v-if="item.options?.length"
        @command="handleClickMenu"
      >
        <!-- 面包屑内容 -->
        <BreadcrumbContent
          :breadcrumb="item"
        />

        <template
          #dropdown
        >
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="option in item.options"
              :key="option.key"
              :command="option.key"
            >
              {{ option.label }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <BreadcrumbContent
        v-else
        :breadcrumb="item"
      />
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped></style>
