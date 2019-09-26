<template>
  <div>
    <Toolbar :handle-submit="onSendForm" :handle-reset="resetForm" :handle-delete="del">
      <Breadcrumb :values="$route.meta.breadcrumb" :item="item" slot="left" />
    </Toolbar>
    <{{{titleUcFirst}}}Form ref="updateForm" v-if="item" :values="item" :errors="violations" />
    <Loading :showing="isLoading || deleteLoading" />
  </div>
</template>

<script>
import { update } from '../../utils/vuexer';
import {{{titleUcFirst}}}Form from './Form.vue';
import { Breadcrumb, Toolbar, Loading } from '../../common/components';
import UpdateMixin from '../../common/mixins/UpdateMixin';
const servicePrefix = '{{{titleUcFirst}}}';
const { getters, actions } = update(servicePrefix.toLowerCase());

export default {
  name: '{{{titleUcFirst}}}Update',
  servicePrefix,
  mixins: [UpdateMixin],
  components: {
    {{{titleUcFirst}}}Form,
    Breadcrumb,
    Toolbar,
    Loading,
  },

  computed: getters,
  methods: actions,
};
</script>
