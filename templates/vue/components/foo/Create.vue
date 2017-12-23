<template>
  <div>
    <h1>New {{{ title }}}</h1>

    <div v-if="loading" class="alert alert-info" role="status">Loading...</div>
    <div v-if="error" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \{{ error }}</div>

    <{{{titleUcFirst}}}Form :handle-submit="create" :values="item" :errors="violations"></{{{titleUcFirst}}}Form>
    <router-link :to="{ name: '{{{titleUcFirst}}}List' }" class="btn btn-default">Back to list</router-link>
  </div>
</template>

<script>
  import {{{titleUcFirst}}}Form from './Form.vue'
  import { createNamespacedHelpers } from 'vuex'

  const { mapGetters } = createNamespacedHelpers('{{{lc}}}/create')

  export default {
    components: {
      {{{titleUcFirst}}}Form
    },
    data () {
      return {
        item: {}
      }
    },
    computed: mapGetters([
      'error',
      'loading',
      'created',
      'violations'
    ]),
    methods: {
      create: function(item) {
        this.$store.dispatch('{{{lc}}}/create/create', item)
      }
    },
    watch: {
      created: function (created) {
        if (created) {
          this.$router.push({ name: '{{{titleUcFirst}}}Update', params: { id: created['@id']} })
        }
      }
    }
  }
</script>
