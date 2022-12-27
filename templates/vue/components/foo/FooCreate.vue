<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <router-link
      :to="{ name: '{{titleUcFirst}}List' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </router-link>

    <h1 class="text-3xl my-4">Create {{title}}</h1>

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
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Form from "@/components/{{lc}}/{{titleUcFirst}}Form.vue";
import { use{{titleUcFirst}}CreateStore } from "@/stores/{{lc}}/create";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";

const router = useRouter();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { isLoading, error, violations } = storeToRefs({{lc}}CreateStore);

async function create(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!{{lc}}CreateStore.created) return;

  router.push({
    name: "{{titleUcFirst}}Update",
    params: { id: {{lc}}CreateStore.created["@id"] },
  });
}
</script>
