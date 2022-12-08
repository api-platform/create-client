<script setup lang="ts">
import Show from "@/components/{{lc}}/{{titleUcFirst}}Show.vue";
</script>

<template>
  <Suspense>
    <Show />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
