<template>
  <div>
    <q-toolbar class="q-my-md">
      <Breadcrumb :values="breadcrumbList" :item="item" />
      <q-space />
      <div>
        <q-btn :label="$t('{{{labels.delete}}}')" color="primary" flat class="q-ml-sm" @click="confirmDelete = true" />
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
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">\{{ $t('Are you sure you want to delete this item?') }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
{{#if listContainsDate}}
import { extractDate } from '../../utils/dates';
{{/if}}
import Breadcrumb from '../common/Breadcrumb.vue';

export default {
  name: '{{{titleUcFirst}}}Show',

  components: {
    Breadcrumb,
  },

  data() {
    return {
      confirmDelete: false,
    };
  },

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
      this.deleteItem(this.item).then(() => this.$router.push({ name: '{{{titleUcFirst}}}List' }));
    },
  },
};
</script>
