<template>
  <div>
    <h1>{{{ title }}} List</h1>

    <div v-if="loading" class="alert alert-info">Loading...</div>
    <div v-if="deletedItem" class="alert alert-success">\{{ deletedItem['@id'] }} deleted.</div>
    <div v-if="error" class="alert alert-danger">\{{ error }}</div>

    <span v-if="view">
      <button
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:first'])"
        :disabled="!view['hydra:previous']"
      >First</button>
      &nbsp;
      <button
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:previous'])"
        :disabled="!view['hydra:previous']"
      >Previous</button>
      &nbsp;
      <button
        type="button" class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:next'])"
        :disabled="!view['hydra:next']"
      >Next</button>
      &nbsp;
      <button
        type="button" class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:last'])"
        :disabled="view['hydra:last']"
      >Last</button>
      &nbsp;
    </span>

    <div class="table-responsive">
        <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Id</th>
{{#each fields}}
            <th>{{name}}</th>
{{/each }}
            <th colspan="2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td><router-link v-if="item" :to="{name: '{{{titleUcFirst}}}Show', params: { id: item['@id'] }}">\{{ item['@id'] }}</router-link></td>
{{#each fields}}
            <td><router-link v-if="item" :to="{name: '{{{../titleUcFirst}}}Show', params: { id: item['@id'] }}">\{{ item['{{{ name }}}'] }}</router-link></td>
{{/each}}
            <td>
              <router-link :to="{name: '{{{titleUcFirst}}}Show', params: { id: item['@id'] }}">
                <span class="glyphicon glyphicon-search" aria-hidden="true"/>
                <span class="sr-only">Show</span>
              </router-link>
            </td>
            <td>
              <router-link :to="{name: '{{{titleUcFirst}}}Update', params: { id: item['@id'] }}">
                <span class="glyphicon glyphicon-pencil" aria-hidden="true"/>
                <span class="sr-only">Edit</span>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link :to="{ name: '{{{titleUcFirst}}}Create' }" class="btn btn-default">Create</router-link>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    computed: mapGetters({
      deletedItem: '{{{lc}}}/del/deleted',
      error: '{{{lc}}}/list/error',
      items: '{{{lc}}}/list/items',
      loading: '{{{lc}}}/list/loading',
      view: '{{{lc}}}/list/view'
    }),
    methods: mapActions({
      getPage: '{{{lc}}}/list/getItems'
    }),
    created () {
      this.$store.dispatch('{{{lc}}}/list/getItems')
    }
  }
</script>
