<template>
  <Suspense>
    <{{titleUcFirst}}Update />

    <template #fallback>Loading...</template>
  </Suspense>
</template>

<script setup lang="ts">
import {{titleUcFirst}}Update from 'components/{{lc}}/UpdateComponent.vue';
</script>
