<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import type { PageTabMode, PageTabProps } from '../../types';
import { ACTIVE_COLOR, createTabCssVars } from './shared';
import ChromeTab from './chrome-tab.vue';
import ButtonTab from './button-tab.vue';
import SvgClose from './svg-close.vue';
import style from './index.module.css';

/** 定义组件名称 */
defineOptions({
  name: 'PageTab'
});

/** 定义组件的属性和默认值 */
const props = withDefaults(defineProps<PageTabProps>(), {
  mode: 'chrome',
  commonClass: 'transition-all-300',
  activeColor: ACTIVE_COLOR,
  closable: true
});

/** 定义 Emits */
type Emits = {
  (e: 'close'): void;
};

const emit = defineEmits<Emits>();

/**
 * 计算激活的标签组件
 *
 * @returns 激活的标签组件和类名
 */
const activeTabComponent = computed(() => {
  const { mode, chromeClass, buttonClass } = props;

  /** 定义标签组件映射表 */
  const tabComponentMap = {
    /** Chrome 模式的组件和类名 */
    chrome: {
      /** Chrome 模式的组件 */
      component: ChromeTab,
      /** Chrome 模式的类名 */
      class: chromeClass
    },

    /** 按钮模式的组件和类名 */
    button: {
      /** 按钮模式的组件 */
      component: ButtonTab,
      /** 按钮模式的类名 */
      class: buttonClass
    }
  } satisfies Record<PageTabMode, { component: Component; class?: string }>;

  return tabComponentMap[mode];
});

/** 计算 CSS 变量 */
const cssVars = computed(() => createTabCssVars(props.activeColor));

/** 绑定属性 */
const bindProps = computed(() => {
  const { chromeClass: _chromeCls, buttonClass: _btnCls, ...rest } = props;

  return rest;
});

/** 处理关闭事件 */
function handleClose() {
  emit('close');
}
</script>

<template>
  <component :is="activeTabComponent.component" :class="activeTabComponent.class" :style="cssVars" v-bind="bindProps">
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot></slot>
    <template #suffix>
      <slot name="suffix">
        <SvgClose v-if="closable" :class="[style['svg-close']]" @click.stop="handleClose" />
      </slot>
    </template>
  </component>
</template>

<style scoped></style>
