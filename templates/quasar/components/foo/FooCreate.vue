<template>
  <Toolbar>
    <template #left>
      <Breadcrumb :values="breadcrumb" />
    </template>
  </Toolbar>

  <Form :errors="violations" @submit="submitForm" />

  <Loading :showing="isLoading" />
</template>

<script lang="ts" setup>
import Toolbar from 'src/components/common/CommonToolbar.vue';
import Breadcrumb from 'src/components/common/CommonBreadcrumb.vue';
import Loading from 'components/common/CommonLoading.vue';
import Form from 'components/{{lc}}/{{titleUcFirst}}Form.vue';
import { useRouter } from 'vue-router';
import { use{{titleUcFirst}}CreateStore } from 'stores/{{lc}}/create';
import { storeToRefs } from 'pinia';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import { useBreadcrumb } from 'src/composables/breadcrumb';
import { useWatchErrors } from 'src/composables/errors';

const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created, isLoading, violations, error } = storeToRefs({{lc}}CreateStore);

async function submitForm(item: {{titleUcFirst}}) {
  await {{lc}}CreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: '{{titleUcFirst}}Update', params: { id: created?.value?.['@id'] } });
}

useWatchErrors([error]);
</script>
