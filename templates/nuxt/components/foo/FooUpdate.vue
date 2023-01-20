<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: '{{lc}}s' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <button
      class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
      @click="deleteItem"
    >
      Delete
    </button>
  </div>

  <h1 class="text-3xl my-4">Edit {{titleUcFirst}} \{{ item?.["@id"] }}</h1>

  <div
    v-if="isLoading || deleteLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error || deleteError"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    \{{ error || deleteError }}
  </div>

  <div
    v-if="created || updated"
    class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm"
    role="status"
  >
    <template v-if="updated">\{{ updated["@id"] }} updated.</template>
    <template v-else-if="created">\{{ created["@id"] }} created.</template>
  </div>

  <Form :values="item" :errors="violations" @submit="update" />
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/{{lc}}/{{titleUcFirst}}Form.vue";
import { use{{titleUcFirst}}UpdateStore } from "~~/stores/{{lc}}/update";
import { use{{titleUcFirst}}CreateStore } from "~~/stores/{{lc}}/create";
import { use{{titleUcFirst}}DeleteStore } from "~~/stores/{{lc}}/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";
import { SubmissionErrors } from "~~/types/error";
import { useFetchItem, useUpdateItem } from "~~/composables/api";

const route = useRoute();
const router = useRouter();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created } = storeToRefs({{lc}}CreateStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs({{lc}}DeleteStore);

const {{lc}}UpdateStore = use{{titleUcFirst}}UpdateStore();

useMercureItem({
  store: {{lc}}UpdateStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: "{{lc}}s",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<{{titleUcFirst}} | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<{{titleUcFirst}}>(`{{name}}/${id}`);
{{lc}}UpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: {{titleUcFirst}}) {
  if (!item?.value) {
    {{lc}}UpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<{{titleUcFirst}}>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  {{lc}}UpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    {{lc}}DeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this {{lc}}?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      {{lc}}DeleteStore.setError(error.value);
      return;
    }

    {{lc}}DeleteStore.setLoading(Boolean(isLoading?.value));
    {{lc}}DeleteStore.setDeleted(item.value);
    {{lc}}DeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "{{lc}}s" });
    }
  }
}

onBeforeUnmount(() => {
  {{lc}}UpdateStore.$reset();
  {{lc}}CreateStore.$reset();
});
</script>
