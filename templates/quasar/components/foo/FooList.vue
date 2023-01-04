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
      <Filter :values="filters" />
    </template>
  </DataFilter>
  {{/if}}

  <q-table
    :pagination="pagination"
    :rows="items"
    :columns="columns"
    :rows-per-page-options="[30]"
    :loading="isLoading"
    :no-data-label="$t('unavail')"
    :no-results-label="$t('noresults')"
    :loading-label="$t('loading')"
    :rows-per-page-label="$t('recPerPage')"
    row-key="id"
    flat
    wrap-cells
    @request="sendRequest"
  >
    <template #body-cell-actions="{ row }">
      <ActionCell
        :actions="['show', 'update', 'delete']"
        @show="goToShowPage(row)"
        @update="goToUpdatePage(row)"
        @delete="deleteItem(row)"
      />
    </template>

    {{#each fields}}
    {{#if isReferences}}
    <template #body-cell-{{reference.name}}="{ value }">
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
    <template #body-cell-{{embedded.name}}="{ value }">
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

    <template #pagination="{ pagesNumber }">
      <template v-if="view">
        <q-btn
          v-if="pagesNumber > 2"
          :to="view['hydra:first'] ? view['hydra:first'] : { name: 'BookList' }"
          :disable="!view['hydra:previous']"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
        />

        <q-btn
          :to="
            !view['hydra:previous'] ||
            view['hydra:previous'] === view['hydra:first']
              ? { name: 'BookList' }
              : view['hydra:previous']
          "
          :disable="!view['hydra:previous']"
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
        />

        <q-btn
          :to="view['hydra:next'] ? view['hydra:next'] : '#'"
          :disable="!view['hydra:next']"
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
        />

        <q-btn
          v-if="pagesNumber > 2"
          :to="view['hydra:last'] ? view['hydra:last'] : '#'"
          :disable="!view['hydra:next']"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
        />
      </template>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
{{#if parameters.length }}
import DataFilter from 'src/components/common/CommonDataFilter.vue';
import Filter from 'src/components/{{lc}}/{{titleUcFirst}}Filter.vue';
{{/if}}
import Toolbar from 'src/components/common/CommonToolbar.vue';
import Breadcrumb from 'src/components/common/CommonBreadcrumb.vue';
import ActionCell from 'src/components/common/CommonActionCell.vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
{{#if hasDateField}}
import { formatDateTime } from 'src/utils/date';
{{/if}}
import { use{{titleUcFirst}}ListStore } from 'stores/{{lc}}/list';
import { use{{titleUcFirst}}DeleteStore } from 'stores/{{lc}}/delete';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount{{#if parameters.length}}, Ref{{/if}}, ref, watch } from 'vue';
import { useBreadcrumb } from 'src/composables/breadcrumb';
import { useWatchErrors } from 'src/composables/errors';
import { useMercureList } from 'src/composables/mercureList';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import { Pagination{{#if parameters.length}}, Filters{{/if}} } from 'src/types/list';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, totalItems, view, error, isLoading } = storeToRefs({{lc}}ListStore);

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted, mercureDeleted } = storeToRefs({{lc}}DeleteStore);

const page = ref('1');
{{#if parameters.length}}
const filters: Ref<Filters> = ref({});
{{/if}}
const pagination: Pagination = {
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 1,
};
const columns = [
  { name: 'actions', label: t('actions'), field: '' },
  { name: 'id', field: '@id', label: t('id') },
  {{#each fields}}
  {
    name: '{{name}}',
    field: '{{name}}',
    label: t('{{../lc}}.{{name}}'),
    {{#if sortable }}
    sortable: true,
    {{/if}}
    {{#compare type "==" "dateTime" }}
    format: (value: string) => {
      return formatDateTime(value);
    },
    {{/compare}}
  },
  {{/each }}
];

watch(
  () => route.query.page,
  (newPage) => {
    page.value = newPage as string;
    sendRequest();
  },
  { immediate: true }
);

async function sendRequest() {
  await {{lc}}ListStore.getItems(page.value, { {{#if parameters.length}}...filters.value{{/if}} });
}

useMercureList({ store: {{lc}}ListStore, deleteStore: {{lc}}DeleteStore });

await sendRequest();

pagination.rowsPerPage = items.value.length;
pagination.rowsNumber = totalItems.value;

{{#if parameters.length}}
function onSendFilter() {
  sendRequest();
}

function resetFilter() {
  filters.value = {};

  sendRequest();
}
{{/if}}

function goToCreatePage() {
  router.push({ name: '{{titleUcFirst}}Create' });
}

function goToShowPage(item: {{titleUcFirst}}) {
  router.push({
    name: '{{titleUcFirst}}Show',
    params: { id: item['@id'] },
  });
}

function goToUpdatePage(item: {{titleUcFirst}}) {
  router.push({
    name: '{{titleUcFirst}}Update',
    params: { id: item['@id'] },
  });
}

async function deleteItem(item: {{titleUcFirst}}) {
  await {{lc}}DeleteStore.deleteItem(item);

  sendRequest();
}

useWatchErrors([error]);

onBeforeUnmount(() => {
  {{lc}}DeleteStore.$reset();
});
</script>
