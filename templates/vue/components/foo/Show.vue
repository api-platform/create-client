<template>
  <div>
    <h1>Show \{{ item && item['@id'] }}</h1>

    <div v-if="loading" class="alert alert-info" role="status">Loading...</div>
    <div v-if="error" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \{{ error }}</div>
    <div v-if="deleteError" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \{{ deleteError }}</div>

    <div v-if="item" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
      {{#each fields}}
          <tr>
            <td>{{name}}</td>
            <td>\{{ item['{{{ name }}}'] }}</td>
          </tr>
      {{/each }}
        </tbody>
      </table>
    </div>

    <router-link v-if="item" :to="{ name: '{{{titleUcFirst}}}List' }" class="btn btn-default">Back to list</router-link>
    <button @click="deleteItem(item)" class="btn btn-danger">Delete</button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: mapGetters({
      deleteError: '{{{lc}}}/del/error',
      error: '{{{lc}}}/show/error',
      loading: '{{{lc}}}/show/loading',
      item: '{{{lc}}}/show/item'
    }),
    methods: {
      deleteItem (item) {
        if (window.confirm('Are you sure you want to delete this item?')) {
          this.$store.dispatch('{{{lc}}}/del/delete', item).then(response => this.$router.push({ name: '{{{titleUcFirst}}}List' }))
        }
      }
    },
    created () {
      this.$store.dispatch('{{{lc}}}/show/retrieve', decodeURIComponent(this.$route.params.id))
    },
    beforeDestroy () {
      this.$store.dispatch('{{{lc}}}/show/reset')
    }
  }
</script>
