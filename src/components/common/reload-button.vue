<script setup lang="ts">

defineOptions({
  name: 'ReloadButton',
})

defineProps<Props>()

type Props = {
  loading?: boolean
}

</script>

<template>
  <ButtonIcon
    tooltip-content="刷新页面"
  >
    <icon-ant-design-reload-outlined
      :class="{ 'animate-spin animate-duration-750': loading }"
    />
  </ButtonIcon>
</template>

<style scoped></style>
