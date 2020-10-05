<!-- TODO : Use this for create / update !! -->
<template>
  <div>
    <Toolbar
      :handle-submit="onSendForm"
      :handle-reset="resetForm"
      :handle-delete="del"
    >
      <template #left>
        <h1 v-if="item">
          Edit \{{ item['@id'] }}
        </h1>
      </template>
    </Toolbar>
    <{{{titleUcFirst}}}Form
      ref="updateForm"
      v-if="item"
      :values="item"
      :errors="violations"
    />
    <Loading :visible="deleteLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import update from '../../mixins/update';

const servicePrefix = '{{{lc}}}s';

export default {
  servicePrefix,
  mixins: [update],
  components: {
    Loading: () => import('../../components/Loading'),
    Toolbar: () => import('../../components/Toolbar'),
    {{{titleUcFirst}}}Form: () => import('../../components/{{{lc}}}/Form.vue')
  },

  computed: {
    ...mapFields('{{{lc}}}', {
      deleteLoading: 'isLoading',
      isLoading: 'isLoading',
      error: 'error',
      updated: 'updated',
      violations: 'violations'
    }),
    ...mapGetters('{{{lc}}}', ['find'])

  },

  methods: {
    ...mapActions('{{{lc}}}', {
      createReset: 'resetCreate',
      deleteItem: 'del',
      delReset: 'resetDelete',
      retrieve: 'load',
      update: 'update',
      updateReset: 'resetUpdate'
    })
  }
};
</script>
