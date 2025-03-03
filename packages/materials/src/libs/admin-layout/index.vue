<script setup lang="ts">
import { computed } from 'vue';
import type { AdminLayoutProps } from '../../types';
import { LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID, createLayoutCssVars } from './shared';
import style from './index.module.css';

/** 定义组件名称 */
defineOptions({
  name: 'AdminLayout'
});

/** 定义组件的属性和默认值 */
const props = withDefaults(defineProps<AdminLayoutProps>(), {
  mode: 'vertical',
  scrollMode: 'content',
  scrollElId: LAYOUT_SCROLL_EL_ID,
  commonClass: 'transition-all-300',
  fixedTop: true,
  maxZIndex: LAYOUT_MAX_Z_INDEX,
  headerVisible: true,
  headerHeight: 56,
  tabVisible: true,
  tabHeight: 48,
  siderVisible: true,
  siderCollapse: false,
  siderWidth: 220,
  siderCollapsedWidth: 64,
  footerVisible: true,
  footerHeight: 48,
  rightFooter: false
});

/** 定义 Emits */
type Emits = {
  /** 更新侧边栏折叠状态 */
  (e: 'update:siderCollapse', collapse: boolean): void;
};

const emit = defineEmits<Emits>();

/** Slot 函数类型定义 */
type SlotFn = (props?: Record<string, unknown>) => any;

/** Slots 类型定义 */
type Slots = {
  /** 主内容 */
  default?: SlotFn;
  /** 头部 */
  header?: SlotFn;
  /** 标签 */
  tab?: SlotFn;
  /** 侧边栏 */
  sider?: SlotFn;
  /** 底部 */
  footer?: SlotFn;
};

const slots = defineSlots<Slots>();

/**
 * 创建布局CSS变量
 *
 * @returns 返回计算后的CSS变量对象
 */
const cssVars = computed(() => createLayoutCssVars(props));

/**
 * 计算是否显示头部
 *
 * @returns 如果有插槽并且头部可见，返回true；否则返回false
 */
const showHeader = computed(() => Boolean(slots.header) && props.headerVisible);

/**
 * 计算是否显示标签页
 *
 * @returns 如果有插槽并且标签页可见，返回true；否则返回false
 */
const showTab = computed(() => Boolean(slots.tab) && props.tabVisible);

/**
 * 计算是否显示侧边栏
 *
 * @returns 如果不是移动端且有插槽并且侧边栏可见，返回true；否则返回false
 */
const showSider = computed(() => !props.isMobile && Boolean(slots.sider) && props.siderVisible);

/**
 * 计算是否显示移动端侧边栏
 *
 * @returns 如果是移动端且有插槽并且侧边栏可见，返回true；否则返回false
 */
const showMobileSider = computed(() => props.isMobile && Boolean(slots.sider) && props.siderVisible);

/**
 * 计算是否显示页脚
 *
 * @returns 如果有插槽并且页脚可见，返回true；否则返回false
 */
const showFooter = computed(() => Boolean(slots.footer) && props.footerVisible);

/**
 * 计算是否使用 wrapper 滚动模式
 *
 * @returns 如果使用 wrapper 滚动模式，返回true；否则返回false
 */
const isWrapperScroll = computed(() => props.scrollMode === 'wrapper');

/**
 * 计算是否使用 content 滚动模式
 *
 * @returns 如果使用 content 滚动模式，返回true；否则返回false
 */
const isContentScroll = computed(() => props.scrollMode === 'content');

/**
 * 计算布局是否为竖直方向
 *
 * @returns 如果是竖直方向布局，返回true；否则返回false
 */
const isVertical = computed(() => props.mode === 'vertical');

/**
 * 计算布局是否为水平方向
 *
 * @returns 如果是水平方向布局，返回true；否则返回false
 */
const isHorizontal = computed(() => props.mode === 'horizontal');

/**
 * 计算是否固定头部和标签页
 *
 * @returns 如果固定头部或者是水平布局且使用 wrapper 滚动模式，返回true；否则返回false
 */
const fixedHeaderAndTab = computed(() => props.fixedTop || (isHorizontal.value && isWrapperScroll.value));

/**
 * 计算左侧间隔的类名
 *
 * @returns 根据侧边栏状态返回对应的类名
 */
