<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { use{{titleUcFirst}}ShowStore } from "@/stores/{{lc}}/show";
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import { mercureSubscribe } from "../../utils/mercure";
import { storeToRefs } from "pinia";
import type { {{titleUcFirst}} } from "@/utils/types";

const route = useRoute();
const router = useRouter();

const {{lc}}ShowStore = use{{titleUcFirst}}ShowStore();
const { retrieved: item, isLoading, error } = storeToRefs({{lc}}ShowStore);

const mercureEl = (data: {{titleUcFirst}}) => {
  if (Object.keys(data).length === 1) {
    {{lc}}DeleteStore.setMercureDeleted(data);
    return;
  }

  {{lc}}ShowStore.setRetrieved(data);
};

let mercureSub: EventSource | null = null;

{{lc}}ShowStore.$subscribe((mutation, state) => {
  if (!state.hubUrl) {
    return;
  }

  if (mercureSub) {
    mercureSub.close();
  }

  if (!state.retrieved) {
    return;
  }

  mercureSub = mercureSubscribe(
    state.hubUrl,
    [state.retrieved["@id"] ?? ""],
    mercureEl
  );
});

await {{lc}}ShowStore.retrieve(decodeURIComponent(route.params.id as string));

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { error: deleteError, deleted } = storeToRefs({{lc}}DeleteStore);

{{lc}}DeleteStore.$subscribe((mutation, state) => {
  if (state.mercureDeleted) {
    router.push({ name: "{{titleUcFirst}}List" });
  }
});

async function deleteItem() {
  if (!item.value) {
    {{lc}}DeleteStore.setError("This item does not exist anymore");
    return;
  }

  if (window.confirm("Are you sure you want to delete this {{lc}}?")) {
    await {{lc}}DeleteStore.deleteItem(item.value);

    if (deleted) {
      router.push({ name: "{{titleUcFirst}}List" });
    }
  }
}

onBeforeUnmount(() => {
  mercureSub?.close();
  {{lc}}ShowStore.$reset();
});
</script>

<template>
  <h1>Show {{titleUcFirst}} \{{ item?.['@id'] }}</h1>

  <div v-if="isLoading" class="alert alert-info" role="status">Loading...</div>
  <div v-if="error" class="alert alert-danger" role="alert">
    <i class="bi-exclamation-triangle" />
    \{{ error }}
  </div>
  <div v-if="deleteError" class="alert alert-danger" role="alert">
    <<i class="bi-exclamation-triangle" />
    \{{ deleteError }}
  </div>
  
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
          <th scope="row">{{name}}</th>
          <td>\{{ item.{{name}} }}</td>
        </tr>
    {{/each }}
      </tbody>
    </table>
  </div>

  <router-link
    :to="{ name: '{{titleUcFirst}}List' }"
    class="btn btn-primary"
  >
    Back to list
  </router-link>
  <router-link
    v-if="item"
    :to="{ name: '{{titleUcFirst}}Update', params: { id: item['@id'] } }"
    class="btn btn-warning"
  >
    Edit
  </router-link>
  <button class="btn btn-danger" @click="deleteItem">Delete</button>
</template>
