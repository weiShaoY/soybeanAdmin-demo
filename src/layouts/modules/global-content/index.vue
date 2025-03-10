<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

import { useRouteStore } from '@/store/modules/route'

import { useTabStore } from '@/store/modules/tab'

import { useThemeStore } from '@/store/modules/theme'

import { LAYOUT_SCROLL_EL_ID } from '@sa/materials'

import { computed } from 'vue'

defineOptions({
  name: 'GlobalContent',
})

withDefaults(defineProps<Props>(), {
  showPadding: true,
})

type Props = {

  /**
   * 是否显示内容的内边距
   */
  showPadding?: boolean
}

const appStore = useAppStore()

const themeStore = useThemeStore()

const routeStore = useRouteStore()

const tabStore = useTabStore()

/**
 *  计算过渡动画名称
 */
const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''))

/**
 * 重置滚动条位置
 */
function resetScroll() {
  const el = document.querySelector(`#${LAYOUT_SCROLL_EL_ID}`)

  el?.scrollTo({
    left: 0,
    top: 0,
  })
}
</script>

<template>
  <RouterView
    v-slot="{ Component, route }"
  >
    <!-- 过渡效果 -->
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-leave="resetScroll"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <!-- 缓存组件 -->
      <KeepAlive
        :include="routeStore.cacheRoutes"
        :exclude="routeStore.excludeCacheRoutes"
      >

        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="tabStore.getTabIdByRoute(route)"
          :class="{ 'p-[16px]': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
