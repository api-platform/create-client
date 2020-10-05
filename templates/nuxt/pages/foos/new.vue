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
import create from '../../mixins/create';

const servicePrefix = '{{{lc}}}s';

const { mapFields } = createHelpers({
  getterType: '{{{lc}}}/getField',
  mutationType: '{{{lc}}}/updateField'
});

export default {
  servicePrefix,
  mixins: [create],
  components: {
    Loading: () => import('../../components/Loading'),
    Toolbar: () => import('../../components/Toolbar'),
    {{{titleUcFirst}}}Form: () => import('../../components/{{{lc}}}/Form')
  },
  data: () => ({
    item: {}
  }),
  computed: {
    ...mapFields(['error', 'isLoading', 'created', 'violations'])
  },
  methods: {
    ...mapActions('{{{lc}}}', ['create', 'reset'])
  }
};
</script>
