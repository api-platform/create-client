<template>
  <div>
    <h1>Edit \{{ item && item['@id'] }}</h1>

    <div v-if="created" class="alert alert-success" role="status">\{{ created['@id'] }} created.</div>
    <div v-if="updated" class="alert alert-success" role="status">\{{ updated['@id'] }} updated.</div>
    <div v-if="retrieveLoading || updateLoading || deleteLoading"class="alert alert-info" role="status">Loading...</div>
    <div v-if="retrieveError" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \{{ retrieveError }}</div>
    <div v-if="updateError" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \{{ updateError }}</div>
    <div v-if="deleteError" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \{{ deleteError }}</div>

    <{{{titleUcFirst}}}Form v-if="item" :handle-submit="update" :values="item" :errors="violations" :initialValues="retrieved"></{{{titleUcFirst}}}Form>
    <router-link v-if="item" :to="{ name: '{{{titleUcFirst}}}List' }" class="btn btn-default">Back to list</router-link>
    <button @click="del" class="btn btn-danger">Delete</button>
  </div>
</template>

<script>
  import {{{titleUcFirst}}}Form from './Form.vue'
  import { mapGetters } from 'vuex'

  export default {
    created () {
      this.$store.dispatch('{{{lc}}}/update/retrieve', decodeURIComponent(this.$route.params.id))
    },
    components: {
      {{{titleUcFirst}}}Form
    },
    computed: {
      ...mapGetters({
        retrieveError: '{{{lc}}}/update/retrieveError',
        retrieveLoading: '{{{lc}}}/update/retrieveLoading',
        updateError: '{{{lc}}}/update/updateError',
        updateLoading: '{{{lc}}}/update/updateLoading',
        deleteError: '{{{lc}}}/del/error',
        deleteLoading: '{{{lc}}}/del/loading',
        created: '{{{lc}}}/create/created',
        deleted: '{{{lc}}}/del/deleted',
        retrieved: '{{{lc}}}/update/retrieved',
        updated: '{{{lc}}}/update/updated',
        violations: '{{{lc}}}/update/violations'
      })
    },
    data: function() {
      return {
        item: {}
      }
    },
    methods: {
      update (values) {
        this.$store.dispatch('{{{lc}}}/update/update', {item: this.retrieved, values: values })
      },
      del () {
        if (window.confirm('Are you sure you want to delete this item?')) {
          this.$store.dispatch('{{{lc}}}/del/delete', this.retrieved)
        }
      },
      reset () {
        this.$store.dispatch('{{{lc}}}/update/reset')
        this.$store.dispatch('{{{lc}}}/del/reset')
        this.$store.dispatch('{{{lc}}}/create/reset')
      }
    },
    watch: {
      deleted: function (deleted) {
        if (deleted) {
          this.$router.push({ name: '{{{titleUcFirst}}}List' })
        }
      }
    },
    beforeDestroy () {
      this.reset()
    }
  }
</script>
