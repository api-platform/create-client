<template>
  <div>
    <Toolbar :handle-add="addHandler">
      <Breadcrumb :values="$route.meta.breadcrumb" slot="left" />
    </Toolbar>
    {{#if parameters.length}}
    <DataFilter
      :handle-filter="onSendFilter"
      :handle-reset="resetFilter"
      :expanded="expandedFilter"
    ><{{{titleUcFirst}}}FilterForm ref="filterForm" :values="filtration" slot="filter" /></DataFilter>
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
      <ActionCell
        slot="body-cell-action"
        slot-scope="props"
        :handle-show="() => showHandler(props.row)"
        :handle-edit="() => editHandler(props.row)"
        :handle-delete="() => deleteHandler(props.row)"
      />
    </q-table>
  </div>
</template>

<script>
import { list } from '../../utils/vuexer';
{{#if parameters.length }}
import {{{titleUcFirst}}}FilterForm from './Filter';
import { DataFilter } from '../../common/components';
{{/if}}
import { ActionCell, Breadcrumb, Toolbar } from '../../common/components';
import ListMixin from '../../common/mixins/ListMixin';
const servicePrefix = '{{{titleUcFirst}}}';
const { getters, actions } = list(servicePrefix);

export default {
  name: '{{{titleUcFirst}}}List',
  servicePrefix,
  mixins: [ListMixin],
  components: {
    {{#if parameters.length }}
    {{{titleUcFirst}}}FilterForm,
    DataFilter,
    {{/if}}
    Breadcrumb,
    ActionCell,
    Toolbar,
  },

  data() {
    return {
      columns: [
        { name: 'action' },
        { name: 'id', field: '@id', label: this.$t('id') },
        {{#each fields}}
          {{#inArray ../dateTypes type}}
            {{#compare type "==" "time" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{capitalize name}}'),
          format: val => this.formatDateTime(val, 'HH:mm'),
          {{#if sortable }}
          sortable: true,
          {{/if~}}
        },
            {{/compare}}
            {{#compare type "==" "date" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{capitalize name}}'),
          format: val => this.formatDateTime(val, 'short'),
          {{#if sortable }}
          sortable: true,
          {{/if~}}
        },
            {{/compare}}
            {{#compare type "==" "dateTime" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{capitalize name}}'),
          format: val => this.formatDateTime(val, 'long'),
          {{#if sortable }}
          sortable: true,
          {{/if~}}
        },
            {{/compare}}
          {{else}}
            {{#compare type "==" "number" }}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{capitalize name}}'),
          format: val => this.$t(val),
          {{#if sortable }}
          sortable: true,
          {{/if~}}
        },
            {{else}}
        {
          name: '{{name}}',
          field: '{{name}}',
          label: this.$t('{{capitalize name}}'),
          {{#if sortable }}
          sortable: true,
          {{/if~}}
        },
            {{/compare}}
          {{/inArray}}
        {{/each }}
      ],
    };
  },

  computed: getters,
  methods: actions,
};
</script>
