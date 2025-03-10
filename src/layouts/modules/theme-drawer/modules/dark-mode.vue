<script setup lang="ts">
import { themeSchemaRecord } from '@/constants/app'

import { useThemeStore } from '@/store/modules/theme'

import { computed } from 'vue'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'DarkMode',
})

// 获取主题配置 store
const themeStore = useThemeStore()

// 定义不同主题模式的图标
const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny', // 明亮模式图标
  dark: 'material-symbols:nightlight-rounded', // 暗黑模式图标
  auto: 'material-symbols:hdr-auto', // 自动模式图标
}

/**
 * 处理主题模式切换
 * @param value 切换的值，可能是字符串或数字
 */
function handleSegmentChange(value: string | number) {
  themeStore.setThemeScheme(value as UnionKey.ThemeScheme)
}

/**
 * 处理灰色模式开关
 * @param value 是否启用灰色模式
 */
function handleGrayscaleChange(value: boolean) {
  themeStore.setGrayscale(value)
}

/**
 * 处理色弱模式开关
 * @param value 是否启用色弱模式
 */
function handleColourWeaknessChange(value: boolean) {
  themeStore.setColourWeakness(value)
}

/**
 * 计算属性，判断是否显示深色侧边栏设置项
 * 如果是暗黑模式且布局为垂直模式时，显示该项
 */
const showSiderInverted = computed(() => !themeStore.darkMode && themeStore.layout.mode.includes('vertical'))
</script>

<template>
  <!-- 主题模式选择器 -->
  <ElDivider>
    {{ '主题模式' }}
  </ElDivider>

  <div
    class="flex-col-stretch gap-[16px]"
  >
    <!-- 切换不同的主题模式 -->
    <div
      class="i-flex-center"
    >
      <ElTabs
        v-model="themeStore.themeScheme"
        type="border-card"
        class="segment"
        @tab-change="handleSegmentChange"
      >
        <ElTabPane
          v-for="(_, key) in themeSchemaRecord"
          :key="key"
          :name="key"
        >
          <template
            #label
          >
            <!-- 为每个主题模式显示相应的图标 -->
            <SvgIcon
              :icon="icons[key]"
              class="h-[23px] text-icon-small"
            />
          </template>
        </ElTabPane>
      </ElTabs>
    </div>

    <!-- 动态显示深色侧边栏设置 -->
    <Transition
      name="sider-inverted"
    >
      <SettingItem
        v-if="showSiderInverted"
        label="深色侧边栏"
      >
        <ElSwitch
          v-model="themeStore.sider.inverted"
        />
      </SettingItem>
    </Transition>

    <!-- 灰色模式开关 -->
    <SettingItem
      label="灰色模式"
    >
      <ElSwitch
        v-model:model-value="themeStore.grayscale"
        :update:model-value="handleGrayscaleChange"
      />
    </SettingItem>

    <!-- 色弱模式开关 -->
    <SettingItem
      label="色弱模式"
    >
      <ElSwitch
        v-model:model-value="themeStore.colourWeakness"
        :update:model-value="handleColourWeaknessChange"
      />
    </SettingItem>
  </div>
</template>

<style lang="scss" scoped>
/* 设置深色侧边栏切换动画效果 */
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
