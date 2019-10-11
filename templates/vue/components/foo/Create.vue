<template>
  <div>
    <h1>New {{{title}}}</h1>

    <div
      v-if="isLoading"
      class="alert alert-info"
      role="status">Loading...</div>
    <div
      v-if="error"
      class="alert alert-danger"
      role="alert">
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true">\{{ error }}</span>
    </div>

    <{{{titleUcFirst}}}Form
      :handle-submit="onSendForm"
      :values="item"
      :errors="violations" />

    <router-link
      :to="{ name: '{{{titleUcFirst}}}List' }"
      class="btn btn-default">Back to list</router-link>
  </div>
</template>

<script>
import { createHelpers } from 'vuex-map-fields';
import { mapActions } from 'vuex';
import {{{titleUcFirst}}}Form from './Form';

const { mapFields } = createHelpers({
    getterType: '{{{lc}}}/create/getField',
    mutationType: '{{{lc}}}/create/updateField',
});

export default {
  components: {
    {{{titleUcFirst}}}Form,
  },

  data () {
    return {
      item: {},
    };
  },

  computed: {
    ...mapFields([
      'error',
      'isLoading',
      'created',
      'violations',
    ]),
  },

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    created: function(created) {
      if (!created) {
        return;
      }

      this.$router.push({ name: '{{{titleUcFirst}}}Update', params: { id: created['@id'] } });
    }
  },

  methods: {
    ...mapActions('{{{lc}}}/create', [
      'create',
    ]),

    onSendForm () {
      this.create(this.item);
    },
  },
};
</script>
