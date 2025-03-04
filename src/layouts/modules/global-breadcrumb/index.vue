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

function handleClickMenu(key: RouteKey) {
  routerPushByKey(key)
}
</script>

<template>
  <ElBreadcrumb
    v-if="themeStore.header.breadcrumb.visible"
  >
    <!-- define component start: BreadcrumbContent -->
    <DefineBreadcrumbContent
      v-slot="{ breadcrumb }"
    >
      <div
        class="i-flex-y-center align-middle"
      >
        <component
          :is="breadcrumb.icon"
          v-if="themeStore.header.breadcrumb.showIcon"
          class="mr-4px text-icon"
        />
        {{ breadcrumb.label }}
      </div>
    </DefineBreadcrumbContent>

    <!-- define component end: BreadcrumbContent -->
    <ElBreadcrumbItem
      v-for="item in routeStore.breadcrumbs"
      :key="item.key"
    >
      <ElDropdown
        v-if="item.options?.length"
        @command="handleClickMenu"
      >
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
