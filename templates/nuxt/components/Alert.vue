<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :multi-line="true"
    :timeout="timeout"
    right
    top
  >
    \{{ text }}
    <template v-if="subText">
      <p>\{{ subText }}</p>
    </template>

    <template v-slot:action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
  computed: {
    ...mapFields('notifications', ['color', 'show', 'subText', 'text', 'timeout'])
  },

  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>
