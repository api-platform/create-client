<script setup lang="ts">
import Update from "@/components/{{lc}}/{{titleUcFirst}}Update.vue";
</script>

<template>
  <Suspense>
    <Update />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
