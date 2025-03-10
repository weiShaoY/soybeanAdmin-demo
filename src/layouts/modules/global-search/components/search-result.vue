<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme'

defineOptions({
  name: 'SearchResult',
})

defineProps<Props>()

const emit = defineEmits<Emits>()

/**
 * 组件接收的 Props 类型
 */
type Props = {

  /** 搜索结果列表，包含菜单项 */
  options: App.Global.Menu[]
}

/**
 * 组件触发的事件类型
 */
type Emits = {

  /** 选中某个搜索结果项时触发 */
  (e: 'enter'): void
}

const theme = useThemeStore()

/**
 * 当前激活的菜单路径
 */
const active = defineModel<string>('path', {
  required: true,
})

/**
 * 鼠标悬停时更新当前激活路径
 * @param {App.Global.Menu} item - 当前悬停的菜单项
 */
async function handleMouseEnter(item: App.Global.Menu) {
  active.value = item.routePath
}

/**
 * 触发 `enter` 事件
 */
function handleTo() {
  emit('enter')
}
</script>

<template>
  <ElScrollbar>
    <div
      class="pb-[12px]"
    >
      <template
        v-for="item in options"
        :key="item.routePath"
      >
        <!-- 搜索结果项，鼠标悬停高亮 -->
        <div
          class="mt-[8px] h-[56px] flex-y-center cursor-pointer justify-between rounded-[4px] bg-[#e5e7eb] px-[14px] dark:bg-dark"
          :style="{
            background: item.routePath === active ? theme.themeColor : '',
            color: item.routePath === active ? '#fff' : '',
          }"
          @click="handleTo"
          @mouseenter="handleMouseEnter(item)"
        >
          <!-- 动态渲染菜单图标 -->
          <component
            :is="item.icon"
          />

          <!-- 菜单文本 -->
          <span
            class="ml-[5px] flex-1"
          >
            {{ item.label }}
          </span>

          <!-- 进入图标 -->
          <icon-ant-design-enter-outlined
            class="icon mr-[3px] p-[2px] text-[20px]"
          />
        </div>
      </template>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped></style>
