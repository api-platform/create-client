<template>
  <div>
    <Toolbar :handle-delete="del">
      <Breadcrumb :values="$route.meta.breadcrumb" :item="item" slot="left" />
    </Toolbar>

    <div v-if="item" class="table-responsive">
      <q-markup-table>
        <thead>
          <tr>
            <th>\{{ $t('{{{labels.field}}}') }}</th>
            <th>\{{ $t('{{{labels.value}}}') }}</th>

            <th>\{{ $t('{{{labels.field}}}') }}</th>
            <th>\{{ $t('{{{labels.value}}}') }}</th>
          </tr>
        </thead>
        <tbody>
          {{#forEach fields}}
          {{#ifOdd index}}
          <tr>
          {{/ifOdd}}
            <td>\{{ $t('{{{capitalize name}}}') }}</td>
            <td>{{#switch type}}
            {{#case "dateTime"}}\{{ formatDateTime(item['{{{name}}}'], 'long') }}{{/case~}}
            {{#case "date"}}\{{ formatDateTime(item['{{{name}}}'], 'short') }}{{/case~}}
            {{#case "number"}}\{{ $t(item['{{{name}}}']) }}{{/case~}}
            {{#default}}
              {{#if reference}}
            \{{ item['{{{name}}}'] && item['{{{name}}}'].name }}
              {{else}}
            \{{ item['{{{name}}}'] }}
              {{/if}}
            {{/default~}}
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
      </q-markup-table>
    </div>
    <Loading :showing="isLoading" />
  </div>
</template>

<script>
import { show } from '../../utils/vuexer';
import { Breadcrumb, Toolbar, Loading } from '../../common/components';
import ShowMixin from '../../common/mixins/ShowMixin';
const servicePrefix = '{{{titleUcFirst}}}';
const { getters, actions } = show(servicePrefix);

export default {
  name: '{{{titleUcFirst}}}Show',
  servicePrefix,
  mixins: [ShowMixin],
  components: {
    Breadcrumb,
    Toolbar,
    Loading,
  },

  computed: getters,
  methods: actions,
};
</script>
