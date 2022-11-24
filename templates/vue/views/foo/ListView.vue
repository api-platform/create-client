<script setup lang="ts">
import {{titleUcFirst}}List from "@/components/{{lc}}/ListComponent.vue";
</script>

<template>
  <Suspense>
    <{{titleUcFirst}}List />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