const leftGapClass = computed(() => {
  if (!props.fullContent && showSider.value) {
    return props.siderCollapse ? style['left-gap_collapsed'] : style['left-gap'];
  }

  return '';
});

/**
 * 计算头部左侧间隔的类名
 *
 * @returns 根据布局方向返回对应的类名
 */
const headerLeftGapClass = computed(() => (isVertical.value ? leftGapClass.value : ''));

/**
 * 计算页脚左侧间隔的类名
 *
 * @returns 根据不同条件返回页脚左侧间隔的类名
 */
const footerLeftGapClass = computed(() => {
  const condition1 = isVertical.value;
  const condition2 = isHorizontal.value && isWrapperScroll.value && !props.fixedFooter;
  const condition3 = Boolean(isHorizontal.value && props.rightFooter);

  if (condition1 || condition2 || condition3) {
    return leftGapClass.value;
  }

  return '';
});

/**
 * 计算侧边栏的内边距类名
 *
 * @returns 根据头部和页脚的显示情况返回相应的内边距类名
 */
const siderPaddingClass = computed(() => {
  let cls = '';

  if (showHeader.value && !headerLeftGapClass.value) {
    cls += style['sider-padding-top'];
  }
  if (showFooter.value && !footerLeftGapClass.value) {
    cls += ` ${style['sider-padding-bottom']}`;
  }

  return cls;
});

/** 处理点击遮罩层事件 */
function handleClickMask() {
  emit('update:siderCollapse', true);
}
</script>

<template>
  <div class="relative h-full" :class="[commonClass]" :style="cssVars">
    <div
      :id="isWrapperScroll ? scrollElId : undefined"
      class="h-full flex flex-col"
      :class="[commonClass, scrollWrapperClass, { 'overflow-y-auto': isWrapperScroll }]"
    >
      <!-- 头部 -->
      <template v-if="showHeader">
        <header
          v-show="!fullContent"
          class="flex-shrink-0"
          :class="[
            style['layout-header'],
            commonClass,
            headerClass,
            headerLeftGapClass,
            { 'absolute top-0 left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="header"></slot>
        </header>
        <div
          v-show="!fullContent && fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-header-placement']]"
        ></div>
      </template>

      <!-- 标签 -->
      <template v-if="showTab">
        <div
          class="flex-shrink-0"
          :class="[
            style['layout-tab'],
            commonClass,
            tabClass,
            { 'top-[0]!': fullContent || !showHeader },
            leftGapClass,
            { 'absolute left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="tab"></slot>
        </div>
        <div
          v-show="fullContent || fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-tab-placement']]"
        ></div>
      </template>

      <!-- 侧边栏 -->
      <template v-if="showSider">
        <aside
          v-show="!fullContent"
          class="absolute left-0 top-0 h-full"
          :class="[
            commonClass,
            siderClass,
            siderPaddingClass,
            siderCollapse ? style['layout-sider_collapsed'] : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
      </template>

      <!-- 移动端侧边栏 -->
      <template v-if="showMobileSider">
        <aside
          class="absolute left-0 top-0 h-full w-0 bg-white"
          :class="[
            commonClass,
            mobileSiderClass,
            style['layout-mobile-sider'],
            siderCollapse ? 'overflow-hidden' : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
        <div
          v-show="!siderCollapse"
          class="absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)]"
          :class="[style['layout-mobile-sider-mask']]"
          @click="handleClickMask"
        ></div>
      </template>

      <!-- 主内容 -->
      <main
        :id="isContentScroll ? scrollElId : undefined"
        class="flex flex-col flex-grow"
        :class="[commonClass, contentClass, leftGapClass, { 'overflow-y-auto': isContentScroll }]"
      >
        <slot></slot>
      </main>

      <!-- 底部 -->
      <template v-if="showFooter">
        <footer
          v-show="!fullContent"
          class="flex-shrink-0"
          :class="[
            style['layout-footer'],
            commonClass,
            footerClass,
            footerLeftGapClass,
            { 'absolute left-0 bottom-0 w-full': fixedFooter }
          ]"
        >
          <slot name="footer"></slot>
        </footer>
        <div
          v-show="!fullContent && fixedFooter"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-footer-placement']]"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
