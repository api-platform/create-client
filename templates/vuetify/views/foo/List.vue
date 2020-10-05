<template>
  <div class="{{{lc}}}-list">
    <Toolbar :handle-add="addHandler" />

    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h1>{{{titleUcFirst}}} List</h1>
        </v-flex>
        <v-flex lg12>
          <DataFilter :handle-filter="onSendFilter" :handle-reset="resetFilter">
            <{{{titleUcFirst}}}FilterForm
              ref="filterForm"
              :values="filters"
              slot="filter"
            />
          </DataFilter>

          <br />

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :items-per-page.sync="options.itemsPerPage"
            :loading="isLoading"
            :loading-text="$t('Loading...')"
            :options.sync="options"
            :server-items-length="totalItems"
            class="elevation-1"
            item-key="@id"
            show-select
            @update:options="onUpdateOptions"
          >
          {{#forEach fields~}}
            {{#switch type~}}
              {{#case "dateTime"}}
                <template slot="item.{{{name}}}" slot-scope="{ item }">
                  \{{ formatDateTime(item['{{{name}}}'], 'long') }}
                </template>
              {{/case~}}
              {{#case "date"}}
                <template slot="item.{{{name}}}" slot-scope="{ item }">
                  \{{ formatDateTime(item['{{{name}}}'], 'short') }}
                </template>
              {{/case~}}
              {{#case "number"}}
                <template slot="item.{{{name}}}" slot-scope="{ item }">
                  \{{ $t(item['{{{name}}}']) }}
                </template>
              {{/case~}}
              {{#default}}
                {{#if reference}}
                <template slot="item.{{{name}}}" slot-scope="{ item }">
                {{#if maxCardinality }}
                  \{{ item['@id'] }}
                  {{else}}
                  <ul>
                    <li v-for="_item in item['{{{name}}}']" :key="_item['@id']">
                      \{{ _item['@id'] }}
                    </li>
                  </ul>
                {{/if}}
                </template>
                {{/if~}}
              {{/default~}}
            {{/switch}}
          {{/forEach }}

            <ActionCell
              slot="item.action"
              slot-scope="props"
              :handle-show="() => showHandler(props.item)"
              :handle-edit="() => editHandler(props.item)"
              :handle-delete="() => deleteHandler(props.item)"
            ></ActionCell>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import ListMixin from '../../mixins/ListMixin';
import ActionCell from '../../components/ActionCell';
import {{{titleUcFirst}}}FilterForm from '../../components/{{{lc}}}/Filter';
import DataFilter from '../../components/DataFilter';
import Toolbar from '../../components/Toolbar';

export default {
  name: '{{{titleUcFirst}}}List',
  servicePrefix: '{{{titleUcFirst}}}',
  mixins: [ListMixin],
  components: {
    Toolbar,
    ActionCell,
    {{{titleUcFirst}}}FilterForm,
    DataFilter
  },
  data() {
    return {
      headers: [
        {{#forEach fields}}
        { text: '{{{name}}}', value: '{{{name}}}' },
        {{/forEach}}
        {
          text: 'Actions',
          value: 'action',
          sortable: false
        }
      ],
      selected: []
    };
  },
  computed: {
    ...mapGetters('{{{lc}}}', {
      items: 'list'
    }),
    ...mapFields('{{{lc}}}', {
      deletedItem: 'deleted',
      error: 'error',
      isLoading: 'isLoading',
      resetList: 'resetList',
      totalItems: 'totalItems',
      view: 'view'
    })
  },
  methods: {
    ...mapActions('{{{lc}}}', {
      getPage: 'fetchAll',
      deleteItem: 'del'
    })
  }
};
</script>
