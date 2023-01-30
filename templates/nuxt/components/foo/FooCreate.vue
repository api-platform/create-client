<template>
  <nuxt-link :to="{ name: '{{lc}}s' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create {{titleUcFirst}}</h1>

  <div
    v-if="isLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    \{{ error }}
  </div>

  <Form :errors="violations" @submit="create" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/{{lc}}/{{titleUcFirst}}Form.vue";
import { use{{titleUcFirst}}CreateStore } from "~~/stores/{{lc}}/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created, isLoading, violations, error } = storeToRefs({{lc}}CreateStore);

async function create(item: {{titleUcFirst}}) {
  const data = await useCreateItem<{{titleUcFirst}}>("{{name}}", item);
  {{lc}}CreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    {{lc}}CreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "{{lc}}s-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  {{lc}}CreateStore.$reset();
});
</script>
