<script setup lang="ts">
import {{titleUcFirst}}Create from "@/components/{{lc}}/EntityCreate.vue";
</script>

<template>
  <Suspense>
    <{{titleUcFirst}}Create />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
