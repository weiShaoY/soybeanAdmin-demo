<script setup lang="ts">
defineOptions({
  name: 'SettingItem',
})

defineProps<Props>()

type Props = {

  /**
   * 标签文本
   * 该属性用于指定显示的标签内容
   */
  label: string
}

</script>

<template>
  <div
    class="w-full flex-y-center justify-between"
  >
    <div>
      <span
        class="pr-[8px] text-base-text"
      >{{ label }}</span>

      <slot
        name="suffix"
      />
    </div>

    <slot />
  </div>
</template>

<style scoped></style>
