<script setup lang="ts">
import { fetchGetAllPages, fetchGetMenuTree } from '@/service/api'

import {
  computed,
  shallowRef,
  watch,
} from 'vue'

defineOptions({
  name: 'MenuAuthModal',
})

const props = defineProps<Props>()

type Props = {

  /** the roleId */
  roleId: number
}

const visible = defineModel<boolean>('visible', {
  default: false,
})

function closeModal() {
  visible.value = false
}

const title = computed(() => '编辑' + '菜单权限')

const home = shallowRef('')

async function getHome() {
  console.log(props.roleId)

  home.value = 'home'
}

const pages = shallowRef<string[]>([])

async function getPages() {
  const { error, data } = await fetchGetAllPages()

  if (!error) {
    pages.value = data
  }
}

const pageSelectOptions = computed(() => {
  const opts: CommonType.Option[] = pages.value.map(page => ({
    label: page,
    value: page,
  }))

  return opts
})

const tree = shallowRef<Api.SystemManage.MenuTree[]>([])

async function getTree() {
  const { error, data } = await fetchGetMenuTree()

  if (!error) {
    tree.value = data
  }
}

const checks = shallowRef<number[]>([])

async function getChecks() {
  console.log(props.roleId)

  // request
  checks.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
}

function checkChange(val: number) {
  const idx = checks.value.indexOf(val)

  if (idx === -1) {
    checks.value.push(val)
  }
  else {
    checks.value.splice(idx, 1)
  }
}

function handleSubmit() {
  console.log(checks.value, props.roleId)

  // request

  window.$message?.success?.('修改成功')

  closeModal()
}

function init() {
  getHome()
  getPages()
  getTree()
  getChecks()
}

watch(visible, (val) => {
  if (val) {
    init()
  }
})
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="title"
    preset="card"
    class="w-[480px]"
  >
    <div
      class="flex-y-center gap-[16px] pb-[12px]"
    >
      <div>
        首页
      </div>

      <ElSelect
        v-model="home"
        :options="pageSelectOptions"
        size="small"
        class="w-[160px]"
      >
        <ElOption
          v-for="{ value, label } in pageSelectOptions"
          :key="value"
          :value="value"
          :label="label"
        />
      </ElSelect>
    </div>

    <ElTree
      v-model:checked-keys="checks"
      :data="tree"
      node-key="id"
      show-checkbox
      class="h-[280px]"
      :default-checked-keys="checks"
      @check-change="checkChange"
    />

    <template
      #footer
    >
      <ElSpace
        class="w-full justify-end"
      >
        <ElButton
          size="small"
          class="mt-[16px]"
          @click="closeModal"
        >
          取消
        </ElButton>

        <ElButton
          type="primary"
          size="small"
          class="mt-[16px]"
          @click="handleSubmit"
        >
          确认
        </ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<style scoped></style>
