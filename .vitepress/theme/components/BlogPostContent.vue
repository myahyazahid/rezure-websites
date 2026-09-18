<script setup lang="ts">
/**
 * Inline component that renders raw HTML blog content.
 * Used inside the dynamic-route markdown so that VitePress
 * treats the post body as actual markup, not escaped text.
 */
defineProps<{ content: string }>()
</script>

<template>
  <div v-html="content" />
</template>
