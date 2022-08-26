<!-- TODO : Use this for create / update !! -->
<template>
  <div>
    <Toolbar :edit-href="editPath" :list-href="`/${$options.servicePrefix}`" :handle-delete="del">
      <template #left>
        <h1 v-if="item">
          Show {{{titleUcFirst}}} \{{ item['@id'] }}
        </h1>
      </template>
    </Toolbar>
    <v-simple-table v-if="item">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Field
            </th>
            <th class="text-left">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {{#each fields}}
            <tr>
              <th scope="row">{{name}}</th>
              <td>
                \{{ item['{{{name}}}'] }}
              </td>
            </tr>
          {{/each}}
        </tbody>
      </template>
    </v-simple-table>
    <Loading :visible="deleteLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import show from '../../../mixins/show';
import { getPath } from '../../../utils/fetch'

const servicePrefix = '{{{lc}}}s';

export default {
  name: '{{{name}}}',
  servicePrefix,
  mixins: [show],
  components: {
    Loading: () => import('../../../components/Loading'),
    Toolbar: () => import('../../../components/Toolbar')
  },

  computed: {
    ...mapFields('{{{lc}}}', {
      deleteLoading: 'isLoading',
      isLoading: 'isLoading',
      error: 'error',
      deleted: 'deleted',
    }),
    ...mapGetters('{{{lc}}}', ['find']),
    editPath() {
      return this.item ? getPath(this.item['@id'], '/{{{lc}}}s/[id]/edit') : '';
    }
  },

  methods: {
    ...mapActions('{{{lc}}}', {
      deleteItem: 'del',
      delReset: 'resetDelete',
      retrieve: 'load',
    })
  }
};
</script>
