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
import update from '../{{{pathNesting}}}mixins/update';

const servicePrefix = '{{{snakePath}}}';

export default {
  servicePrefix,
  mixins: [update],
  components: {
    Loading: () => import('../{{{pathNesting}}}components/Loading'),
    Toolbar: () => import('../{{{pathNesting}}}components/Toolbar'),
    {{{titleUcFirst}}}Form: () => import('../{{{pathNesting}}}components/{{{path}}}/Form.vue')
  },

  computed: {
    ...mapFields('{{{flatpath}}}', {
      deleteLoading: 'isLoading',
      isLoading: 'isLoading',
      error: 'error',
      updated: 'updated',
      violations: 'violations'
    }),
    ...mapGetters('{{{flatpath}}}', ['find'])

  },

  methods: {
    ...mapActions('{{{flatpath}}}', {
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
