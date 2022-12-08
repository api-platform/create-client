<script setup lang="ts">
import Create from "@/components/{{lc}}/{{titleUcFirst}}Create.vue";
</script>

<template>
  <Suspense>
    <Create />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
