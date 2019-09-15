<template>
  <div>
    <q-toolbar class="q-my-md">
      <q-breadcrumbs class="q-mr-sm">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el
          v-for="(breadcrumb, idx) in breadcrumbList"
          :key="idx"
          :label="
            $t(breadcrumb.label) +
              ' ' +
              (idx === breadcrumbList.length - 1 && item && item['@id'] ? item['@id'] : '')
          "
          :icon="breadcrumb.icon"
          :to="breadcrumb.to"
        />
      </q-breadcrumbs>
      <q-space />
      <div>
        <q-btn :label="$t('{{{labels.submit}}}')" color="primary" @click="onSendForm" />
        <q-btn :label="$t('{{{labels.reset}}}')" color="primary" flat class="q-ml-sm" @click="resetForm" />
        <q-btn :label="$t('{{{labels.delete}}}')" color="primary" flat class="q-ml-sm" @click="del" />
      </div>
    </q-toolbar>
    <{{{titleUcFirst}}}Form ref="updateForm" v-if="item" :values="item" :errors="violations" />
    <q-inner-loading :showing="isLoading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {{{titleUcFirst}}}Form from './Form.vue';

export default {
  name: '{{{titleUcFirst}}}Update',

  components: {
    {{{titleUcFirst}}}Form,
  },

  data() {
    return {
      item: {},
    };
  },

  computed: {
    ...mapGetters({
      isLoading: '{{{lc}}}/update/isLoading',
      error: '{{{lc}}}/update/error',
      deleteError: '{{{lc}}}/del/error',
      deleteLoading: '{{{lc}}}/del/isLoading',
      deleted: '{{{lc}}}/del/deleted',
      retrieved: '{{{lc}}}/update/retrieved',
      updated: '{{{lc}}}/update/updated',
      violations: '{{{lc}}}/update/violations',
    }),
  },

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    deleted: function(deleted) {
      if (!deleted) {
        return;
      }

      this.$router.push({ name: '{{{titleUcFirst}}}List' });
    },

    deleteLoading(val) {
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
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },

    deleteError(message) {
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },

    updated(val) {
      this.$q.notify({
        message: `${val['@id']} ${this.$t('updated')}.`,
        color: 'green',
        icon: 'tag_faces',
        closeBtn: this.$t('{{{labels.close}}}'),
      });
    },

    retrieved(val) {
      this.item = { ...val };
    },
  },

  beforeDestroy() {
    this.reset();
  },

  created() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
    this.retrieve(decodeURIComponent(this.$route.params.id));
  },

  methods: {
    ...mapActions({
      createReset: '{{{lc}}}/create/reset',
      deleteItem: '{{{lc}}}/del/del',
      delReset: '{{{lc}}}/del/reset',
      retrieve: '{{{lc}}}/update/retrieve',
      updateReset: '{{{lc}}}/update/reset',
      update: '{{{lc}}}/update/update',
      {{#each formFields}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      {{{name}}}GetSelectItems: '{{{downcase reference.title}}}/list/getSelectItems',
      {{/if}}
      {{/compare}}
      {{/each}}
    }),

    del() {
      if (window.confirm(this.$t('{{{labels.confirmDelete}}}'))) {
        this.deleteItem(this.retrieved);
      }
    },

    reset() {
      this.updateReset();
      this.delReset();
      this.createReset();
    },

    onSendForm() {
      this.$refs.updateForm.$children[0].validate().then(success => {
        if (success) {
          this.update(this.item);
        }
      });
    },

    resetForm() {
      this.item = { ...this.retrieved };
    },
  },
};
</script>
