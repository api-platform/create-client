<template>
  <nuxt-link :to="{ name: '{{name}}' }" class="text-blue-600 hover:text-blue-800">
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

  <Form :errors="violations" @submit="submitForm" />
</template>

<script lang="ts" setup>
import Form from "~~/components/{{lc}}/{{titleUcFirst}}Form.vue";
import { storeToRefs } from "pinia";
import { use{{titleUcFirst}}CreateStore } from "~~/stores/{{lc}}/create";
import { {{titleUcFirst}} } from "~~/types/{{lc}}";

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created, isLoading, violations, error } = storeToRefs({{lc}}CreateStore);

async function submitForm(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!created?.value) {
    return;
  }

  navigateTo({
    name: "{{name}}-id-edit",
    params: { id: created?.value?.["@id"] },
  });
}
</script>
