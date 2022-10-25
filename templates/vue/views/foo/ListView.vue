<script setup lang="ts">
import {{titleUcFirst}}List from "@/components/{{lc}}/EntityList.vue";
</script>

<template>
  <Suspense>
    <{{titleUcFirst}}List />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
