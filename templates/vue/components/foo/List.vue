<template>
  <div>
    <h1>{{{title}}} List</h1>

    <div
      v-if="isLoading"
      class="alert alert-info">Loading...</div>
    <div
      v-if="deletedItem"
      class="alert alert-success">\{{ deletedItem['@id'] }} deleted.</div>
    <div
      v-if="error"
      class="alert alert-danger">\{{ error }}</div>

    <p>
      <router-link
        :to="{ name: '{{{titleUcFirst}}}Create' }"
        class="btn btn-primary">Create</router-link>
    </p>

    <table class="table table-responsive table-striped table-hover">
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
        <tr
          v-for="item in items"
          :key="item['@id']">
          <th scope="row">
            <router-link
              v-if="item"
              :to="{name: '{{{titleUcFirst}}}Show', params: { id: item['@id'] }}">
              \{{ item['@id'] }}
            </router-link>
          </th>
{{#each fields}}
        <td>
          {{#if reference}}
            <template>
              <div
                v-if="Array.isArray(item['{{{reference.name}}}'])">
                <router-link
                  v-for="link in item['{{{reference.name}}}']"
                  :key="link['@id']"
                  :to="{ name: '{{{reference.title}}}Show', params: { id: link['@id'] } }">
                  \{{ link['@id'] }}
                </router-link>
              </div>
              <router-link
                v-else
                :to="{ name: '{{{reference.title}}}Show', params: { id: item['{{{reference.name}}}'] } }">
                \{{ item['{{{reference.name}}}'] }}
              </router-link>
            </template>
          {{else}}
            \{{ item['{{{name}}}'] }}
          {{/if}}
        </td>
{{/each}}
          <td>
            <router-link
              :to="{name: '{{{titleUcFirst}}}Show', params: { id: item['@id'] }}">
              <span
                class="fa fa-search"
                aria-hidden="true"></span>
              <span class="sr-only">Show</span>
            </router-link>
          </td>
          <td>
            <router-link :to="{name: '{{{titleUcFirst}}}Update', params: { id: item['@id'] }}">
              <span
                class="fa fa-pencil"
                aria-hidden="true"></span>
              <span class="sr-only">Edit</span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation" v-if="view">
      <router-link
        :to="view['hydra:first'] ? view['hydra:first'] : '{{{titleUcFirst}}}ContactList'"
        :class="{ disabled: !view['hydra:previous'] }"
        class="btn btn-primary">
        <span aria-hidden="true">&lArr;</span> First
      </router-link>
      &nbsp;
      <router-link
        :to="!view['hydra:previous'] || view['hydra:previous'] === view['hydra:first'] ? '{{{titleUcFirst}}}List' : view['hydra:previous']"
        :class="{ disabled: !view['hydra:previous'] }"
        class="btn btn-primary">
        <span aria-hidden="true">&larr;</span> Previous
      </router-link>

      <router-link
        :to="view['hydra:next'] ? view['hydra:next'] : '#'"
        :class="{ disabled: !view['hydra:next'] }"
        class="btn btn-primary">
        Next <span aria-hidden="true">&rarr;</span>
      </router-link>

      <router-link
        :to="view['hydra:last'] ? view['hydra:last'] : '#'"
        :class="{ disabled: !view['hydra:next'] }"
        class="btn btn-primary">
        Last <span aria-hidden="true">&rArr;</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {
  computed: {
      ...mapFields('{{{lc}}}/del', {
          deletedItem: 'deleted',
      }),
      ...mapFields('{{{lc}}}/list', {
          error: 'error',
          items: 'items',
          isLoading: 'isLoading',
          view: 'view',
      }),
  },

  mounted() {
    this.getPage();
  },

  methods: {
    ...mapActions({
      getPage: '{{{lc}}}/list/default',
    }),
  },
};
</script>
