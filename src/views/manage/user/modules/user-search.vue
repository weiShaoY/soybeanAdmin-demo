<script setup lang="ts">
import { enableStatusOptions, userGenderOptions } from '@/constants/business'

import { useForm, useFormRules } from '@/hooks/common/form'

import { translateOptions } from '@/utils'

import { computed } from 'vue'

defineOptions({
  name: 'UserSearch',
})

const emit = defineEmits<Emits>()

type Emits = {
  (e: 'reset'): void
  (e: 'search'): void
}

const { formRef, validate, restoreValidation } = useForm()

const model = defineModel<Api.SystemManage.UserSearchParams>('model', {
  required: true,
})

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules() // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone,
  }
})

async function reset() {
  await restoreValidation()
  emit('reset')
}

async function search() {
  await validate()
  emit('search')
}
</script>

<template>
  <ElCard
    class="card-wrapper"
  >
    <ElCollapse>
      <ElCollapseItem
        title="搜索"
        name="user-search"
      >
        <ElForm
          ref="formRef"
          :model="model"
          :rules="rules"
          label-position="right"
          :label-width="80"
        >
          <ElRow
            :gutter="24"
          >
            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="用户名"
                prop="userName"
              >
                <ElInput
                  v-model="model.userName"
                  placeholder="请输入用户名"
                />
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
              label="性别"
            >
              <ElFormItem
                label="性别"
                prop="userGender"
              >
                <ElSelect
                  v-model="model.userGender"
                  clearable
                  placeholder="请选择性别"
                >
                  <ElOption
                    v-for="(item, idx) in translateOptions(userGenderOptions)"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="昵称"
                prop="nickName"
              >
                <ElInput
                  v-model="model.nickName"
                  placeholder="请输入昵称"
                />
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="手机号"
                prop="userPhone"
              >
                <ElInput
                  v-model="model.userPhone"
                  placeholder="请输入手机号"
                />
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="邮箱"
                prop="userEmail"
              >
                <ElInput
                  v-model="model.userEmail"
                  placeholder="请输入邮箱"
                />
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="用户状态"
                prop="userStatus"
              >
                <ElSelect
                  v-model="model.userGender"
                  clearable
                  placeholder="请选择用户状态"
                >
                  <ElOption
                    v-for="{ label, value } in translateOptions(enableStatusOptions)"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="12"
              :md="24"
              :sm="24"
            >
              <ElSpace
                class="w-full justify-end"
                alignment="end"
              >
                <ElButton
                  @click="reset"
                >
                  <template
                    #icon
                  >
                    <icon-ic-round-refresh
                      class="text-icon"
                    />
                  </template>
                  {{ '重置' }}
                </ElButton>

                <ElButton
                  type="primary"
                  plain
                  @click="search"
                >
                  <template
                    #icon
                  >
                    <icon-ic-round-search
                      class="text-icon"
                    />
                  </template>
                  {{ '搜索' }}
                </ElButton>
              </ElSpace>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped></style>
