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
        <q-btn flat round dense icon="add" :to="{ name: '{{{titleUcFirst}}}Create' }" />
      </div>
    </q-toolbar>

    {{#if parameters.length}}
    <q-expansion-item icon="search" label="Filters" v-model="filtersExpanded">
      <q-card>
        <q-card-section>
          <UserFilterForm ref="filterForm" :values="filters" />
        </q-card-section>
        <q-card-section>
          <q-btn :label="$t('Filter')" color="primary" @click="onSendFilter" />
          <q-btn :label="$t('Reset')" color="primary" flat class="q-ml-sm" @click="resetFilter" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
    {{/if}}

    <q-table
      :data="items"
      :columns="columns"
      :pagination.sync="pagination"
      @request="onRequest"
      row-key="id"
      flat
    >
      <q-td slot="body-cell-action" slot-scope="props" :props="props">
        <q-btn
          flat
          round
          dense
          color="secondary"
          :to="{ name: '{{{titleUcFirst}}}Show', params: { id: props.row['@id'] } }"
          icon="format_align_justify"
        />
        <q-btn
          flat
          round
          dense
          color="secondary"
          :to="{ name: '{{{titleUcFirst}}}Update', params: { id: props.row['@id'] } }"
          icon="edit"
        />
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {{{titleUcFirst}}}FilterForm from './Filter';

export default {
  name: '{{{titleUcFirst}}}List',
  components: {
    {{{titleUcFirst}}}FilterForm,
  },
  created() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
    this.onRequest({
      pagination: this.pagination
    });
  },

  data() {
    return {
      pagination: {
        // sortBy: 'name',
        // descending: false,
        page: 1, // page to be displayed
        rowsPerPage: 3, // maximum displayed rows
        rowsNumber: 10, // virtualy the max number of rows
      },
      columns: [
        { name: 'action' },
        { name: 'id', field: '@id', label: this.$t('id') },
        {{#each fields}}
        { name: '{{name}}', field: '{{name}}', label: this.$t('{{name}}') },
        {{/each }}
      ],
      breadcrumbList: [],
      nextPage: null,
      {{#if parameters.length}}
      filters: {},
      filtersExpanded: false,
      {{/if}}
    };
  },

  watch: {
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

    items() {
      this.pagination.page = this.nextPage;
      this.nextPage = null;
    },

    deletedItem(val) {
      this.$q.notify({
        message: `${val['@id']} ${this.$t('deleted')}.`,
        color: 'green',
        icon: 'tag_faces',
        closeBtn: this.$t('Close'),
      });
    },

    totalItems(val) {
      this.pagination.rowsNumber = val;
    },
  },

  computed: mapGetters({
    deletedItem: '{{{lc}}}/del/deleted',
    error: '{{{lc}}}/list/error',
    items: '{{{lc}}}/list/items',
    isLoading: '{{{lc}}}/list/isLoading',
    view: '{{{lc}}}/list/view',
    totalItems: '{{{lc}}}/list/totalItems',
  }),

  methods: {
    ...mapActions({
      getPage: '{{{lc}}}/list/getItems',
    }),

    onRequest(props) {
      const {
        pagination: { page, rowsPerPage: itemsPerPage },
      } = props;
      this.nextPage = page;
      this.getPage({ params: { itemsPerPage, page, ...this.filters } });
    },

    {{#if parameters.length}}
    onSendFilter() {
      this.onRequest({
        pagination: this.pagination,
      });
    },

    resetFilter() {
      this.filters = {};
    },
    {{/if}}
  },
};
</script>
