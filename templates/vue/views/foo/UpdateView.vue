<script setup lang="ts">
import {{titleUcFirst}}Update from "@/components/{{lc}}/Update.vue";
</script>

<template>
  <Suspense>
    <{{titleUcFirst}}Update />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
