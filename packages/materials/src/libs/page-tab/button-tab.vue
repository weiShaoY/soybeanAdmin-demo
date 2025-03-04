<script setup lang="ts">
import type { PageTabProps } from '../../types'

import style from './index.module.css'

/** 定义组件名称 */
defineOptions({
  name: 'ButtonTab',
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
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-[12px] whitespace-nowrap border-(1px solid) rounded-[4px] px-[12px] py-[4px]"
    :class="[
      style['button-tab'],
      { [style['button-tab_dark']]: darkMode },
      { [style['button-tab_active']]: active },
      { [style['button-tab_active_dark']]: active && darkMode },
    ]"
  >
    <slot
      name="prefix"
    />

    <slot />

    <slot
      name="suffix"
    />
  </div>
</template>

<style scoped></style>
