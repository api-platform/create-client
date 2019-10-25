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
import {{{titleUcFirst}}}Form from '../../components/{{{lc}}}/Form';
import Loading from '../../components/Loading';
import Toolbar from '../../components/Toolbar';
import CreateMixin from '../../mixins/CreateMixin';

const servicePrefix = '{{{titleUcFirst}}}';

const { mapFields } = createHelpers({
  getterType: '{{{lc}}}/getField',
  mutationType: '{{{lc}}}/updateField'
});

export default {
  name: '{{{titleUcFirst}}}Create',
  servicePrefix,
  mixins: [CreateMixin],
  components: {
    Loading,
    Toolbar,
    {{{titleUcFirst}}}Form
  },
  data() {
    return {
      item: {}
    };
  },
  computed: {
    ...mapFields(['error', 'isLoading', 'created', 'violations'])
  },
  methods: {
    ...mapActions('{{{lc}}}', ['create', 'reset'])
  }
};
</script>
