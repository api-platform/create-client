<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable
      >\{{ error }}</v-alert
    >

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/{{lc}}/{{titleUcFirst}}Form.vue";
import { use{{titleUcFirst}}CreateStore } from "@/store/{{lc}}/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created, isLoading, violations, error } = storeToRefs({{lc}}CreateStore);

async function create(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "{{titleUcFirst}}Update", params: { id: encodeURIComponent(created?.value?.["@id"]) } });
}

onBeforeUnmount(() => {
  {{lc}}CreateStore.$reset();
});
</script>
