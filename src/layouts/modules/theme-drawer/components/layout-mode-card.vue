<script setup lang="ts">
import type { Placement } from 'element-plus'

import { themeLayoutModeRecord } from '@/constants/app'

defineOptions({
  name: 'LayoutModeCard',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

type Props = {

  /** Layout mode */
  mode: UnionKey.ThemeLayoutMode

  /** Disabled */
  disabled?: boolean
}

type Emits = {

  /** Layout mode change */
  (e: 'update:mode', mode: UnionKey.ThemeLayoutMode): void
}

type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {
    placement: Placement
    headerClass: string
    menuClass: string
    mainClass: string
  }
>

const layoutConfig: LayoutConfig = {
  'vertical': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-1/3 h-full',
    mainClass: 'w-2/3 h-3/4',
  },
  'vertical-mix': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4',
  },
  'horizontal': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-full h-3/4',
  },
  'horizontal-mix': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4',
  },
}

function handleChangeMode(mode: UnionKey.ThemeLayoutMode) {
  if (props.disabled) {
    return
  }

  emit('update:mode', mode)
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-center gap-x-[32px] gap-y-[16px]"
  >
    <div
      v-for="(item, key) in layoutConfig"
      :key="key"
      class="flex cursor-pointer border-[2px] rounded-[6px] hover:border-primary"
      :class="[mode === key ? 'border-primary' : 'border-transparent']"
      @click="handleChangeMode(key)"
    >
      <ElTooltip
        :placement="item.placement"
      >
        <template
          #content
        >
          {{ (themeLayoutModeRecord[key]) }}
        </template>

        <div
          class="h-[64px] w-[96px] gap-[6px] rd-[4px] p-[6px] shadow dark:shadow-coolGray-5"
          :class="[key.includes('vertical') ? 'flex' : 'flex-col']"
        >
          <slot
            :name="key"
          />
        </div>
      </ElTooltip>
    </div>
  </div>
</template>

<style scoped></style>
