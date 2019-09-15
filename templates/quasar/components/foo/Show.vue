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
        <q-btn :label="$t('{{{labels.delete}}}')" color="primary" flat class="q-ml-sm" @click="deleteItem" />
      </div>
    </q-toolbar>

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
            <td>\{{ $t('{{{name}}}') }}</td>
            <td></td>{{#switch type}}
            {{#case "dateTime"}}\{{ formatDateTime(item['{{{name}}}'], 'long') }}{{/case~}}
            {{#case "date"}}\{{ formatDateTime(item['{{{name}}}'], 'short') }}{{/case~}}
            {{#case "number"}}\{{ $n(item['{{{name}}}']) }}{{/case~}}
            {{#default}}
              {{#if reference}}
            \{{ item['{{{name}}}'].name }}
              {{else}}
            \{{ item['{{{name}}}'] }}
              {{/if}}
            {{/default~}}
            {{/switch}}</td>

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
    <q-inner-loading :showing="isLoading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
{{#if listContainsDate}}
import { extractDate } from '../../utils/dates';
{{/if}}

export default {
  name: '{{{titleUcFirst}}}Show',

  computed: mapGetters({
    deleteError: '{{{lc}}}/del/error',
    error: '{{{lc}}}/show/error',
    isLoading: '{{{lc}}}/show/isLoading',
    item: '{{{lc}}}/show/retrieved',
  }),

  beforeDestroy() {
    this.reset();
  },

  created() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
    this.retrieve(decodeURIComponent(this.$route.params.id));
  },

  watch: {
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
  },

  methods: {
    ...mapActions({
      del: '{{{lc}}}/del/del',
      reset: '{{{lc}}}/show/reset',
      retrieve: '{{{lc}}}/show/retrieve',
    }),

    {{#if listContainsDate}}
    formatDateTime(val, format) {
      return val ? this.$d(extractDate(val), format) : '';
    },
    {{/if}}

    deleteItem() {
      if (window.confirm(this.$t('{{{labels.confirmDelete}}}'))) {
        this.del(this.item).then(() => this.$router.push({ name: '{{{titleUcFirst}}}List' }));
      }
    },
  },
};
</script>
