<script setup lang="ts">
import { fetchCustomBackendError } from '@/service-alova/api';

async function logout() {
  await fetchCustomBackendError('8888', '用户状态失效，请重新登录');
}

async function logoutWithModal() {
  await fetchCustomBackendError('7777', '用户状态失效，请重新登录');
}

async function refreshToken() {
  await fetchCustomBackendError('9999', 'token已过期');
}

async function handleRepeatedMessageError() {
  await Promise.all([
    fetchCustomBackendError('2222', '自定义请求错误 1'),
    fetchCustomBackendError('2222', '自定义请求错误 1'),
    fetchCustomBackendError('2222', '自定义请求错误 1'),
    fetchCustomBackendError('3333', '自定义请求错误 2'),
    fetchCustomBackendError('3333', '自定义请求错误 2'),
    fetchCustomBackendError('3333', '自定义请求错误 2')
  ]);
}

async function handleRepeatedModalError() {
  await Promise.all([
    fetchCustomBackendError('7777', '用户状态失效，请重新登录'),
    fetchCustomBackendError('7777', '用户状态失效，请重新登录'),
    fetchCustomBackendError('7777', '用户状态失效，请重新登录')
  ]);
}
</script>

<template>
  <ElSpace direction="vertical" fill :size="16">
    <ElCard :header="'请求失败后登出用户'" class="card-wrapper">
      <ElButton @click="logout">{{ '触发' }}</ElButton>
    </ElCard>
    <ElCard :header="'请求失败后弹出模态框再登出用户'" class="card-wrapper">
      <ElButton @click="logoutWithModal">{{ '触发' }}</ElButton>
    </ElCard>
    <ElCard :header="'请求的token已过期，刷新token'" class="card-wrapper">
      <ElButton @click="refreshToken">{{ '触发' }}</ElButton>
    </ElCard>
    <ElCard :header="'重复请求错误只出现一次'" class="card-wrapper">
      <ElButton @click="handleRepeatedMessageError">{{ '重复请求错误' }}(Message)</ElButton>
      <ElButton class="ml-[12px]" @click="handleRepeatedModalError">
        {{ '重复请求错误' }}(Modal)
      </ElButton>
    </ElCard>
  </ElSpace>
</template>

<style scoped></style>
