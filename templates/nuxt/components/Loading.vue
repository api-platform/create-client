<template>
  <div v-if="visible"
       class="spinner-border"
       role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
};
</script>
