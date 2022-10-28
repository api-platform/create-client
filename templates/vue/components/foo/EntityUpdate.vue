<script lang="ts" setup>
import { use{{titleUcFirst}}CreateStore } from "@/stores/{{lc}}/create";
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import { use{{titleUcFirst}}UpdateStore } from "@/stores/{{lc}}/update";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import { storeToRefs } from "pinia";
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {{titleUcFirst}}Form from "@/components/{{lc}}/EntityForm.vue";
import { useMercureItem } from "@/composables/mercureItem";

const route = useRoute();
const router = useRouter();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created } = storeToRefs({{lc}}CreateStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { error: deleteError, isLoading: deleteLoading } =
  storeToRefs({{lc}}DeleteStore);

const {{lc}}UpdateStore = use{{titleUcFirst}}UpdateStore();
const {
  retrieved: item,
  updated,
  error,
  isLoading,
  violations,
} = storeToRefs({{lc}}UpdateStore);

useMercureItem({
  store: {{lc}}UpdateStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: "{{titleUcFirst}}List",
});

await {{lc}}UpdateStore.retrieve(decodeURIComponent(route.params.id as string));

function onSendForm(item: {{titleUcFirst}}) {
  {{lc}}UpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    {{lc}}UpdateStore.setError("No {{lc}} found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this {{lc}}?")) {
    await {{lc}}DeleteStore.deleteItem(item.value);

    if ({{lc}}DeleteStore.deleted) {
      router.push({ name: "{{titleUcFirst}}List" });
    }
  }
}

onBeforeUnmount(() => {
  {{lc}}UpdateStore.$reset();
  {{lc}}CreateStore.$reset();
});
</script>

<template>
  <div>
    <h1>Edit {{titleUcFirst}} \{{ item?.["@id"] }}</h1>

    <div v-if="created" class="alert alert-success" role="status">
      \{{ created["@id"] }} created.
    </div>
    <div v-if="updated" class="alert alert-success" role="status">
      \{{ updated["@id"] }} updated.
    </div>
    <div
      v-if="isLoading || deleteLoading"
      class="alert alert-info"
      role="status"
    >
      Loading...
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="bi-exclamation-triangle" />
      \{{ error }}
    </div>
    <div v-if="deleteError" class="alert alert-danger" role="alert">
      <i class="bi-exclamation-triangle" />
      \{{ deleteError }}
    </div>

    <{{titleUcFirst}}Form
      v-if="item"
      :values="item"
      :errors="violations"
      @send-form="onSendForm"
    />

    <router-link v-if="item" :to="{ name: '{{titleUcFirst}}List' }" class="btn btn-primary">
      Back to list
    </router-link>
    <button class="btn btn-danger" @click="deleteItem">Delete</button>
  </div>
</template>
