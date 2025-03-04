<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouterPush } from "@/hooks/common/router";
import { useForm, useFormRules } from "@/hooks/common/form";
import { useCaptcha } from "@/hooks/business/captcha";

defineOptions({ name: "Register" });

const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha();

interface FormModel {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const model = ref<FormModel>({
  phone: "",
  code: "",
  password: "",
  confirmPassword: "",
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.value.password),
  };
});

async function handleSubmit() {
  await validate();
  // request to register
  window.$message?.success("验证成功");
}
</script>

<template>
  <ElForm
    ref="formRef"
    :model="model"
    :rules="rules"
    size="large"
    :show-label="false"
    @keyup.enter="handleSubmit"
  >
    <ElFormItem prop="phone">
      <ElInput v-model="model.phone" :placeholder="'请输入手机号'" />
    </ElFormItem>
    <ElFormItem prop="code">
      <div class="w-full flex-y-center gap-[16px]">
        <ElInput v-model="model.code" :placeholder="'请输入验证码'" />
        <ElButton
          size="large"
          :disabled="isCounting"
          :loading="loading"
          @click="getCaptcha(model.phone)"
        >
          {{ label }}
        </ElButton>
      </div>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="model.password"
        type="password"
        show-password-on="click"
        :placeholder="'请输入密码'"
      />
    </ElFormItem>
    <ElFormItem prop="confirmPassword">
      <ElInput
        v-model="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="'请再次输入密码'"
      />
    </ElFormItem>
    <ElSpace direction="vertical" :size="18" fill class="w-full">
      <ElButton type="primary" size="large" round block @click="handleSubmit">
        确认
      </ElButton>
      <ElButton size="large" round @click="toggleLoginModule('pwd-login')">
        返回
      </ElButton>
    </ElSpace>
  </ElForm>
</template>

<style scoped></style>
