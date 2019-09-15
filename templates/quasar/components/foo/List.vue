<template>
  <div>
    <q-toolbar class="q-my-md">
      <Breadcrumb :values="breadcrumbList" />
      <q-space />
      <div>
        <q-btn flat round dense icon="add" :to="{ name: '{{{titleUcFirst}}}Create' }" />
      </div>
    </q-toolbar>

    {{#if parameters.length}}
    <q-expansion-item icon="search" :label="$t('{{{labels.filters}}}')" v-model="filtersExpanded">
      <q-card>
        <q-card-section>
          <{{{titleUcFirst}}}FilterForm ref="filterForm" :values="filters" />
        </q-card-section>
        <q-card-section>
          <q-btn :label="$t('{{{labels.filter}}}')" color="primary" @click="onSendFilter" />
          <q-btn :label="$t('{{{labels.reset}}}')" color="primary" flat class="q-ml-sm" @click="resetFilter" />
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
      :no-data-label="$t('{{{labels.unavail}}}')"
      :no-results-label="$t('{{{labels.noresults}}}')"
      :loading-label="$t('{{{labels.loading}}}')"
      :rows-per-page-label="$t('{{{labels.recPerPage}}}')"
      flat
      :loading="isLoading"
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
{{#if parameters.length }}
import {{{titleUcFirst}}}FilterForm from './Filter';
{{/if}}
{{#if listContainsDate}}
import { extractDate } from '../../utils/dates';
{{/if}}
import notify from '../../utils/notify';
import Breadcrumb from '../common/Breadcrumb.vue';

export default {
  name: '{{{titleUcFirst}}}List',
  components: {
    {{#if parameters.length }}
    {{{titleUcFirst}}}FilterForm,
    {{/if}}
    Breadcrumb,
  },
  created() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
    this.onRequest({
      pagination: this.pagination,
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
          {{#inArray ../dateTypes type}}
            {{#compare type "==" "time" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{name}}'),
          format: val => this.formatDateTime(val, 'HH:mm'),
        },
            {{/compare}}
            {{#compare type "==" "date" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{name}}'),
          format: val => this.formatDateTime(val, 'short'),
        },
            {{/compare}}
            {{#compare type "==" "dateTime" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{name}}'),
          format: val => this.formatDateTime(val, 'long'),
        },
            {{/compare}}
          {{else}}
            {{#compare type "==" "number" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{name}}'),
          format: val => this.$n(val),
        },
            {{else}}
        { name: '{{name}}', field: '{{name}}', label: this.$t('{{name}}') },
            {{/compare}}
          {{/inArray}}
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
    error(message) {
      message && notify.error(message, this.$t('{{{labels.close}}}'));
    },

    items() {
      this.pagination.page = this.nextPage;
      this.pagination.rowsNumber = this.totalItems;
      this.nextPage = null;
    },

    deletedItem(val) {
      notify.success(
        `${val['@id']} ${this.$t('deleted')}.`,
        this.$t('{{{labels.close}}}')
      );
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

    {{#if listContainsDate}}
    formatDateTime(val, format) {
      return val ? this.$d(extractDate(val), format) : '';
    },
    {{/if}}

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
