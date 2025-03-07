<script setup lang="ts">

/** 组件的属性 */
type Props = {

  /** 菜单项 */
  item: App.Global.Menu
}

const { item } = defineProps<Props>()

/** 判断是否有子菜单 */
const hasChildren = item.children && item.children.length > 0
</script>

<template>
  <ElSubMenu
    v-if="hasChildren"
    :index="item.key"
  >
    <template
      #title
    >
      <ElIcon>
        <component
          :is="item.icon"
        />
      </ElIcon>

      <span
        class="ib-ellipsis"
      >
        {{ item.label }}
      </span>

    </template>

    <MenuItem
      v-for="child in item.children"
      :key="child.key"
      :item="child"
      :index="child.key"
    />
  </ElSubMenu>

  <ElMenuItem
    v-else
  >
    <ElIcon>
      <component
        :is="item.icon"
      />
    </ElIcon>

    <span
      class="ib-ellipsis"
    >
      {{ item.label }}
    </span>
  </ElMenuItem>
</template>

<style scoped>
.ib-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
</style>
