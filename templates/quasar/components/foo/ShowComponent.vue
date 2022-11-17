<template>
  <Toolbar :actions="['delete']" @delete="deleteItem">
    <template #left>
      <Breadcrumb :values="breadcrumb" />
    </template>
  </Toolbar>

  <div v-if="item" class="table-responsive">
    <q-markup-table>
      <thead>
        <tr>
          <th>\{{ $t('{{labels.field}}') }}</th>
          <th>\{{ $t('{{labels.value}}') }}</th>
        </tr>
      </thead>
      <tbody>
        {{#each fields}}
        <tr>
          <td>\{{ $t('{{lc}}.{{name}}') }}</td>

          <td>
            {{#if isReferences}}
            <template v-if="router.hasRoute('{{reference.title}}Show')">
              <router-link
                v-for="{{lowercase reference.title}} in item.{{reference.name}}"
                :to="{ name: '{{reference.title}}Show', params: { id: {{lowercase reference.title}} } }"
                :key="{{lowercase reference.title}}"
              >
                \{{ {{lowercase reference.title}} }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="{{lowercase reference.title}} in item.{{reference.name}}"
                :key="{{lowercase reference.title}}"
              >
                \{{ {{lowercase reference.title}} }}
              </p>
            </template>
            {{else if reference}}
            <router-link
              v-if="router.hasRoute('{{reference.title}}Show')"
              :to="{ name: '{{reference.title}}Show', params: { id: item.{{lowercase reference.title}} } }"
            >
              \{{ item.{{lowercase reference.title}} }}
            </router-link>

            <p v-else>
              \{{ item.{{lowercase reference.title}} }}
            </p>
            {{else if isEmbeddeds}}
            <template v-if="router.hasRoute('{{embedded.title}}Show')">
              <router-link
                v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
                :to="{ name: '{{embedded.title}}Show', params: { id: {{lowercase embedded.title}}['@id'] } }"
                :key="{{lowercase embedded.title}}['@id']"
              >
                \{{ {{lowercase embedded.title}}["@id"] }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
                :key="{{lowercase embedded.title}}['@id']"
              >
                \{{ {{lowercase embedded.title}}["@id"] }}
              </p>
            </template>
            {{else if embedded}}
            <router-link
              v-if="router.hasRoute('{{embedded.title}}Show')"
              :to="{ name: '{{embedded.title}}Show', params: { id: item.{{lowercase embedded.title}}['@id'] } }"
            >
              \{{ item.{{lowercase embedded.title}}["@id"] }}
            </router-link>

            <p v-else>
              \{{ item.{{lowercase embedded.title}}["@id"] }}
            </p>
            {{else if (compare type "==" "dateTime") }}
            \{{ formatDateTime(item.{{name}}) }}
            {{else}}
            \{{ item.{{name}} }}
            {{/if}}
          </td>
        </tr>
        {{/each }}
      </tbody>
    </q-markup-table>
  </div>

  <Loading :showing="isLoading" />
</template>

<script lang="ts" setup>
import Toolbar from 'src/components/common/ToolbarComponent.vue';
import Breadcrumb from 'src/components/common/BreadcrumbComponent.vue';
import Loading from 'src/components/common/LoadingComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { use{{titleUcFirst}}ShowStore } from 'src/stores/{{lc}}/show';
import { storeToRefs } from 'pinia';
import { formatDateTime } from 'src/utils/dates';
import { onBeforeUnmount } from 'vue';
import { use{{titleUcFirst}}DeleteStore } from 'src/stores/{{lc}}/delete';
import { useBreadcrumb } from 'src/composables/breadcrumb';
import { useWatchErrors } from 'src/composables/errors';
import { useMercureItem } from 'src/composables/mercureItem';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}ShowStore = use{{titleUcFirst}}ShowStore();
const { retrieved: item, isLoading, error } = storeToRefs({{lc}}ShowStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted, error: deleteError } = storeToRefs({{lc}}DeleteStore);

useMercureItem({
  store: {{lc}}ShowStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: '{{titleUcFirst}}List',
});

await {{lc}}ShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    {{lc}}DeleteStore.setError(t('This item does not exist anymore'));
    return;
  }

  await {{lc}}DeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: '{{titleUcFirst}}List' });
}

useWatchErrors([error, deleteError]);

onBeforeUnmount(() => {
  {{lc}}ShowStore.$reset();
});
</script>
