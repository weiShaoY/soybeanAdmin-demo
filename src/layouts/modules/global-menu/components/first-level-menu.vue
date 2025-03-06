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

/** 组件的属性 */
type Props = {
  /** 菜单列表 */
  menus: App.Global.Menu[]

  /** 当前激活的菜单项键值 */
  activeMenuKey?: string

  /** 是否反转颜色 */
  inverted?: boolean

  /** 侧边栏是否折叠 */
  siderCollapse?: boolean

  /** 是否启用暗黑模式 */
  darkMode?: boolean

  /** 主题颜色 */
  themeColor: string
}

/** 组件的事件 */
type Emits = {
  /** 选择菜单项事件 */
  (e: 'select', menu: App.Global.Menu): boolean

  /** 切换侧边栏折叠状态事件 */
  (e: 'toggleSiderCollapse'): void
}

/** 组合菜单项的属性 */
type MixMenuItemProps = {
  /** 菜单项标签 */
  label: App.Global.Menu['label']

  /** 菜单项图标 */
  icon: App.Global.Menu['icon']

  /** 是否为激活状态 */
  active: boolean

  /** 是否为迷你模式 */
  isMini?: boolean
}

const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>()

/** 计算选中菜单项的背景颜色 */
const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = props

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff')
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000')

  return darkMode ? dark : light
})

/** 处理菜单项点击事件 */
function handleClickMixMenu(menu: App.Global.Menu) {
  emit('select', menu)
}

/** 切换侧边栏折叠状态 */
function toggleSiderCollapse() {
  emit('toggleSiderCollapse')
}
</script>

<template>
  <!-- 定义组件：MixMenuItem -->
  <DefineMixMenuItem v-slot="{ label, icon, active, isMini }">
    <div
      class="mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px transition-300 hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': inverted,
        '!text-white !bg-primary': active && inverted,
      }"
    >
      <component :is="icon" :class="[isMini ? 'text-icon-small' : 'text-icon-large']" />

      <p class="w-full ellipsis-text text-center text-12px transition-height-300" :class="[isMini ? 'h-0 pt-0' : 'h-20px pt-4px']">
        {{ label }}
      </p>
    </div>
  </DefineMixMenuItem>
  <!-- 定义组件结束：MixMenuItem -->

  <div class="h-full flex-col-stretch flex-1-hidden">
    <slot />

    <SimpleScrollbar>
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
/* 选中菜单项的背景颜色 */
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}
</style>
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

/** 组件的属性 */
type Props = {
  /** 菜单列表 */
  menus: App.Global.Menu[]

  /** 当前激活的菜单项键值 */
  activeMenuKey?: string

  /** 是否反转颜色 */
  inverted?: boolean

  /** 侧边栏是否折叠 */
  siderCollapse?: boolean

  /** 是否启用暗黑模式 */
  darkMode?: boolean

  /** 主题颜色 */
  themeColor: string
}

/** 组件的事件 */
type Emits = {
  /** 选择菜单项事件 */
  (e: 'select', menu: App.Global.Menu): boolean

  /** 切换侧边栏折叠状态事件 */
  (e: 'toggleSiderCollapse'): void
}

/** 组合菜单项的属性 */
type MixMenuItemProps = {
  /** 菜单项标签 */
  label: App.Global.Menu['label']

  /** 菜单项图标 */
  icon: App.Global.Menu['icon']

  /** 是否为激活状态 */
  active: boolean

  /** 是否为迷你模式 */
  isMini?: boolean
}

const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>()

/** 计算选中菜单项的背景颜色 */
const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = props

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff')
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000')

  return darkMode ? dark : light
})

/** 处理菜单项点击事件 */
function handleClickMixMenu(menu: App.Global.Menu) {
  emit('select', menu)
}

/** 切换侧边栏折叠状态 */
function toggleSiderCollapse() {
  emit('toggleSiderCollapse')
}
</script>

<template>
  <!-- 定义组件：MixMenuItem -->
  <DefineMixMenuItem v-slot="{ label, icon, active, isMini }">
    <div
      class="mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px transition-300 hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': inverted,
        '!text-white !bg-primary': active && inverted,
      }"
    >
      <component :is="icon" :class="[isMini ? 'text-icon-small' : 'text-icon-large']" />

      <p class="w-full ellipsis-text text-center text-12px transition-height-300" :class="[isMini ? 'h-0 pt-0' : 'h-20px pt-4px']">
        {{ label }}
      </p>
    </div>
  </DefineMixMenuItem>
  <!-- 定义组件结束：MixMenuItem -->

  <div class="h-full flex-col-stretch flex-1-hidden">
    <slot />

    <SimpleScrollbar>
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
/* 选中菜单项的背景颜色 */
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}
</style>
