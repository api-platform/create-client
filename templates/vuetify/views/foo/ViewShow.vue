<template>
  <Suspense>
    <Show />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import Show from "@/components/{{lc}}/{{titleUcFirst}}Show.vue";
</script>
