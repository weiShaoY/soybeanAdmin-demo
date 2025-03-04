<script setup lang="ts">
import { themeSchemaRecord } from '@/constants/app'

import { useThemeStore } from '@/store/modules/theme'

import { computed } from 'vue'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'DarkMode',
})

const themeStore = useThemeStore()

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto',
}

function handleSegmentChange(value: string | number) {
  themeStore.setThemeScheme(value as UnionKey.ThemeScheme)
}

function handleGrayscaleChange(value: boolean) {
  themeStore.setGrayscale(value)
}

function handleColourWeaknessChange(value: boolean) {
  themeStore.setColourWeakness(value)
}

const showSiderInverted = computed(() => !themeStore.darkMode && themeStore.layout.mode.includes('vertical'))
</script>

<template>
  <ElDivider>
    {{ '主题模式' }}
  </ElDivider>

  <div
    class="flex-col-stretch gap-[16px]"
  >
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
            <SvgIcon
              :icon="icons[key]"
              class="h-[23px] text-icon-small"
            />
          </template>
        </ElTabPane>
      </ElTabs>
    </div>

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

    <SettingItem
      label="灰色模式"
    >
      <ElSwitch
        v-model:model-value="themeStore.grayscale"
        :update:model-value="handleGrayscaleChange"
      />
    </SettingItem>

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
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
