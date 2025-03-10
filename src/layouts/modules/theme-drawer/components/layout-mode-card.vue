<script setup lang="ts">
import type { Placement } from 'element-plus'

import { themeLayoutModeRecord } from '@/constants/app'

defineOptions({
  name: 'LayoutModeCard',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

/**
 * 组件 Props 类型定义
 */
type Props = {

  /**
   * 当前布局模式
   */
  mode: UnionKey.ThemeLayoutMode

  /**
   * 是否禁用切换
   */
  disabled?: boolean
}

/**
 * 组件 Emits 事件类型定义
 */
type Emits = {

  /**
   * 更新布局模式
   * @param mode 选中的布局模式
   */
  (e: 'update:mode', mode: UnionKey.ThemeLayoutMode): void
}

/**
 * 布局配置项
 */
type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {

    /**
     * 提示框显示位置
     */
    placement: Placement

    /**
     * 头部样式类
     */
    headerClass: string

    /**
     * 侧边菜单样式类
     */
    menuClass: string

    /**
     * 主内容区域样式类
     */
    mainClass: string
  }
>

/**
 * 不同布局模式的样式和提示框配置
 */
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

/**
 * 处理布局模式切换
 * @param mode 选中的布局模式
 */
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
      <!-- 使用 ElTooltip 提示框 -->
      <ElTooltip
        :placement="item.placement"
      >
        <!-- 提示框的内容 -->
        <template
          #content
        >
          {{ (themeLayoutModeRecord[key]) }}
        </template>
        <!-- 每个布局项的内部容器 -->
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
