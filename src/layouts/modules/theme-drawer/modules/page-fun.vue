<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import {
  resetCacheStrategyOptions,
  themePageAnimationModeOptions,
  themeScrollModeOptions,
  themeTabModeOptions
} from '@/constants/app';
import { translateOptions } from '@/utils/common';
import SettingItem from '../components/setting-item.vue';

defineOptions({ name: 'PageFun' });

const themeStore = useThemeStore();

const layoutMode = computed(() => themeStore.layout.mode);

const isMixLayoutMode = computed(() => layoutMode.value.includes('mix'));

const isWrapperScrollMode = computed(() => themeStore.layout.scrollMode === 'wrapper');
</script>

<template>
  <ElDivider>{{ '页面功能'}}</ElDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-[12px]">
    <SettingItem key="1" :label="'重置缓存策略'">
      <ElSelect v-model="themeStore.resetCacheStrategy" size="small" class="w-[120px]">
        <ElOption
          v-for="{ label, value } in translateOptions(resetCacheStrategyOptions)"
          :key="value"
          :label="label"
          :value="value"
        />
      </ElSelect>
    </SettingItem>
    <SettingItem key="1" :label="'滚动模式'">
      <ElSelect v-model="themeStore.layout.scrollMode" size="small" class="w-[120px]">
        <ElOption
          v-for="{ label, value } in translateOptions(themeScrollModeOptions)"
          :key="value"
          :label="label"
          :value="value"
        />
      </ElSelect>
    </SettingItem>
    <SettingItem key="1-1" :label="'页面切换动画'">
      <ElSwitch v-model="themeStore.page.animate" />
    </SettingItem>
    <SettingItem v-if="themeStore.page.animate" key="1-2" :label="'页面切换动画类型'">
      <ElSelect v-model="themeStore.page.animateMode" size="small" class="w-[120px]">
        <ElOption
          v-for="{ label, value } in translateOptions(themePageAnimationModeOptions)"
          :key="value"
          :label="label"
          :value="value"
        />
      </ElSelect>
    </SettingItem>
    <SettingItem v-if="isWrapperScrollMode" key="2" :label="'固定头部和标签栏'">
      <ElSwitch v-model="themeStore.fixedHeaderAndTab" />
    </SettingItem>
    <SettingItem key="3" :label="'头部高度'">
      <ElInputNumber v-model="themeStore.header.height" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem key="4" :label="'显示面包屑'">
      <ElSwitch v-model="themeStore.header.breadcrumb.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.header.breadcrumb.visible" key="4-1" :label="'显示面包屑图标'">
      <ElSwitch v-model="themeStore.header.breadcrumb.showIcon" />
    </SettingItem>
    <SettingItem key="5" :label="'显示标签栏'">
      <ElSwitch v-model="themeStore.tab.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5-1" :label="'标签栏信息缓存'">
      <ElSwitch v-model="themeStore.tab.cache" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5-2" :label="'标签栏高度'">
      <ElInputNumber v-model="themeStore.tab.height" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5-3" :label="'标签栏风格'">
      <ElSelect v-model="themeStore.tab.mode" size="small" class="w-[120px]">
        <ElOption
          v-for="{ label, value } in translateOptions(themeTabModeOptions)"
          :key="value"
          :label="label"
          :value="value"
        />
      </ElSelect>
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical'" key="6-1" :label="'侧边栏宽度'">
      <ElInputNumber v-model="themeStore.sider.width" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical'" key="6-2" :label="'侧边栏折叠宽度'">
      <ElInputNumber v-model="themeStore.sider.collapsedWidth" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="6-3" :label="'混合布局侧边栏宽度'">
      <ElInputNumber v-model="themeStore.sider.mixWidth" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="6-4" :label="'混合布局侧边栏折叠宽度'">
      <ElInputNumber v-model="themeStore.sider.mixCollapsedWidth" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical-mix'" key="6-5" :label="'混合布局子菜单宽度'">
      <ElInputNumber v-model="themeStore.sider.mixChildMenuWidth" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem key="7" :label="'显示底部'">
      <ElSwitch v-model="themeStore.footer.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.footer.visible && isWrapperScrollMode" key="7-1" :label="'固定底部'">
      <ElSwitch v-model="themeStore.footer.fixed" />
    </SettingItem>
    <SettingItem v-if="themeStore.footer.visible" key="7-2" :label="'底部高度'">
      <ElInputNumber v-model="themeStore.footer.height" size="small" :step="1" class="w-[120px]" />
    </SettingItem>
    <SettingItem
      v-if="themeStore.footer.visible && layoutMode === 'horizontal-mix'"
      key="7-3"
      :label="'底部局右'"
    >
      <ElSwitch v-model="themeStore.footer.right" />
    </SettingItem>
    <SettingItem key="8" :label="'显示全屏水印'">
      <ElSwitch v-model="themeStore.watermark.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.watermark.visible" key="8-1" :label="'水印文本'">
      <ElInput
        v-model="themeStore.watermark.text"
        autosize
        type="text"
        size="small"
        class="w-[120px]"
        placeholder="SoybeanAdmin"
      />
    </SettingItem>

  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
