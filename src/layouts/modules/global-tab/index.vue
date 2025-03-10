<script setup lang="ts">
import BetterScroll from '@/components/custom/better-scroll.vue'

import { useAppStore } from '@/store/modules/app'

import { useRouteStore } from '@/store/modules/route'

import { useTabStore } from '@/store/modules/tab'

import { useThemeStore } from '@/store/modules/theme'

import { isPC } from '@/utils'

import { PageTab } from '@sa/materials'

import { useElementBounding } from '@vueuse/core'

import {
  nextTick,
  ref,
  watch,
} from 'vue'

import { useRoute } from 'vue-router'

import ContextMenu from './context-menu.vue'

defineOptions({
  name: 'GlobalTab',
})

const route = useRoute()

const appStore = useAppStore()

const themeStore = useThemeStore()

const routeStore = useRouteStore()

const tabStore = useTabStore()

/**
 * 滚动容器的引用
 */
const bsWrapper = ref<HTMLElement>()

/**
 * 滚动容器的宽度
 */
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper)

/**
 * BetterScroll 实例的引用
 */
const bsScroll = ref<InstanceType<typeof BetterScroll>>()

/**
 * 标签页容器的引用
 */
const tabRef = ref<HTMLElement>()

/**
 * 是否是 PC 端
 */
const isPCFlag = isPC()

/**
 * 标签页数据 ID 属性
 */
const TAB_DATA_ID = 'data-tab-id'

type TabNamedNodeMap = NamedNodeMap & {
  [TAB_DATA_ID]: Attr
}

/**
 * 滚动到当前激活的标签页
 */
async function scrollToActiveTab() {
  await nextTick()
  if (!tabRef.value) {
    return
  }

  const { children } = tabRef.value

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i]

    const { value: tabId } = (child.attributes as TabNamedNodeMap)[TAB_DATA_ID]

    if (tabId === tabStore.activeTabId) {
      const { left, width } = child.getBoundingClientRect()

      const clientX = left + width / 2

      setTimeout(() => {
        scrollByClientX(clientX)
      }, 50)
      break
    }
  }
}

/**
 * 根据鼠标点击的 X 坐标进行滚动
 * @param {number} clientX - 鼠标点击的 X 坐标
 */
function scrollByClientX(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value

  const deltaX = currentX - bsWrapperWidth.value / 2

  if (bsScroll.value?.instance) {
    const { maxScrollX, x: leftX, scrollBy } = bsScroll.value.instance

    const rightX = maxScrollX - leftX

    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX)

    scrollBy(update, 0, 300)
  }
}

/**
 * 获取上下文菜单禁用的键列表
 * @param {string} tabId - 选项卡 ID
 * @returns {App.Global.DropdownKey[]} 禁用的键列表
 */
function getContextMenuDisabledKeys(tabId: string) {
  const disabledKeys: App.Global.DropdownKey[] = []

  if (tabStore.isTabRetain(tabId)) {
    disabledKeys.push('closeCurrent', 'closeLeft')
  }

  return disabledKeys
}

/**
 * 关闭标签页
 * @param {App.Global.Tab} tab - 需要关闭的标签页对象
 */
async function handleCloseTab(tab: App.Global.Tab) {
  await tabStore.removeTab(tab.id)
  if (themeStore.resetCacheStrategy === 'close') {
    routeStore.resetRouteCache(tab.routeKey)
  }
}

/**
 * 刷新页面
 */
async function refresh() {
  appStore.reloadPage(500)
}

type DropdownConfig = {

  /**
   * 是否显示上下文菜单
   */
  visible: boolean

  /**
   * 上下文菜单 X 坐标
   */
  x: number

  /**
   * 上下文菜单 Y 坐标
   */
  y: number

  /**
   * 关联的选项卡 ID
   */
  tabId: string
}

/**
 * 上下文菜单的状态
 */
const dropdown = ref<DropdownConfig>({
  visible: false,
  x: 0,
  y: 0,
  tabId: '',
})

/**
 * 设置上下文菜单状态
 * @param {Partial<DropdownConfig>} config - 需要更新的部分配置
 */
