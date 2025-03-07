<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types'

import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useAppStore } from '@/store/modules/app'

import { useRouteStore } from '@/store/modules/route'

import { useThemeStore } from '@/store/modules/theme'

import { useBoolean } from '@sa/hooks'

import { SimpleScrollbar } from '@sa/materials'

import {
  computed,
  ref,
  watch,
} from 'vue'

import { useRoute } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import GlobalLogo from '../../global-logo/index.vue'

import FirstLevelMenu from '../components/first-level-menu.vue'

import MenuItem from '../components/menu-item.vue'

// 定义组件名称
defineOptions({
  name: 'VerticalMixMenu',
})

const route = useRoute() // 获取当前路由对象

const appStore = useAppStore() // 获取应用状态管理

const themeStore = useThemeStore() // 获取主题状态管理

const routeStore = useRouteStore() // 获取路由状态管理

const { routerPushByKeyWithMetaQuery } = useRouterPush() // 路由跳转封装方法

const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean() // 控制抽屉菜单的可见性

// 获取混合菜单的相关数据和方法
const {
  allMenus, // 所有菜单项
  childLevelMenus, // 当前选中一级菜单的子菜单
  activeFirstLevelMenuKey, // 当前激活的一级菜单 Key
  setActiveFirstLevelMenuKey, // 设置当前激活的一级菜单 Key
  getActiveFirstLevelMenuKey, // 获取当前激活的一级菜单 Key
} = useMixMenuContext()

const { selectedKey } = useMenu() // 获取当前选中的菜单项 Key

// 计算是否使用深色模式（仅在不是暗黑模式且侧边栏反色时为 true）
const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted)

// 计算是否有子菜单
const hasChildMenus = computed(() => childLevelMenus.value.length > 0)

// 计算抽屉菜单是否可见（有子菜单并且抽屉打开或侧边栏固定时可见）
const showDrawer = computed(() => hasChildMenus.value && (drawerVisible.value || appStore.mixSiderFixed))

/**
 * 处理菜单选择事件
 * @param menu 选中的菜单项
 */
function handleSelectMixMenu(menu: App.Global.Menu) {
  console.log('%c Line:69 🍑 menu', 'color:#42b983', menu)
  console.log('%c Line:71 🍣 menu.children?.length', 'color:#2eafb0', menu.children?.length)

  // 设置当前激活的一级菜单
  setActiveFirstLevelMenuKey(menu.key)

  if (menu.children?.length) {
    // 如果有子菜单，打开抽屉菜单
    setDrawerVisible(true)
  }
  else {
    console.log('%c Line:77 🌶 menu.routeKey', 'color:#2eafb0', menu.routeKey)

    // 没有子菜单，直接跳转路由
    routerPushByKeyWithMetaQuery(menu.routeKey)
  }
}

/**
 * 重置激活菜单
 */
function handleResetActiveMenu() {
  setDrawerVisible(false) // 关闭抽屉菜单

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey() // 如果侧边栏未固定，恢复原来的一级菜单选中状态
  }
}

const expandedKeys = ref<string[]>([]) // 存储展开的菜单 Key

/**
 * 更新展开的菜单 Key
 */
function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [] // 侧边栏收起或未选中菜单时，清空展开列表
  }
}

// 初始化展开菜单 Key
expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value)

// 监听选中的菜单项，更新展开状态
watch(
  () => selectedKey.value,
  () => {
    updateExpandedKeys()
  },
  {
    immediate: true,
  },
)

// 监听路由变化，更新展开状态
watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <Teleport
    :to="`#${GLOBAL_SIDER_MENU_ID}`"
  >
    <div
      class="h-full flex"
      @mouseleave="handleResetActiveMenu"
    >
      <!-- 一级菜单 -->
      <FirstLevelMenu
        :menus="allMenus"
        :active-menu-key="activeFirstLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo
          :show-title="false"
          :style="{ height: `${themeStore.header.height}px` }"
        />
      </FirstLevelMenu>

      <!-- 侧边栏子菜单 -->
      <div
        class="relative h-full transition-width-300"
        :style="{ width: appStore.mixSiderFixed && hasChildMenus ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
        >
          <!-- 侧边栏标题栏 -->
          <header
            class="flex-y-center justify-between px-[12px]"
            :style="{ height: `${themeStore.header.height}px` }"
          >
            <h2
              class="text-[16px] text-primary font-bold"
            >
              Soybean 管理系统
            </h2>

            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>

          <!-- 子菜单内容 -->
          <SimpleScrollbar>
            <ElMenu
              mode="vertical"
              :default-active="selectedKey"
              @select="val => routerPushByKeyWithMetaQuery(val as RouteKey)"
            >
              <MenuItem
                v-for="item in childLevelMenus"
                :key="item.key"
                :item="item"
                :index="item.key"
              />
            </ElMenu>
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
