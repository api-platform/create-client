<template>
  <div>
    <q-ajax-bar ref="bar" position="top" color="accent" size="10px" skip-hijack />
    <q-toolbar class="q-my-md">
      <q-breadcrumbs class="q-mr-sm">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el
          v-for="(breadcrumb, idx) in breadcrumbList"
          :key="idx"
          :label="breadcrumb.label"
          :icon="breadcrumb.icon"
          :to="breadcrumb.to"
        />
      </q-breadcrumbs>
      <q-space />
      <div>
        <q-btn :label="$t('Submit')" color="primary" @click="onSendForm" />
        <q-btn :label="$t('Reset')" color="primary" flat class="q-ml-sm" @click="resetForm" />
      </div>
    </q-toolbar>

    <{{{titleUcFirst}}}Form ref="createForm" :values="item" :errors="violations" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import {{{titleUcFirst}}}Form from './Form';

const { mapGetters, mapActions } = createNamespacedHelpers('{{{lc}}}/create');

export default {
  components: {
    {{{titleUcFirst}}}Form,
  },

  created() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
  },

  data() {
    return {
      item: {},
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

    isLoading(val) {
      if (val) {
        this.$refs.bar.start();
      } else {
        this.$refs.bar.stop();
      }
    },

    error(message) {
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('Close'),
        });
    },
  },

  methods: {
    ...mapActions(['create']),

    onSendForm() {
      this.create(this.item);
    },

    resetForm() {
      this.item = {};
    },
  },
};
</script>
