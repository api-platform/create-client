<template>
  <Toolbar :actions="['add']" @add="goToCreatePage">
    <template #left>
      <Breadcrumb :values="breadcrumb" />
    </template>
  </Toolbar>

  <q-banner v-if="deleted" class="bg-positive text-white q-ma-md">
    \{{ deleted['@id'] }} deleted.
  </q-banner>
  <q-banner v-if="mercureDeleted" class="bg-positive text-white q-ma-md">
    \{{ mercureDeleted['@id'] }} deleted by another user.
  </q-banner>

  {{#if parameters.length}}
  <DataFilter @filter="onSendFilter" @reset="resetFilter">
    <template #filter>
      <{{titleUcFirst}}Filter :values="filters" />
    </template>
  </DataFilter>
  {{/if}}

  <q-table
    v-model:pagination="pagination"
    :rows="items"
    :columns="columns"
    :loading="isLoading"
    :no-data-label="$t('{{{labels.unavail}}}')"
    :no-results-label="$t('{{{labels.noresults}}}')"
    :loading-label="$t('{{{labels.loading}}}')"
    :rows-per-page-label="$t('{{{labels.recPerPage}}}')"
    row-key="id"
    flat
    wrap-cells
    @request="sendRequest"
  >
    <template #body-cell-actions="{ row }">
      <ActionCell
        :actions="['show', 'edit', 'delete']"
        @show="goToShowPage(row)"
        @edit="gotToEditPage(row)"
        @delete="deleteItem(row)"
      />
    </template>

    {{#each fields}}
    {{#if isReferences}}
    <template #body-cell-{{lowercase reference.title}}="{ value }">
      <td>
        <template v-if="router.hasRoute('{{reference.title}}Show')">
          <router-link
            v-for="{{lowercase reference.title}} in value"
            :to="{ name: '{{reference.title}}Show', params: { id: {{lowercase reference.title}} } }"
            :key="{{lowercase reference.title}}"
          >
            \{{ {{lowercase reference.title}} }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="{{lowercase reference.title}} in value" :key="{{lowercase reference.title}}">
            \{{ {{lowercase reference.title}} }}
          </p>
        </template>
      </td>
    </template>
    {{else if reference}}
    <template #body-cell-{{lowercase reference.title}}="{ value }">
      <td>
        <router-link
          v-if="router.hasRoute('{{reference.title}}Show')"
          :to="{ name: '{{reference.title}}Show', params: { id: value } }"
        >
          \{{ value }}
        </router-link>

        <p v-else>
          \{{ value }}
        </p>
      </td>
    </template>
    {{else if isEmbeddeds}}
    <template #body-cell-{{lowercase embedded.title}}="{ value }">
      <td>
        <template v-if="router.hasRoute('{{embedded.title}}Show')">
          <router-link
            v-for="{{lowercase embedded.title}} in value"
            :to="{ name: '{{embedded.title}}Show', params: { id: {{lowercase embedded.title}}['@id'] } }"
            :key="{{lowercase embedded.title}}['@id']"
          >
            \{{ {{lowercase embedded.title}}['@id'] }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="{{lowercase embedded.title}} in value" :key="{{lowercase embedded.title}}['@id']">
            \{{ {{lowercase embedded.title}}['@id'] }}
          </p>
        </template>
      </td>
    </template>
    {{else if embedded}}
    <template #body-cell-{{lowercase embedded.title}}="{ value }">
      <td>
        <router-link
          v-if="router.hasRoute('{{embedded.title}}Show')"
          :to="{ name: '{{embedded.title}}Show', params: { id: value['@id'] } }"
        >
          \{{ value['@id'] }}
        </router-link>

        <p v-else>
          \{{ value['@id'] }}
        </p>
      </td>
    </template>
    {{/if}}
    {{/each}}
  </q-table>
</template>

<script lang="ts" setup>
{{#if parameters.length }}
import DataFilter from 'src/components/common/DataFilterComponent.vue';
import {{titleUcFirst}}Filter from 'src/components/{{lc}}/FilterComponent.vue';
{{/if}}
import Toolbar from 'src/components/common/ToolbarComponent.vue';
import Breadcrumb from 'src/components/common/BreadcrumbComponent.vue';
import ActionCell from 'src/components/common/ActionCellComponent.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { formatDateTime } from 'src/utils/date';
import { use{{titleUcFirst}}ListStore } from 'stores/{{lc}}/list';
import { use{{titleUcFirst}}DeleteStore } from 'stores/{{lc}}/delete';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, ref, watch } from 'vue';
import { useBreadcrumb } from 'src/composables/breadcrumb';
import { useWatchErrors } from 'src/composables/errors';
import { useMercureList } from 'src/composables/mercureList';

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, totalItems, error, isLoading } = storeToRefs({{lc}}ListStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted, mercureDeleted } = storeToRefs({{lc}}DeleteStore);

async function sendRequest(params = {}) {
  await {{lc}}ListStore.getItems(params);
}

useMercureList({ store: {{lc}}ListStore, deleteStore: {{lc}}DeleteStore });

const nextPage = ref(1);
const pagination = {
  sortBy: undefined,
  descending: false,
  page: 1, // page to be displayed
  rowsPerPage: 3, // maximum displayed rows
  rowsNumber: 10, // max number of rows
};
const filters = ref({});
const columns = [
  { name: 'actions', label: t('actions'), field: '' },
  { name: 'id', field: '@id', label: t('id') },
  {{#each fields}}
  {
    name: '{{name}}',
    field: '{{name}}',
    label: t('{{lc}}.{{name}}'),
    {{#if sortable }}
    sortable: true,
    {{/if}}
    {{#compare type "==" "dateTime" }}
    format: (value: string) => {
      return formatDateTime(value);
    },
    {{/compare}}
  }
  {{/each }}
];

await sendRequest({ pagination });

watch(items, () => {
  pagination.page = nextPage.value;
  pagination.rowsNumber = totalItems.value;
  nextPage.value = 1;
});

function onSendFilter() {
  sendRequest({
    filters: filters.value,
    pagination,
  });
}

function resetFilter() {
  filters.value = {};
}

function goToCreatePage() {
  router.push({ name: '{{titleUcFirst}}Create' });
}

function goToShowPage(item: {{titleUcFirst}}) {
  router.push({
    name: '{{titleUcFirst}}Show',
    params: { id: item['@id'] },
  });
}

function gotToEditPage(item: {{titleUcFirst}}) {
  router.push({
    name: '{{titleUcFirst}}Update',
    params: { id: item['@id'] },
  });
}

async function deleteItem(item: {{titleUcFirst}}) {
  await {{lc}}DeleteStore.deleteItem(item);

  sendRequest({ pagination });
}

useWatchErrors([error]);

onBeforeUnmount(() => {
  {{lc}}DeleteStore.$reset();
});
</script>
