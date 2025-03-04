<script setup lang="ts">
import type { Placement } from 'element-plus'

import { computed } from 'vue'

defineOptions({
  name: 'ThemeSchemaSwitch',
})

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom',
})

const emit = defineEmits<Emits>()

type Props = {

  /** Theme schema */
  themeSchema: UnionKey.ThemeScheme

  /** Show tooltip */
  showTooltip?: boolean

  /** Tooltip placement */
  tooltipPlacement?: Placement
}

type Emits = {
  (e: 'switch'): void
}

function handleSwitch() {
  emit('switch')
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto',
}

const icon = computed(() => icons[props.themeSchema])

const tooltipContent = computed(() => {
  if (!props.showTooltip) { return '' }

  return '主题模式'
})
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>
