<template>
  <div v-if="show"
       :class="alertClasses"
       role="alert">
    <span v-if="color == 'danger'"
      class="fa fa-exclamation-triangle"
      aria-hidden="true">
      \{{ text }}</span>
    <span v-else>\{{ text }}</span>

    <template v-if="subText">
      <p>\{{ subText }}</p>
    </template>
    <button @click.native="close"
            aria-label="Close"
            type="button"
            class="close"
            data-dismiss="alert">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
  computed: {
    ...mapFields('notifications', ['color', 'show', 'subText', 'text', 'timeout']),
    alertClasses() {
      const classes = ['alert', 'alert-dismissible', 'fade', 'show'];

      classes.push(`alert-${this.color}`);

      return classes;
    }
  },

  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>
