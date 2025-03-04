<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'ProjectNews' });

type NewsItem = {
  id: number;
  content: string;
  time: string;
};

const newses = computed<NewsItem[]>(() => [
  { id: 1, content: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!', time: '2021-05-28 22:22:22' },
  { id: 2, content: 'Yanbowe 向 soybean-admin 提交了一个bug，多标签栏不会自适应。', time: '2021-10-27 10:24:54' },
  { id: 3, content: 'Soybean 准备为 soybean-admin 的发布做充分的准备工作!', time: '2021-10-31 22:43:12' },
  { id: 4, content: 'Soybean 正在忙于为soybean-admin写项目说明文档！', time: '2021-11-03 20:33:31' },
  { id: 5, content: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！', time: '2021-11-07 22:45:32' }
]);
</script>

<template>
  <ElCard class="card-wrapper">
    <template #header>
      <ElRow>
        <ElCol :span="18">项目动态</ElCol>
        <ElCol :span="6" class="text-right">
          <a class="text-primary" href="javascript:;">更多动态</a>
        </ElCol>
      </ElRow>
    </template>
    <ElTimeline>
      <ElTimelineItem v-for="item in newses" :key="item.id" :timestamp="item.time" placement="top">
        <ElSpace>
          <SoybeanAvatar class="size-[48px]!" />
          <p>{{ item.content }}</p>
        </ElSpace>
      </ElTimelineItem>
    </ElTimeline>
  </ElCard>
</template>

<style scoped></style>
