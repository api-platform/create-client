<script setup lang="ts">
import {{titleUcFirst}}Show from "@/components/{{lc}}/EntityShow.vue";
</script>

<template>
  <Suspense>
    <{{titleUcFirst}}Show />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
