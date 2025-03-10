<script setup lang="ts">
import { transformColorWithOpacity } from '@sa/color'

import { SimpleScrollbar } from '@sa/materials'

import { createReusableTemplate } from '@vueuse/core'

import { computed } from 'vue'

defineOptions({
  name: 'FirstLevelMenu',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

type Props = {

  /**
   *  菜单列表
   */
  menus: App.Global.Menu[]

  /**
   *  当前选中的菜单项 key
   */
  activeMenuKey?: string

  /**
   *  是否反转颜色（用于暗色模式）
   */
  inverted?: boolean

  /**
   *  侧边栏是否折叠
   */
  siderCollapse?: boolean

  /**
   *  是否启用暗色模式
   */
  darkMode?: boolean

  /**
   *  主题颜色
   */
  themeColor: string
}

type Emits = {
  (e: 'select', menu: App.Global.Menu): boolean // 菜单项选中事件
  (e: 'toggleSiderCollapse'): void // 切换侧边栏折叠状态事件
}

// 定义 MixMenuItem 组件的 Props 类型
type MixMenuItemProps = {

  /**
   *  菜单项标签
   */
  label: App.Global.Menu['label']

  /**
   *  菜单项图标
   */
  icon: App.Global.Menu['icon']

  /**
   *  是否激活
   */
  active: boolean

  /**
   *  是否是小尺寸（用于侧边栏折叠时）
   */
  isMini?: boolean
}

// 创建可复用的 MixMenuItem 组件模板
const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>()

/**
 *  计算选中菜单项的背景颜色
 */
const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = props

  /**
   *   根据暗色模式选择不同的背景颜色
   */
  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff')

  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000')

  return darkMode ? dark : light
})

/**
 *   处理菜单项点击事件
 */
function handleClickMixMenu(menu: App.Global.Menu) {
  emit('select', menu)
}

/**
 *  切换侧边栏折叠状态
 */
function toggleSiderCollapse() {
  emit('toggleSiderCollapse')
}
</script>

<template>
  <!-- 定义可复用的 MixMenuItem 组件 -->
  <DefineMixMenuItem
    v-slot="{ label, icon, active, isMini }"
  >
    <div
      class="mx-[4px] mb-[6px] flex-col-center cursor-pointer rounded-[8px] bg-transparent px-[4px] py-[8px] transition-300 hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': inverted,
        '!text-white !bg-primary': active && inverted,
      }"
    >
      <!-- 动态加载图标 -->
      <component
        :is="icon"
        :class="[isMini ? 'text-icon-small' : 'text-icon-large']"
      />

      <!-- 菜单项标签 -->
      <p
        class="w-full ellipsis-text text-center text-[12px] transition-height-300"
        :class="[isMini ? 'h-0 pt-0' : 'h-[20px] pt-[4px]']"
      >
        {{ label }}
      </p>
    </div>
  </DefineMixMenuItem>
  <!-- 定义结束 -->

  <!-- 主布局 -->
  <div
    class="h-full flex-col-stretch flex-1-hidden"
  >
    <slot />

    <!-- 滚动条容器 -->
    <SimpleScrollbar>
      <!-- 遍历菜单列表，渲染 MixMenuItem -->
      <MixMenuItem
        v-for="menu in menus"
        :key="menu.key"
        :label="menu.label"
        :icon="menu.icon"
        :active="menu.key === activeMenuKey"
        :is-mini="siderCollapse"
        @click="handleClickMixMenu(menu)"
      />
    </SimpleScrollbar>

    <!-- 侧边栏折叠按钮 -->
    <MenuToggler
      arrow-icon
      :collapsed="siderCollapse"
      :z-index="99"
      :class="{ 'text-white:88 !hover:text-white': inverted }"
      @click="toggleSiderCollapse"
    />
  </div>
</template>

<style scoped>
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}
</style>
