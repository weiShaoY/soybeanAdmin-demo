<script setup lang="ts">
import { useFormRules, useForm as useUIForm } from '@/hooks/common/form'

import { sendCaptcha, verifyCaptcha } from '@/service-alova/api'

import {
  actionDelegationMiddleware,
  useCaptcha,
  useForm,
} from '@sa/alova/client'

import { computed } from 'vue'

defineOptions({
  name: 'CaptchaVerification',
})

const { loading, send, countdown } = useCaptcha(sendCaptcha, {
  middleware: actionDelegationMiddleware('captcha:send'),
})

const label = computed(() => {
  return countdown.value > 0
    ? `${countdown.value}秒后重新获取`
    : '获取验证码'
})

const {
  form,
  loading: submiting,
  send: submit,
} = useForm(formData => verifyCaptcha(formData.phone, formData.code), {
  initialForm: {
    phone: '',
    code: '',
  },
})

const { formRef, validate } = useUIForm()

const rules = computed<Record<keyof typeof form.value, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules()

  return {
    phone: formRules.phone,
    code: formRules.code,
  }
})

async function handleSubmit() {
  await validate()
  await submit()

  // request
  window.$message?.success('验证成功')
}
</script>

<template>
  <ElForm
    ref="formRef"
    :model="form"
    :rules="rules"
    size="large"
    :show-label="false"
    @keyup.enter="handleSubmit"
  >
    <ElFormItem
      path="phone"
    >
      <ElInput
        v-model="form.phone"
        placeholder="请输入手机号"
        :maxlength="11"
      />
    </ElFormItem>

    <ElFormItem
      path="code"
    >
      <div
        class="w-full flex-y-center gap-[16px]"
      >
        <ElInput
          v-model="form.code"
          placeholder="请输入验证码"
        />

        <ElButton
          size="large"
          :disabled="countdown > 0"
          :loading="loading"
          @click="send(form.phone)"
        >
          {{ label }}
        </ElButton>
      </div>
    </ElFormItem>

    <ElSpace
      vertical
      :size="18"
      class="w-full"
    >
      <ElButton
        type="primary"
        size="large"
        round
        block
        :loading="submiting"
        @click="handleSubmit"
      >
        确认
      </ElButton>
    </ElSpace>
  </ElForm>
</template>

<style scoped></style>
