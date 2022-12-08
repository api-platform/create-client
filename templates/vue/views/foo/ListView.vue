<script setup lang="ts">
import List from "@/components/{{lc}}/{{titleUcFirst}}List.vue";
</script>

<template>
  <Suspense>
    <List />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
