<script setup lang="ts">
import type { Component } from 'vue'

import { loginModuleRecord } from '@/constants/app'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { getPaletteColorByNumber, mixColor } from '@sa/color'

import { computed } from 'vue'

import BindWechat from './modules/bind-wechat.vue'

import CodeLogin from './modules/code-login.vue'

import PwdLogin from './modules/pwd-login.vue'

import Register from './modules/register.vue'

import ResetPwd from './modules/reset-pwd.vue'

defineOptions({
  name: 'LoginPage',
})

const props = defineProps<Props>()

type Props = {

  /** The login module */
  module?: UnionKey.LoginModule
}

const appStore = useAppStore()

const themeStore = useThemeStore()

type LoginModule = {
  label: string
  component: Component
}

const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
  'pwd-login': {
    label: loginModuleRecord['pwd-login'],
    component: PwdLogin,
  },
  'code-login': {
    label: loginModuleRecord['code-login'],
    component: CodeLogin,
  },
  'register': {
    label: loginModuleRecord.register,
    component: Register,
  },
  'reset-pwd': {
    label: loginModuleRecord['reset-pwd'],
    component: ResetPwd,
  },
  'bind-wechat': {
    label: loginModuleRecord['bind-wechat'],
    component: BindWechat,
  },
}

const activeModule = computed(() => moduleMap[props.module || 'pwd-login'])

const bgThemeColor = computed(() =>
  themeStore.darkMode ? getPaletteColorByNumber(themeStore.themeColor, 600) : themeStore.themeColor,
)

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff'

  const ratio = themeStore.darkMode ? 0.5 : 0.2

  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio)
})
</script>

<template>
  <div
    class="relative size-full flex items-center justify-center overflow-hidden"
    :style="{ backgroundColor: bgColor }"
  >
    <WaveBg
      :theme-color="bgThemeColor"
    />

    <ElCard
      class="relative z-4 w-auto rd-[12px]"
    >
      <div
        class="w-[400px] lt-sm:w-[300px]"
      >
        <header
          class="flex-y-center justify-between"
        >
          <SystemLogo
            class="text-[64px] text-primary lt-sm:text-[48px]"
          />

          <h3
            class="text-[28px] text-primary font-medium lt-sm:text-[22px]"
          >
            {{ 'Soybean 管理系统' }}
          </h3>

          <div
            class="i-flex-col"
          >
            <ThemeSchemaSwitch
              :theme-schema="themeStore.themeScheme"
              :show-tooltip="false"
              class="text-[20px] lt-sm:text-[18px]"
              @switch="themeStore.toggleThemeScheme"
            />
          </div>
        </header>

        <main
          class="pt-[24px]"
        >
          <h3
            class="text-[18px] text-primary font-medium"
          >
            {{ activeModule.label }}
          </h3>

          <div
            class="pt-[24px]"
          >
            <Transition
              :name="themeStore.page.animateMode"
              mode="out-in"
              appear
            >
              <component
                :is="activeModule.component"
              />
            </Transition>
          </div>
        </main>
      </div>
    </ElCard>
  </div>
</template>

<style scoped></style>
