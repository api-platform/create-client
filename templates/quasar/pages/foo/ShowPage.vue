<template>
  <Suspense>
    <{{titleUcFirst}}Show />

    <template #fallback>Loading...</template>
  </Suspense>
</template>

<script setup lang="ts">
import {{titleUcFirst}}Show from 'components/{{lc}}/ShowComponent.vue';
</script>
