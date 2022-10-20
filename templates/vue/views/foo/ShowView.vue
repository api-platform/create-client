<script setup lang="ts">
import {{{titleUcFirst}}}Show from "@/components/{{{lc}}}/Show.vue";
</script>

<template>
  <Suspense>
    <{{{titleUcFirst}}}Show />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
