<template>
  <div>
    <Toolbar :handle-submit="onSendForm" :handle-reset="resetForm"></Toolbar>
    <{{{titleUcFirst}}}Form ref="createForm" :values="item" :errors="violations" />
    <Loading :visible="isLoading" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
import create from '../{{{pathNesting}}}mixins/create';

const servicePrefix = '{{{snakePath}}}';

const { mapFields } = createHelpers({
  getterType: '{{{lc}}}/getField',
  mutationType: '{{{lc}}}/updateField'
});

export default {
  servicePrefix,
  mixins: [create],
  components: {
    Loading: () => import('../{{{pathNesting}}}components/Loading'),
    Toolbar: () => import('../{{{pathNesting}}}components/Toolbar'),
    {{{titleUcFirst}}}Form: () => import('../{{{pathNesting}}}components/{{{path}}}/Form')
  },
  data: () => ({
    item: {}
  }),
  computed: {
    ...mapFields(['error', 'isLoading', 'created', 'violations'])
  },
  methods: {
    ...mapActions('{{{flatpath}}}', ['create', 'reset'])
  }
};
</script>
