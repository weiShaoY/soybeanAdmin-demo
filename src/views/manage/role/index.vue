<script setup lang="tsx">
import { enableStatusRecord } from '@/constants/business'

import { useTable, useTableOperate } from '@/hooks/common/table'

import { fetchGetRoleList } from '@/service/api'

import {
  ElButton,
  ElPopconfirm,
  ElTag,
} from 'element-plus'

import RoleOperateDrawer from './modules/role-operate-drawer.vue'

import RoleSearch from './modules/role-search.vue'

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams,
} = useTable({
  apiFn: fetchGetRoleList,
  apiParams: {
    current: 1,
    size: 10,
    status: undefined,
    roleName: undefined,
    roleCode: undefined,
  },
  columns: () => [
    {
      type: 'selection',
      width: 48,
    },
    {
      prop: 'index',
      label: '序号',
      width: 64,
    },
    {
      prop: 'roleName',
      label: '角色名称',
      minWidth: 120,
    },
    {
      prop: 'roleCode',
      label: '角色编码',
      minWidth: 120,
    },
    {
      prop: 'roleDesc',
      label: '角色描述',
      minWidth: 120,
    },
    {
      prop: 'status',
      label: '角色状态',
      width: 100,
      formatter: (row) => {
        if (row.status === undefined) {
          return ''
        }

        const tagMap: Record<Api.Common.EnableStatus, UI.ThemeColor> = {
          1: 'success',
          2: 'warning',
        }

        const label = enableStatusRecord[row.status]

        return <ElTag type={tagMap[row.status]}>{label}</ElTag>
      },
    },
    {
      prop: 'operate',
      label: '操作',
      width: 130,
      formatter: row => (
        <div class="flex-center">
          <ElButton type="primary" plain size="small" onClick={() => edit(row.id)}>
            编辑
          </ElButton>
          <ElPopconfirm title="确认删除吗？" onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton type="danger" plain size="small">
                  删除
                </ElButton>
              ),
            }}
          </ElPopconfirm>
        </div>
      ),
    },
  ],
})

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted,

  // closeDrawer
} = useTableOperate(data, getData)

async function handleBatchDelete() {
  console.log(checkedRowKeys.value)

  // request

  onBatchDeleted()
}

function handleDelete(id: number) {
  // request

  console.log(id)

  onDeleted()
}

function edit(id: number) {
  handleEdit(id)
}
</script>

<template>
  <div
    class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto"
  >
    <RoleSearch
      v-model:model="searchParams"
      @reset="resetSearchParams"
      @search="getDataByPage"
    />

    <ElCard
      header="角色列表"
      class="sm:flex-1-hidden card-wrapper"
      body-class="ht50"
    >
      <template
        #header-extra
      >
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>

      <div
        class="h-[calc(100%-50px)]"
      >
        <ElTable
          v-loading="loading"
          height="100%"
          border
          class="sm:h-full"
          :data="data"
          row-key="id"
          @selection-change="checkedRowKeys = $event"
        >
          <ElTableColumn
            v-for="col in columns"
            :key="col.prop"
            v-bind="col"
          />
        </ElTable>

        <div
          class="mt-20px flex justify-end"
        >
          <ElPagination
            v-if="mobilePagination.total"
            layout="total,prev,pager,next,sizes"
            v-bind="mobilePagination"
            @current-change="mobilePagination['current-change']"
            @size-change="mobilePagination['size-change']"
          />
        </div>
      </div>

      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
