<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4">\{{ error }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/{{lc}}/{{titleUcFirst}}Form.vue";
import { use{{titleUcFirst}}CreateStore } from "@/store/{{lc}}/create";
import { {{titleUcFirst}} } from "@/types/{{lc}}";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useBreadcrumb } from "@/composables/breadcrumb";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created, isLoading, violations, error } = storeToRefs({{lc}}CreateStore);

async function create(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "{{titleUcFirst}}Update", params: { id: created?.value?.["@id"] } });
}
</script>
