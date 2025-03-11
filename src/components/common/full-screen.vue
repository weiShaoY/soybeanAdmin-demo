<script setup lang="ts">

defineOptions({
  name: 'FullScreen',
})

defineProps<Props>()

type Props = {

  /**
   *  是否全屏
   */
  full?: boolean
}

</script>

<template>
  <ButtonIcon
    :key="String(full)"
    :tooltip-content="full ? '退出全屏' : '全屏'"
  >

    <icon-gridicons-fullscreen-exit
      v-if="full"
    />

    <icon-gridicons-fullscreen
      v-else
    />
  </ButtonIcon>
</template>

<style scoped></style>
