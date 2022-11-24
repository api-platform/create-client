<script lang="ts" setup>
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import { storeToRefs } from "pinia";
{{#if hasRelationsOrManyRelations}}
import { useRouter } from "vue-router";
{{/if}}
import { onBeforeUnmount } from "vue";
import { use{{titleUcFirst}}ListStore } from "@/stores/{{lc}}/list";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";

{{#if hasRelationsOrManyRelations}}
const router = useRouter();
{{/if}}

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted: deletedItem, mercureDeleted: mercureDeletedItem } =
  storeToRefs({{lc}}DeleteStore);

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, error, view, isLoading } = storeToRefs({{lc}}ListStore);

useMercureList({ store: {{lc}}ListStore, deleteStore: {{lc}}DeleteStore });

await {{lc}}ListStore.getItems();

onBeforeUnmount(() => {
  {{lc}}DeleteStore.$reset();
});
</script>

<template>
  <h1>{{title}} List</h1>

  <div v-if="isLoading" class="alert alert-info">Loading...</div>
  <div v-if="deletedItem" class="alert alert-success">
    \{{ deletedItem["@id"] }} deleted.
  </div>
  <div v-if="mercureDeletedItem" class="alert alert-success">
    \{{ mercureDeletedItem["@id"] }} deleted by another user.
  </div>
  <div v-if="error" class="alert alert-danger">\{{ error }}</div>

  <router-link :to="{ name: '{{titleUcFirst}}Create' }" class="btn btn-primary">
    Create
  </router-link>

  <table class="table table-responsive table-striped table-hover">
    <thead>
      <tr>
        <th>id</th>
        {{#each fields}}
        <th>{{name}}</th>
        {{/each }}
        <th colspan="2"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item['@id']">
        <td>
          <router-link
            v-if="item"
            :to="{ name: '{{titleUcFirst}}Show', params: { id: item['@id'] } }"
          >
            \{{ item["@id"] }}
          </router-link>
        </td>
        {{#each fields}}
        <td>
          {{#if isReferences}}
          <template v-if="router.hasRoute('{{reference.title}}Show')">
            <router-link
              v-for="{{lowercase reference.title}} in item.{{reference.name}}"
              :to="{ name: '{{reference.title}}Show', params: { id: {{lowercase reference.title}} } }"
              :key="{{lowercase reference.title}}"
            >
              \{{ {{lowercase reference.title}} }}

              <br />
            </router-link>
          </template>

          <template v-else>
            <p 
              v-for="{{lowercase reference.title}} in item.{{reference.name}}" 
              :key="{{lowercase reference.title}}"
            >
              \{{ {{lowercase reference.title}} }}
            </p>
          </template>
          {{else if reference}}
          <router-link
            v-if="router.hasRoute('{{reference.title}}Show')"
            :to="{ name: '{{reference.title}}Show', params: { id: item.{{lowercase reference.title}} } }"
          >
            \{{ item.{{lowercase reference.title}} }}
          </router-link>

          <p v-else>
            \{{ item.{{lowercase reference.title}} }}
          </p>
          {{else if isEmbeddeds}}
          <template v-if="router.hasRoute('{{embedded.title}}Show')">
            <router-link
              v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
              :to="{ name: '{{embedded.title}}Show', params: { id: {{lowercase embedded.title}}['@id'] } }"
              :key="{{lowercase embedded.title}}['@id']"
            >
              \{{ {{lowercase embedded.title}}["@id"] }}

              <br />
            </router-link>
          </template>

          <template v-else>
            <p 
              v-for="{{lowercase embedded.title}} in item.{{embedded.name}}" 
              :key="{{lowercase embedded.title}}['@id']"
            >
              \{{ {{lowercase embedded.title}}["@id"] }}
            </p>
          </template>
          {{else if embedded}}
          <router-link
            v-if="router.hasRoute('{{embedded.title}}Show')"
            :to="{ name: '{{embedded.title}}Show', params: { id: item.{{lowercase embedded.title}}['@id'] } }"
          >
            \{{ item.{{lowercase embedded.title}}["@id"] }}
          </router-link>

          <p v-else>
            \{{ item.{{lowercase embedded.title}}["@id"] }}
          </p>
          {{else if (compare type "==" "dateTime") }}
          \{{ formatDateTime(item.{{name}}) }}
          {{else}}
          \{{ item.{{name}} }}
          {{/if}}
        </td>
        {{/each}}
        <td>
          <router-link :to="{ name: '{{titleUcFirst}}Show', params: { id: item['@id'] } }">
            <i class="bi-search" />
            <span class="sr-only">Show</span>
          </router-link>
        </td>
        <td>
          <router-link :to="{ name: '{{titleUcFirst}}Update', params: { id: item['@id'] } }">
            <i class="bi-pencil" />
            <span class="sr-only">Edit</span>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>

  <nav aria-label="Page navigation" v-if="view">
    <router-link
      :to="view['{{hydraPrefix}}first'] ? view['{{hydraPrefix}}first'] : { name: '{{titleUcFirst}}List' }"
      :class="{ disabled: !view['{{hydraPrefix}}previous'] }"
      class="btn btn-primary"
      aria-label="First page"
    >
      <span aria-hidden="true">&lArr;</span> First
    </router-link>
    &nbsp;
    <router-link
      :to="!view['{{hydraPrefix}}previous'] || view['{{hydraPrefix}}previous'] === view['{{hydraPrefix}}first'] ? { name: '{{titleUcFirst}}List' } : view['{{hydraPrefix}}previous']"
      :class="{ disabled: !view['{{hydraPrefix}}previous'] }"
      class="btn btn-primary"
      aria-label="Previous page"
    >
      <span aria-hidden="true">&larr;</span> Previous
    </router-link>

    <router-link
      :to="view['{{hydraPrefix}}next'] ? view['{{hydraPrefix}}next'] : '#'"
      :class="{ disabled: !view['{{hydraPrefix}}next'] }"
      class="btn btn-primary"
      aria-label="Next page"
    >
      Next <span aria-hidden="true">&rarr;</span>
    </router-link>

    <router-link
      :to="view['{{hydraPrefix}}last'] ? view['{{hydraPrefix}}last'] : '#'"
      :class="{ disabled: !view['{{hydraPrefix}}next'] }"
      class="btn btn-primary"
      aria-label="Last page"
    >
      Last <span aria-hidden="true">&rArr;</span>
    </router-link>
  </nav>
</template>
