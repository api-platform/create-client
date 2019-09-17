<template>
  <div>
    <q-toolbar class="q-my-md">
      <Breadcrumb :values="$route.meta.breadcrumb" />
      <q-space />
      <div>
        <q-btn :label="$t('{{{labels.submit}}}')" color="primary" @click="onSendForm" />
        <q-btn :label="$t('{{{labels.reset}}}')" color="primary" flat class="q-ml-sm" @click="resetForm" />
      </div>
    </q-toolbar>
    <{{{titleUcFirst}}}Form ref="createForm" :values="item" :errors="violations" />
    <q-inner-loading :showing="isLoading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import {{{titleUcFirst}}}Form from './Form';
const { mapGetters, mapActions } = createNamespacedHelpers('{{{lc}}}/create');
import { error } from '../../utils/notify';
import Breadcrumb from '../common/Breadcrumb.vue';

export default {
  name: '{{{titleUcFirst}}}Create',
  components: {
    {{{titleUcFirst}}}Form,
    Breadcrumb,
  },

  data() {
    return {
      item: {
        {{#each formFields}}
          {{#compare type "==" "time" }}
        {{{name}}}: '',
          {{/compare}}
          {{#compare type "==" "date" }}
        {{{name}}}: new Date().toISOString(),,
          {{/compare}}
          {{#compare type "==" "dateTime" }}
        {{{name}}}: new Date().toISOString(),
          {{/compare}}
        {{/each}}
      },
    };
  },

  computed: mapGetters(['error', 'isLoading', 'created', 'violations']),

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    created: function(created) {
      if (!created) {
        return;
      }

      this.$router.push({ name: '{{{titleUcFirst}}}Update', params: { id: created['@id'] } });
    },

    error(message) {
      message && error(message, this.$t('{{{labels.close}}}'));
    },
  },

  methods: {
    ...mapActions(['create']),
    
    onSendForm() {
      this.$refs.createForm.$children[0].validate().then(success => {
        if (success) {
          this.create(this.item);
        }
      });
    },

    resetForm() {
      this.item = {};
    },
  },
};
</script>
