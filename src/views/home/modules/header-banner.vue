<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

import { useAuthStore } from '@/store/modules/auth'

import { computed } from 'vue'

defineOptions({
  name: 'HeaderBanner',
})

const appStore = useAppStore()

const authStore = useAuthStore()

const gap = computed(() => (appStore.isMobile ? 0 : 16))

type StatisticData = {
  id: number
  title: string
  value: number
}

const statisticData = computed<StatisticData[]>(() => [
  {
    id: 0,
    title: '项目数',
    value: 25,
  },
  {
    id: 1,
    title: '待办',
    value: 4,
    formatter: (val: number) => `${val}/${16}`,
  },
  {
    id: 2,
    title: '消息',
    value: 12,
  },
])
</script>

<template>
  <ElCard
    class="card-wrapper"
  >
    <ElRow
      :gutter="gap"
      class="px-[8px]"
    >
      <ElCol
        :md="18"
        :sm="24"
      >
        <div
          class="flex-y-center"
        >
          <div
            class="size-[72px] shrink-0 overflow-hidden rd-1/2"
          >
            <img
              src="@/assets/imgs/soybean.jpg"
              class="size-full"
            >
          </div>

          <div
            class="pl-[12px]"
          >
            <h3
              class="text-[18px] font-semibold"
            >
              {{ `早安，${authStore.userInfo.userName}, 今天又是充满活力的一天!` }}
            </h3>

            <p
              class="text-[#999] leading-[30px]"
            >
              今日多云转晴，20℃ - 25℃!
            </p>
          </div>
        </div>
      </ElCol>

      <ElCol
        :md="6"
        :sm="24"
      >
        <ElSpace
          direction="horizontal"
          class="w-full justify-end"
          :size="24"
        >
          <ElStatistic
            v-for="item in statisticData"
            :key="item.id"
            class="whitespace-nowrap"
            v-bind="item"
          />
        </ElSpace>
      </ElCol>
    </ElRow>
  </ElCard>
</template>

<style scoped></style>
