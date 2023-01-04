<template>
  <Toolbar>
    <template #left>
      <Breadcrumb :values="breadcrumb" />
    </template>
  </Toolbar>

  <Form :errors="violations" @submit="create" />

  <Loading :showing="isLoading" />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Toolbar from 'components/common/CommonToolbar.vue';
import Breadcrumb from 'components/common/CommonBreadcrumb.vue';
import Loading from 'components/common/CommonLoading.vue';
import Form from 'components/{{lc}}/{{titleUcFirst}}Form.vue';
import { use{{titleUcFirst}}CreateStore } from 'stores/{{lc}}/create';
import { useBreadcrumb } from 'src/composables/breadcrumb';
import { useWatchErrors } from 'src/composables/errors';
import type { {{titleUcFirst}} } from 'src/types/{{lc}}';

const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created, isLoading, violations, error } = storeToRefs({{lc}}CreateStore);

async function create(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: '{{titleUcFirst}}Update', params: { id: created?.value?.['@id'] } });
}

useWatchErrors([error]);
</script>
