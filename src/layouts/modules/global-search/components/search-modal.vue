<script lang="ts" setup>
import type { InputInstance } from 'element-plus'

import { useAppStore } from '@/store/modules/app'

import { useRouteStore } from '@/store/modules/route'

import { onKeyStroke, useDebounceFn } from '@vueuse/core'

import {
  computed,
  ref,
  shallowRef,
} from 'vue'

import { useRouter } from 'vue-router'

import SearchFooter from './search-footer.vue'

import SearchResult from './search-result.vue'

defineOptions({
  name: 'SearchModal',
})

const router = useRouter()

const appStore = useAppStore()

const routeStore = useRouteStore()

/**
 *  是否为移动端
 */
const isMobile = computed(() => appStore.isMobile)

/**
 *  搜索关键词
 */
const keyword = ref('')

/**
 *  当前激活的路径
 */
const activePath = ref('')

/**
 *  搜索匹配的菜单项
 */
const resultOptions = shallowRef<App.Global.Menu[]>([])

/**
 *  绑定搜索框 DOM 实例
 */
const searchInput = ref<InputInstance>()

/**
 *  绑定弹窗的显示状态
 */
const visible = defineModel<boolean>('show', {
  required: true,
})

/**
 *  防抖搜索处理
 */
const handleSearch = useDebounceFn(search, 300)

/**
 * 执行搜索
 */
function search() {
  resultOptions.value = routeStore.searchMenus.filter((menu) => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim()

    const title = menu.label.toLocaleLowerCase()

    return trimKeyword && title.includes(trimKeyword)
  })
  activePath.value = resultOptions.value[0]?.routePath ?? ''
}

/**
 * 关闭搜索框
 */
function handleClose() {
  // 使用 setTimeout 避免用户看到一些操作
  setTimeout(() => {
    visible.value = false
    resultOptions.value = []
    keyword.value = ''
  }, 200)
}

/**
 * 获取当前激活项的索引
 * @returns {number} - 激活项索引
 */
function getActivePathIndex() {
  return resultOptions.value.findIndex(item => item.routePath === activePath.value)
}

/**
 * 处理向上键
 */
function handleUp() {
  const { length } = resultOptions.value

  if (length === 0) {
    return
  }

  const index = getActivePathIndex()

  if (index === -1) {
    return
  }

  const activeIndex = index === 0 ? length - 1 : index - 1

  activePath.value = resultOptions.value[activeIndex].routePath
}

/**
 * 处理向下键
 */
function handleDown() {
  const { length } = resultOptions.value

  if (length === 0) {
    return
  }

  const index = getActivePathIndex()

  if (index === -1) {
    return
  }

  const activeIndex = index === length - 1 ? 0 : index + 1

  activePath.value = resultOptions.value[activeIndex].routePath
}

/**
 * 处理回车键
 */
function handleEnter() {
  if (resultOptions.value.length === 0 || activePath.value === '') {
    return
  }

  handleClose()
  router.push(activePath.value)
}

/**
 * 注册键盘快捷键
 */
function registerShortcut() {
  onKeyStroke('Escape', handleClose)
  onKeyStroke('Enter', handleEnter)
  onKeyStroke('ArrowUp', handleUp)
  onKeyStroke('ArrowDown', handleDown)
}

/**
 * 打开弹窗时设置搜索框焦点
 */
function setFocus() {
  setTimeout(() => {
    searchInput.value?.focus()
  })
}

// 立即注册快捷键
registerShortcut()
</script>

<template>
  <ElDialog
    v-model="visible"
    :show-close="false"
    append-to-body
    class="search-modal fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-[0px] rounded-0' : 'w-[630px] top-[50px]']"
    @open-auto-focus="setFocus"
    @close="handleClose"
  >
    <!-- 搜索输入框 -->
    <ElInput
      ref="searchInput"
      v-model="keyword"
      clearable
      placeholder="请输入关键词搜索"
      @input="handleSearch"
    >
      <!-- 输入框前缀图标 -->
      <template
        #prefix
      >
        <icon-uil-search
          class="text-[15px]"
        />
      </template>
      <!-- 移动端显示取消按钮 -->
      <template
        v-if="isMobile"
        #append
      >
        <ElButton
          type="primary"
          plain
          @click="handleClose"
        >
          {{ '取消' }}
        </ElButton>
      </template>
    </ElInput>

    <div>
      <!-- 如果没有搜索结果，显示无数据提示 -->
      <ElEmpty
        v-if="resultOptions.length === 0"
        description="无数据"
        :image-size="50"
      />
      <!-- 如果有搜索结果，显示结果组件 -->
      <SearchResult
        v-else
        v-model:path="activePath"
        :options="resultOptions"
        @enter="handleEnter"
      />
    </div>

    <!-- 弹窗底部区域 -->
    <template
      #footer
    >
      <!-- 如果不是移动端，显示搜索结果底部组件 -->
      <SearchFooter
        v-if="!isMobile"
      />
    </template>
  </ElDialog>
</template>

<style lang="scss">
.search-modal {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 10px 15px 0;
  }
  .el-dialog__footer {
    border-top-width: 1px;
  }
}
</style>
