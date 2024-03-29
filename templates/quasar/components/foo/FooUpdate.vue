<template>
  <div>
    <Toolbar :actions="['delete']" @delete="deleteItem">
      <template #left>
        <Breadcrumb :values="breadcrumb" :item="item" />
      </template>
    </Toolbar>

    <Form v-if="item" :values="item" :errors="violations" @submit="update" />

    <Loading :showing="isLoading || deleteLoading" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import Toolbar from 'components/common/CommonToolbar.vue';
import Breadcrumb from 'components/common/CommonBreadcrumb.vue';
import Loading from 'components/common/CommonLoading.vue';
import Form from 'components/{{lc}}/{{titleUcFirst}}Form.vue';
import { use{{titleUcFirst}}UpdateStore } from 'stores/{{lc}}/update';
import { use{{titleUcFirst}}DeleteStore } from 'stores/{{lc}}/delete';
import { useNotifications } from 'src/composables/notifications';
import { useBreadcrumb } from 'src/composables/breadcrumb';
import { useWatchErrors } from 'src/composables/errors';
import { useMercureItem } from 'src/composables/mercureItem';
import type { {{titleUcFirst}} } from 'src/types/{{lc}}';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();
const { displaySuccessNotification } = useNotifications();

const {{lc}}UpdateStore = use{{titleUcFirst}}UpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs({{lc}}UpdateStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs({{lc}}DeleteStore);

useMercureItem({
  store: {{lc}}UpdateStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: '{{titleUcFirst}}List',
});

await {{lc}}UpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    {{lc}}UpdateStore.setError('No {{lc}} found. Please reload');
    return;
  }

  await {{lc}}DeleteStore.deleteItem(item?.value);

  router.push({ name: '{{titleUcFirst}}List' });
}

async function update(item: {{titleUcFirst}}) {
  await {{lc}}UpdateStore.update(item);

  if (!updated?.value) {
    return;
  }

  displaySuccessNotification(`${item['@id']} ${t('updated')}.`);
}

useWatchErrors([error, deleteError]);

onBeforeUnmount(() => {
  {{lc}}UpdateStore.$reset();
  {{lc}}DeleteStore.$reset();
});
</script>
