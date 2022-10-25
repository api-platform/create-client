<script lang="ts" setup>
import {{titleUcFirst}}Form from "@/components/{{lc}}/EntityForm.vue";
import { use{{titleUcFirst}}CreateStore } from "@/stores/{{lc}}/create";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import type { {{titleUcFirst}} } from "@/utils/types";

const router = useRouter();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { isLoading, error, violations } = storeToRefs({{lc}}CreateStore);

async function onSendForm(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!{{lc}}CreateStore.created) return;

  router.push({
    name: "{{titleUcFirst}}Update",
    params: { id: {{lc}}CreateStore.created["@id"] },
  });
}
</script>

<template>
  <h1>Create {{title}}</h1>

  <div v-if="isLoading" class="alert alert-info" role="status">
    Loading...
  </div>
  <div v-if="error" class="alert alert-danger" role="alert">
    <i class="bi-exclamation-triangle" />
    \{{ error }}
  </div>

  <{{titleUcFirst}}Form :errors="violations" @send-form="onSendForm" />

  <router-link :to="{ name: '{{titleUcFirst}}List' }" class="btn btn-primary">
    Back to list
  </router-link>
</template>
