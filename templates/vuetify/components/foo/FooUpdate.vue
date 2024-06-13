<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable>
      \{{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable>
      <template v-if="updated">
        \{{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        \{{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>

    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </v-container>

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/{{lc}}/{{titleUcFirst}}Form.vue";
import Loading from "@/components/common/Loading.vue";
import { use{{titleUcFirst}}DeleteStore } from "@/store/{{lc}}/delete";
import { use{{titleUcFirst}}UpdateStore } from "@/store/{{lc}}/update";
import { useMercureItem } from "@/composables/mercureItem";
import { use{{titleUcFirst}}CreateStore } from "@/store/{{lc}}/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}CreateStore = use{{titleUcFirst}}CreateStore();
const { created } = storeToRefs({{lc}}CreateStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs({{lc}}DeleteStore);

const {{lc}}UpdateStore = use{{titleUcFirst}}UpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs({{lc}}UpdateStore);

useMercureItem({
  store: {{lc}}UpdateStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: "{{titleUcFirst}}List",
});

await {{lc}}UpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: {{titleUcFirst}}) {
  await {{lc}}UpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    {{lc}}UpdateStore.setError(t("itemNotFound"));
    return;
  }

  await {{lc}}DeleteStore.deleteItem(item?.value);

  router.push({ name: "{{titleUcFirst}}List" });
}

onBeforeUnmount(() => {
  {{lc}}UpdateStore.$reset();
  {{lc}}CreateStore.$reset();
  {{lc}}DeleteStore.$reset();
});
</script>
