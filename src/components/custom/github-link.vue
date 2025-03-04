<script setup lang="ts">
import WebSiteLink from './web-site-link.vue'

defineOptions({
  name: 'GithubLink',
})

defineProps<Props>()

type Props = {

  /** github link */
  link: string
}

</script>

<template>
  <WebSiteLink
    label="github地址："
    :link="link"
  />
</template>

<style scoped></style>
