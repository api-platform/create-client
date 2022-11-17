<template>
  <q-inner-loading :showing="props.showing">
    <q-spinner size="50px" color="primary" />
  </q-inner-loading>
</template>

<script lang="ts" setup>
let props = defineProps<{
  showing: boolean;
}>();
</script>
