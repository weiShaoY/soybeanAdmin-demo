<script setup lang="ts">

import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { useBoolean } from '@sa/hooks'

import { SimpleScrollbar } from '@sa/materials'

import {
  computed,
  ref,
  watch,
} from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import GlobalLogo from '../../global-logo/index.vue'

import FirstLevelMenu from '../components/first-level-menu.vue'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'VerticalMixMenu',
})

const route = useRoute()

const appStore = useAppStore()

const themeStore = useThemeStore()

const router = useRouter()

const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean()

const {
  allMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  getActiveFirstLevelMenuKey,

  //
} = useMixMenuContext()

const { selectedKey } = useMenu()

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted)

const hasChildMenus = computed(() => childLevelMenus.value.length > 0)

const showDrawer = computed(() => hasChildMenus.value && (drawerVisible.value || appStore.mixSiderFixed))

/**
 * 处理选择混合菜单事件
 * @param menu 菜单项
 */
function handleSelectMixMenu(menu: App.Global.Menu) {
  setActiveFirstLevelMenuKey(menu.key)

  if (menu.children?.length) {
    setDrawerVisible(true)
  }
  else {
    getSelectedKey(menu.routeKey)
  }
}

/**
 * 重置激活的菜单项
 */
function handleResetActiveMenu() {
  setDrawerVisible(false)

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey()
  }
}

const expandedKeys = ref<string[]>([])

/**
 * 更新展开的菜单项
 */
function updateExpandedKeys() {
  if (appStore.isSiderCollapse || !selectedKey.value) {
    expandedKeys.value = []
    return
  }

  expandedKeys.value = [selectedKey.value]
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  {
    immediate: true,
  },
)

function getSelectedKey(value: string) {
  router.push(value)
}
</script>

<template>
  <!-- 将菜单传送到全局侧边菜单 -->
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
        :sider-collapse="appStore.isSiderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <!-- 全局 Logo -->
        <GlobalLogo
          :show-title="false"
          :style="{ height: `${themeStore.header.height}px` }"
        />
      </FirstLevelMenu>

      <div
        class="relative h-full transition-width-300"
        :style="{ width: appStore.mixSiderFixed && hasChildMenus ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
        >
          <!-- 顶部栏 -->
          <header
            class="flex-y-center justify-between px-[12px]"
            :style="{ height: `${themeStore.header.height}px` }"
          >
            <h2
              class="text-[16px] text-primary font-bold"
            >
              weiShaoY
            </h2>

            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>

          <!-- 滚动条容器 -->
          <SimpleScrollbar>
            <ElMenu
              mode="vertical"
              :default-active="selectedKey"
              @select="val => getSelectedKey(val)"
            >
              <!-- 子级菜单项 -->
              <MenuItem
                v-for="item in childLevelMenus"
                :key="item.routePath"
                :item="item"
                :index="item.routePath"
              />
            </ElMenu>
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
