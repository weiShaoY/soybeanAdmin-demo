<script setup lang="ts">
import { enableStatusOptions } from '@/constants/business'

import { translateOptions } from '@/utils/common'

import { ref } from 'vue'

defineOptions({
  name: 'RoleSearch',
})

const emit = defineEmits<Emits>()

const activeName = ref(['role-search'])

type Emits = {
  (e: 'reset'): void
  (e: 'search'): void
}

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', {
  required: true,
})

function reset() {
  emit('reset')
}

function search() {
  emit('search')
}
</script>

<template>
  <ElCard
    class="card-wrapper"
  >
    <ElCollapse
      v-model="activeName"
    >
      <ElCollapseItem
        title="搜索"
        name="role-search"
      >
        <ElForm
          :model="model"
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
                label="角色名称"
                prop="roleName"
              >
                <ElInput
                  v-model="model.roleName"
                  placeholder="请输入角色名称"
                />
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="角色编码"
                prop="roleCode"
              >
                <ElInput
                  v-model="model.roleCode"
                  placeholder="请输入角色编码"
                />
              </ElFormItem>
            </ElCol>

            <ElCol
              :lg="6"
              :md="8"
              :sm="12"
            >
              <ElFormItem
                label="角色状态"
                prop="status"
              >
                <ElSelect
                  v-model="model.status"
                  placeholder="请选择角色状态"
                  clearable
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
              :lg="6"
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
