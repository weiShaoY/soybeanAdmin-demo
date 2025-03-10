<script setup lang="ts">
import type { DropdownInstance } from 'element-plus'

import type { VNode } from 'vue'

import { useSvgIcon } from '@/hooks/common/icon'

import { useTabStore } from '@/store/modules/tab'

import {
  computed,
  ref,
  watch,
} from 'vue'

// 定义组件名称
defineOptions({
  name: 'ContextMenu',
})
// 定义组件的 Props，并设置默认值
const props = withDefaults(defineProps<Props>(), {
  /**
   *  默认不排除任何选项
   */
  excludeKeys: () => [],

  /**
   *  默认没有禁用的选项
   */
  disabledKeys: () => [],
})

type Props = {

  /**
   *  鼠标点击的 X 坐标
   */
  x: number

  /**
   *  鼠标点击的 Y 坐标
   */
  y: number

  /**
   *  选项卡的唯一标识符
   */
  tabId: string

  /**
   *  需要排除的菜单项
   */
  excludeKeys?: App.Global.DropdownKey[]

  /**
   *  需要禁用的菜单项
   */
  disabledKeys?: App.Global.DropdownKey[]
}

// 定义 Props 类型

// 获取选项卡管理相关方法
const { removeTab, clearTabs, clearLeftTabs, clearRightTabs } = useTabStore()

// 获取 SVG 图标渲染函数
const { SvgIconVNode } = useSvgIcon()

/**
 *  定义下拉菜单选项类型
 */
type DropdownOption = {
  key: App.Global.DropdownKey // 选项的唯一标识
  label: string // 选项的文本内容
  icon?: () => VNode // 选项的图标，必须是一个返回 VNode 的函数
  disabled?: boolean // 选项是否禁用
}

/**
 *  计算可用的下拉菜单选项
 */
const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'closeCurrent',
      label: '关闭',
      icon: SvgIconVNode({
        icon: 'ant-design:close-outlined',
        fontSize: 18,
      }),
    },
    {
      key: 'closeOther',
      label: '关闭其它',
      icon: SvgIconVNode({
        icon: 'ant-design:column-width-outlined',
        fontSize: 18,
      }),
    },
    {
      key: 'closeLeft',
      label: '关闭左侧',
      icon: SvgIconVNode({
        icon: 'mdi:format-horizontal-align-left',
        fontSize: 18,
      }),
    },
    {
      key: 'closeRight',
      label: '关闭右侧',
      icon: SvgIconVNode({
        icon: 'mdi:format-horizontal-align-right',
        fontSize: 18,
      }),
    },
    {
      key: 'closeAll',
      label: '关闭所有',
      icon: SvgIconVNode({
        icon: 'ant-design:line-outlined',
        fontSize: 18,
      }),
    },
  ]

  /**
   *  过滤掉排除的选项
   */
  const { excludeKeys, disabledKeys } = props

  const result = opts.filter(opt => !excludeKeys.includes(opt.key))

  /**
   *  设置禁用选项
   */
  disabledKeys.forEach((key) => {
    const opt = result.find(item => item.key === key)

    if (opt) {
      opt.disabled = true
    }
  })

  return result
})

/**
 *  绑定可见性状态
 */
const visible = defineModel<boolean>('visible')

/**
 *  绑定 ElDropdown 组件实例
 */
const dropdown = ref<DropdownInstance>()

// 监听 visible 状态，控制下拉菜单的显示/隐藏
watch(visible, (val) => {
  if (val) {
    dropdown.value!.handleOpen()
  }
  else {
    dropdown.value!.handleClose()
  }
})

/**
 *  隐藏下拉菜单
 */
function hideDropdown() {
  visible.value = false
  dropdown.value!.handleClose()
}

/**
 *  定义下拉菜单选项对应的操作
 */
const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
  closeCurrent() {
    removeTab(props.tabId)
  },
  closeOther() {
    clearTabs([props.tabId])
  },
  closeLeft() {
    clearLeftTabs(props.tabId)
  },
  closeRight() {
    clearRightTabs(props.tabId)
  },
  closeAll() {
    clearTabs()
  },
}

/**
 *  处理下拉菜单选项点击事件
 */
function handleDropdown(optionKey: App.Global.DropdownKey) {
  dropdownAction[optionKey]?.()
  hideDropdown()
}
</script>

<template>
  <div
    class="absolute"
    :style="{ top: `${y - 60}px`, left: `${x + 60}px` }"
  >
    <!-- 右键菜单弹出框 -->
    <ElDropdown
      ref="dropdown"
      popper-class="arrow-hide"
      trigger="click"
      @command="handleDropdown"
    >
      <!-- 该 span 仅用于避免 [ElOnlyChild] 警告：找不到有效的子节点 -->
      <span />

      <template
        #dropdown
      >
        <!-- 下拉菜单容器 -->
        <ElDropdownMenu>
          <!-- 遍历渲染下拉菜单项 -->
          <ElDropdownItem
            v-for="{ key, label, icon, disabled } in options"
            :key="key"
            class="mx-[4px] my-[1px] rounded-[6px]"
            :icon="icon"
            :command="key"
            :disabled="disabled"
          >
            {{ label }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<style lang="scss">
.arrow-hide {
  .el-popper__arrow {
    display: none;
  }
}
</style>