function setDropdown(config: Partial<DropdownConfig>) {
  Object.assign(dropdown.value, config)
}

let isClickContextMenu = false

/**
 * 处理上下文菜单的可见性变化
 * @param {boolean | undefined} visible - 是否可见
 */
function handleDropdownVisible(visible: boolean | undefined) {
  if (!isClickContextMenu) {
    setDropdown({
      visible: visible ?? false,
    })
  }
}

/**
 * 处理右键菜单事件
 * @param {MouseEvent} e - 鼠标事件
 * @param {string} tabId - 选项卡 ID
 */
async function handleContextMenu(e: MouseEvent, tabId: string) {
  e.preventDefault()
  const { clientX, clientY } = e

  isClickContextMenu = true

  const DURATION = dropdown.value.visible ? 150 : 0

  setDropdown({
    visible: false,
  })

  setTimeout(() => {
    setDropdown({
      visible: true,
      x: clientX,
      y: clientY,
      tabId,
    })
    isClickContextMenu = false
  }, DURATION)
}

/**
 * 初始化标签页存储
 */
function init() {
  tabStore.initTabStore(route)
}

/**
 * 移除焦点
 */
function removeFocus() {
  (document.activeElement as HTMLElement)?.blur()
}

watch(() => route.fullPath, () => {
  tabStore.addTab(route)
})

watch(() => tabStore.activeTabId, () => {
  scrollToActiveTab()
})

init()
</script>

<template>
  <!-- 主题容器，包含整个 Tab 页 -->
  <DarkModeContainer
    class="size-full flex-y-center px-[16px] shadow-tab"
  >
    <!-- 滚动区域外层容器 -->
    <div
      ref="bsWrapper"
      class="h-full flex-1-hidden"
    >
      <!-- 使用 BetterScroll 实现横向滚动 -->
      <BetterScroll
        ref="bsScroll"
        :options="{ scrollX: true, scrollY: false, click: !isPCFlag }"
        @click="removeFocus"
      >
        <!-- Tab 标签列表容器 -->
        <div
          ref="tabRef"
          class="h-full flex pr-[18px]"
          :class="[themeStore.tab.mode === 'chrome' ? 'items-end' : 'items-center gap-[12px]']"
        >
          <!-- 遍历所有 Tab 并渲染 -->
          <PageTab
            v-for="tab in tabStore.tabs"
            :key="tab.id"
            :[TAB_DATA_ID]="tab.id"
            :mode="themeStore.tab.mode"
            :dark-mode="themeStore.darkMode"
            :active="tab.id === tabStore.activeTabId"
            :active-color="themeStore.themeColor"
            :closable="!tabStore.isTabRetain(tab.id)"
            @click="tabStore.switchRouteByTab(tab)"
            @close="handleCloseTab(tab)"
            @contextmenu="handleContextMenu($event, tab.id)"
          >
            <!-- Tab 前缀图标 -->
            <template
              #prefix
            >
              <SvgIcon
                :icon="tab.icon"
                :local-icon="tab.localIcon"
                class="inline-block align-text-bottom text-[16px]"
              />
            </template>
            <!-- Tab 名称 -->
            <div
              class="max-w-[240px] ellipsis-text"
            >
              {{ tab.label }}
            </div>
          </PageTab>
        </div>
      </BetterScroll>
    </div>

    <!-- 刷新按钮 -->
    <div>
      <ReloadButton
        :loading="!appStore.reloadFlag"
        @click="refresh"
      />
    </div>

    <!-- 全屏切换按钮 -->
    <FullScreen
      :full="appStore.fullContent"
      @click="appStore.toggleFullContent"
    />
  </DarkModeContainer>

  <!-- 右键菜单 -->
  <ContextMenu
    :visible="dropdown.visible"
    :tab-id="dropdown.tabId"
    :disabled-keys="getContextMenuDisabledKeys(dropdown.tabId)"
    :x="dropdown.x"
    :y="dropdown.y"
    @update:visible="handleDropdownVisible"
  />
</template>

<style scoped></style>
