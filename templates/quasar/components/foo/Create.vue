<template>
  <div>
    <q-toolbar class="q-my-md">
      <q-breadcrumbs class="q-mr-sm">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el
          v-for="(breadcrumb, idx) in breadcrumbList"
          :key="idx"
          :label="$t(breadcrumb.label)"
          :icon="breadcrumb.icon"
          :to="breadcrumb.to"
        />
      </q-breadcrumbs>
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
{{#if formContainsDate}}
import { extractDate } from '../../utils/dates';
{{/if}}
const { mapGetters, mapActions } = createNamespacedHelpers('{{{lc}}}/create');

export default {
  name: '{{{titleUcFirst}}}Create',
  components: {
    {{{titleUcFirst}}}Form,
  },

  created() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
  },

  data() {
    return {
      item: {
        {{#each formFields}}
          {{#compare type "==" "time" }}
        {{{name}}}: date.formatDate(Date.now(), 'HH:mm'),
          {{/compare}}
          {{#compare type "==" "date" }}
        {{{name}}}: this.formatDateTime(Date.now(), 'short'),
          {{/compare}}
          {{#compare type "==" "dateTime" }}
        {{{name}}}: this.formatDateTime(Date.now(), 'long'),
          {{/compare}}
        {{/each}}
      },
      breadcrumbList: [],
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
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },
  },

  methods: {
    ...mapActions(['create']),
    {{#if formContainsDate}}
    
    formatDateTime(val, format) {
      return val ? this.$d(extractDate(val), format) : '';
    },
    {{/if}}

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
