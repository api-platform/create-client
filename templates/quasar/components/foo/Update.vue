<template>
  <div>
    <q-toolbar class="q-my-md">
      <Breadcrumb :values="$route.meta.breadcrumb" :item="item" />
      <q-space />
      <div>
        <q-btn :label="$t('{{{labels.submit}}}')" color="primary" @click="onSendForm" />
        <q-btn :label="$t('{{{labels.reset}}}')" color="primary" flat class="q-ml-sm" @click="resetForm" />
        <q-btn
          :label="$t('{{{labels.delete}}}')"
          color="primary"
          flat
          class="q-ml-sm"
          @click="confirmDelete = true"
        />
      </div>
    </q-toolbar>
    <{{{titleUcFirst}}}Form ref="updateForm" v-if="item" :values="item" :errors="violations" />
    <q-inner-loading :showing="isLoading || deleteLoading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">\{{ $t('Are you sure you want to delete this item?') }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="del" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {{{titleUcFirst}}}Form from './Form.vue';
import { error, success } from '../../utils/notify';
import Breadcrumb from '../common/Breadcrumb.vue';

export default {
  name: '{{{titleUcFirst}}}Update',

  components: {
    {{{titleUcFirst}}}Form,
    Breadcrumb,
  },

  data() {
    return {
      confirmDelete: false,
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

    error(message) {
      message && error(message, this.$t('{{{labels.close}}}'));
    },

    deleteError(message) {
      message && error(message, this.$t('{{{labels.close}}}'));
    },

    updated(val) {
      success(
        `${val['@id']} ${this.$t('{{{labels.updated}}}')}.`,
        this.$t('{{{labels.close}}}'),
      );
    },

    retrieved(val) {
      this.item = { ...val };
    },
  },

  beforeDestroy() {
    this.reset();
  },

  created() {
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
      this.deleteItem(this.retrieved).then(() => this.$router.push({ name: '{{{titleUcFirst}}}List' }));
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
