<script setup lang="ts">
import CaptchaVerification from './modules/captcha-verification.vue';
import BrowserVisibilityRequest from './modules/browser-visibility-request.vue';
import PollingRequest from './modules/polling-request.vue';
import NetworkToggleRequest from './modules/network-toggle-request.vue';
import CrossComponentRequest from './modules/cross-component-request.vue';
</script>

<template>
  <ElSpace direction="vertical" fill :size="16">
    <ElCard :header="'发送验证码'" class="card-wrapper">
      <CaptchaVerification class="w-1/3" />
    </ElCard>
    <ElCard :header="'自动请求'" class="card-wrapper">
      <ElSpace :wrap="false">
        <BrowserVisibilityRequest />
        <PollingRequest />
        <NetworkToggleRequest />
      </ElSpace>
    </ElCard>
    <ElCard :header="'跨组件触发请求'" class="card-wrapper">
      <CrossComponentRequest />
    </ElCard>
  </ElSpace>
</template>

<style scoped></style>
