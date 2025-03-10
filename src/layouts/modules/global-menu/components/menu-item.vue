<script setup lang="ts">
/**
 * 定义传入组件的参数类型
 * item: App.Global.Menu 表示菜单项
 */
type Props = {

  /**
   *  菜单项
   */
  item: App.Global.Menu
}

// 从传入参数中解构出 item
const { item } = defineProps<Props>()

/**
 *  检查菜单项是否有子菜单
 */
const hasChildren = item.children && item.children.length > 0
</script>

<template>
  <!-- 如果有子菜单，使用 ElSubMenu 组件 -->
  <ElSubMenu
    v-if="hasChildren"
    :index="item.key"
  >
    <template
      #title
    >
      <!-- 菜单项图标 -->
      <ElIcon>
        <component
          :is="item.icon"
        />
      </ElIcon>

      <!-- 菜单项标签 -->
      <span
        class="ib-ellipsis"
      >{{ item.label }}</span>
    </template>

    <!-- 遍历子菜单项 -->
    <MenuItem
      v-for="child in item.children"
      :key="child.key"
      :item="child"
      :index="child.key"
    />
  </ElSubMenu>

  <!-- 如果没有子菜单，使用 ElMenuItem 组件 -->
  <ElMenuItem
    v-else
  >
    <!-- 菜单项图标 -->
    <ElIcon>
      <component
        :is="item.icon"
      />
    </ElIcon>

    <!-- 菜单项标签 -->
    <span
      class="ib-ellipsis"
    >{{ item.label }}</span>
  </ElMenuItem>
</template>

<style scoped>
/* 定义菜单项标签的样式，文本溢出显示省略号 */
.ib-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
</style>
