<template>
  <div>
    <Toolbar :handle-submit="onSendForm" :handle-reset="resetForm">
      <Breadcrumb :values="$route.meta.breadcrumb" slot="left" />
    </Toolbar>
    <{{{titleUcFirst}}}Form ref="createForm" :values="item" :errors="violations" />
    <Loading :showing="isLoading" />
  </div>
</template>

<script>
import { create } from '../../utils/vuexer';
import {{{titleUcFirst}}}Form from './Form';
import { Breadcrumb, Toolbar, Loading } from '../common';
import CreateMixin from '../mixins/CreateMixin';
const servicePrefix = '{{{titleUcFirst}}}';
const { getters, actions } = create(servicePrefix.toLowerCase());

export default {
  name: '{{{titleUcFirst}}}Create',
  servicePrefix,
  mixins: [CreateMixin],
  components: {
    {{{titleUcFirst}}}Form,
    Breadcrumb,
    Toolbar,
    Loading,
  },

  data() {
    return {
      item: {
        {{#each formFields}}
          {{#compare type "==" "time" }}
        {{{name}}}: '',
          {{/compare}}
          {{#compare type "==" "date" }}
        {{{name}}}: new Date().toISOString(),,
          {{/compare}}
          {{#compare type "==" "dateTime" }}
        {{{name}}}: new Date().toISOString(),
          {{/compare}}
        {{/each}}
      },
    };
  },

  computed: getters,
  methods: actions,
};
</script>
