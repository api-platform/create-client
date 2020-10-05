<template>
  <div class="{{{lc}}}-list">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :items-per-page.sync="options.itemsPerPage"
            :loading="isLoading"
            loading-text="Loading..."
            :options.sync="options"
            :server-items-length="totalItems"
            class="elevation-1"
            item-key="@id"
            show-select
            @update:options="onUpdateOptions"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>{{{titleUcFirst}}}</v-toolbar-title>

                <v-spacer></v-spacer>

                {{#if parameters.length}}
                <DataFilter :handle-filter="onSendFilter" :handle-reset="resetFilter">
                  <{{{titleUcFirst}}}FilterForm
                    ref="filterForm"
                    :values="filters"
                    slot="filter"
                  />
                </DataFilter>
                {{/if}}

                <v-btn
                  color="primary"
                  dark
                  class="ml-2"
                  @click="addHandler"
                >
                  New Item
                </v-btn>
              </v-toolbar>
            </template>

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
                      <nuxt-link :to="{ name: '{{{name}}}-id', params: { id: _item['@id'] } }">
                        \{{ _item['@id'] }}
                      </nuxt-link>
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
import list from '../../mixins/list';

export default {
  servicePrefix: '{{{lc}}}s',
  mixins: [list],
  components: {
    Toolbar: () => import('../../components/Toolbar'),
    ActionCell: () => import('../../components/ActionCell'),
    {{{titleUcFirst}}}FilterForm: () => import('../../components/{{{lc}}}/Filter'),
    DataFilter: () => import('../../components/DataFilter')
  },
  data: () => ({
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
  }),
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
      fetchAll: 'fetchAll',
      deleteItem: 'del'
    })
  }
};
</script>
