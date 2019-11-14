<template>
  <div>
    <Toolbar :handle-delete="del">
      <template slot="left">
        <v-toolbar-title v-if="item">\{{
          `${$options.servicePrefix} ${item['@id']}`
        }}</v-toolbar-title>
      </template>
    </Toolbar>

    <br />

    <div v-if="item" class="table-{{{lc}}}-show">
      <v-simple-table>
        <template slot="default">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>

              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {{#forEach fields}}
            {{#ifOdd index}}
            <tr>
            {{/ifOdd}}
              <td><strong>\{{ $t('{{{name}}}') }}</strong></td>
              <td>{{#switch type}}
                {{#case "dateTime"}}\{{ formatDateTime(item['{{{name}}}'], 'long') }}{{/case~}}
                {{#case "date"}}\{{ formatDateTime(item['{{{name}}}'], 'short') }}{{/case~}}
                {{#case "number"}}\{{ $n(item['{{{name}}}']) }}{{/case~}}
                {{#default}}
                  {{#if reference}}
                    \{{ item['{{{name}}}'].name }}
                  {{else}}
                    \{{ item['{{{name}}}'] }}
                  {{/if}}
                {{/default}}
              {{/switch}}
              </td>
            {{#ifEven index}}
            </tr>
            {{/ifEven}}
            {{#if isLast}}{{#ifOdd index}}
              <td></td>
            </tr>
            {{/ifOdd}}{{/if}}
            {{/forEach }}
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <Loading :visible="isLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import Loading from '../../components/Loading';
import ShowMixin from '../../mixins/ShowMixin';
import Toolbar from '../../components/Toolbar';

const servicePrefix = '{{{titleUcFirst}}}';

export default {
  name: '{{{titleUcFirst}}}Show',
  servicePrefix,
  components: {
      Loading,
      Toolbar
  },
  mixins: [ShowMixin],
  computed: {
    ...mapFields('{{{lc}}}', {
      isLoading: 'isLoading'
    }),
    ...mapGetters('{{{lc}}}', ['find'])
  },
  methods: {
    ...mapActions('{{{lc}}}', {
      deleteItem: 'del',
      reset: 'reset',
      retrieve: 'load'
    })
  }
};
</script>
