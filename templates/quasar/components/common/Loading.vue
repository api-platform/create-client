<template>
  <q-inner-loading :showing="showing">
    <q-spinner size="50px" color="primary" />
  </q-inner-loading>
</template>

<script>
export default {
  props: {
    showing: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
