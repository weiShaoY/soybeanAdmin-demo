<script setup lang="ts">
import type { PageTabProps } from '../../types'

import ChromeTabBg from './chrome-tab-bg.vue'

import style from './index.module.css'

/** 定义组件名称 */
defineOptions({
  name: 'ChromeTab',
})

/** 定义组件的属性 */
defineProps<PageTabProps>()

/** 定义 slots */
defineSlots<Slots>()

/** Slot 函数类型定义 */
type SlotFn = (props?: Record<string, unknown>) => any

/** Slots 类型定义 */
type Slots = {

  /**
   * Slot
   *
   * 标签的中心内容
   */
  default?: SlotFn

  /**
   * Slot
   *
   * 标签的左侧内容
   */
  prefix?: SlotFn

  /**
   * Slot
   *
   * 标签的右侧内容
   */
  suffix?: SlotFn
}

</script>

<template>
  <div
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-[16px] whitespace-nowrap px-[24px] py-[6px] -mr-[18px]"
    :class="[
      style['chrome-tab'],
      { [style['chrome-tab_dark']]: darkMode },
      { [style['chrome-tab_active']]: active },
      { [style['chrome-tab_active_dark']]: active && darkMode },
    ]"
  >
    <div
      class=":soy: pointer-events-none absolute left-0 top-0 h-full w-full -z-1"
      :class="[style['chrome-tab__bg']]"
    >
      <ChromeTabBg />
    </div>

    <slot
      name="prefix"
    />

    <slot />

    <slot
      name="suffix"
    />

    <div
      class=":soy: absolute right-[7px] h-[16px] w-[1px] bg-[#1f2225]"
      :class="[style['chrome-tab-divider']]"
    />
  </div>
</template>

<style scoped></style>
