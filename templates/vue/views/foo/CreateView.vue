<script setup lang="ts">
import {{{titleUcFirst}}}Create from "@/components/{{{lc}}}/Create.vue";
</script>

<template>
  <Suspense>
    <{{{titleUcFirst}}}Create />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
