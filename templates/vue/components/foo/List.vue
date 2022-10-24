<script lang="ts" setup>
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import type { {{titleUcFirst}} } from "@/utils/types";
import { storeToRefs } from "pinia";
import { onBeforeUnmount } from "vue";
import { use{{titleUcFirst}}ListStore } from "@/stores/{{lc}}/list";
import { mercureSubscribe } from "@/utils/mercure";
import { formatDateTime } from "@/utils/date";

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, error, view, isLoading } = storeToRefs({{lc}}ListStore);

const mercureEl = (data: {{titleUcFirst}}) => {
  if (Object.keys(data).length === 1) {
    {{lc}}ListStore.deleteItem(data);
    {{lc}}DeleteStore.setMercureDeleted(data);
    return;
  }

  {{lc}}ListStore.updateItem(data);
};

let mercureSub: EventSource | null = null;

{{lc}}ListStore.$subscribe((mutation, state) => {
  if (!state.hubUrl) {
    return;
  }

  if (mercureSub) {
    mercureSub.close();
  }

  if (!state.items?.length) {
    return;
  }

  mercureSub = mercureSubscribe(
    state.hubUrl,
    state.items.map((i) => i["@id"] ?? ""),
    mercureEl
  );
});

await {{lc}}ListStore.getItems();

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted: deletedItem, mercureDeleted: mercureDeletedItem } =
  storeToRefs({{lc}}DeleteStore);

onBeforeUnmount(() => {
  mercureSub?.close();
  {{lc}}DeleteStore.$reset();
});
</script>

<template>
  <h1>{{title}} List</h1>

  <div v-if="isLoading" class="alert alert-info">Loading...</div>
  <div v-if="deletedItem" class="alert alert-success">
    \{{ deletedItem['@id'] }} deleted.
  </div>
  <div v-if="mercureDeletedItem" class="alert alert-success">
    \{{ mercureDeletedItem['@id'] }} deleted by another user.
  </div>
  <div v-if="error" class="alert alert-danger">\{{ error }}</div>

  <p>
    <router-link 
      :to="{ name: '{{titleUcFirst}}Create' }" 
      class="btn btn-primary"
    >
      Create
    </router-link>
  </p>

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
      <tr
        v-for="item in items"
        :key="item['@id']"
      >
        <td>
          <router-link
            v-if="item"
            :to="{name: '{{titleUcFirst}}Show', params: { id: item['@id'] }}"
          >
            \{{ item['@id'] }}
          </router-link>
        </td>
        {{#each fields}}
        <td>
          {{#if isReferences}}
          <router-link
            v-for="{{lowercase reference.title}} in item.{{reference.name}}"
            :to="{ name: '{{reference.title}}Show', params: { id: {{lowercase reference.title}} } }"
            :key="{{lowercase reference.title}}"
          >
            \{{ {{lowercase reference.title}} }}

            <br />
          </router-link>
          {{else if reference}}
          <router-link
          :to="{ name: '{{reference.title}}Show', params: { id: item.{{lowercase reference.title}} } }"
          >
            \{{ item.{{lowercase reference.title}} }}
          </router-link>
          {{else if isEmbeddeds}}
          <router-link
            v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
            :to="{ name: '{{embedded.title}}Show', params: { id: {{lowercase embedded.title}}['@id'] } }"
            :key="{{lowercase embedded.title}}['@id']"
          >
            \{{ {{lowercase embedded.title}}["@id"] }}

            <br />
          </router-link>
          {{else if embedded}}
          <router-link
            :to="{ name: '{{embedded.title}}Show', params: { id: item.{{lowercase embedded.title}}['@id'] } }"
          >
            \{{ item.{{lowercase embedded.title}}['@id'] }}
          </router-link>
          {{else if (compare type "==" "dateTime") }}
            \{{ formatDateTime(item.{{name}}) }}
          {{else}}
            \{{ item.{{name}} }}
          {{/if}}
        </td>
        {{/each}}
        <td>
          <router-link :to="{name: '{{titleUcFirst}}Show', params: { id: item['@id'] }}">
            <i class="bi-search" />
            <span class="sr-only">Show</span>
          </router-link>
        </td>
        <td>
          <router-link :to="{name: '{{titleUcFirst}}Update', params: { id: item['@id'] }}">
            <i class="bi-pencil" />
            <span class="sr-only">Edit</span>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>

  <nav aria-label="Page navigation" v-if="view">
    <router-link
      :to="view['hydra:first'] ? view['hydra:first'] : { name: '{{titleUcFirst}}List' }"
      :class="{ disabled: !view['hydra:previous'] }"
      class="btn btn-primary"
      aria-label="First page"
    >
      <span aria-hidden="true">&lArr;</span> First
    </router-link>
    &nbsp;
    <router-link
      :to="!view['hydra:previous'] || view['hydra:previous'] === view['hydra:first'] ? { name: '{{titleUcFirst}}List' } : view['hydra:previous']"
      :class="{ disabled: !view['hydra:previous'] }"
      class="btn btn-primary"
      aria-label="Previous page"
    >
      <span aria-hidden="true">&larr;</span> Previous
    </router-link>

    <router-link
      :to="view['hydra:next'] ? view['hydra:next'] : '#'"
      :class="{ disabled: !view['hydra:next'] }"
      class="btn btn-primary"
      aria-label="Next page"
    >
      Next <span aria-hidden="true">&rarr;</span>
    </router-link>

    <router-link
      :to="view['hydra:last'] ? view['hydra:last'] : '#'"
      :class="{ disabled: !view['hydra:next'] }"
      class="btn btn-primary"
      aria-label="Last page"
    >
      Last <span aria-hidden="true">&rArr;</span>
    </router-link>
  </nav>
</template>

