<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" closable>
      \{{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" closable>
      \{{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" closable>
      \{{ error }}
    </v-alert>

    {{#if parameters.length}}
    <DataFilter @filter="onSendFilter" @reset="resetFilter">
      <template #filter>
        <Filter :values="filters" />
      </template>
    </DataFilter>
    {{/if}}

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="
            (toggleConfirmDelete) => deleteItem(item, toggleConfirmDelete)
          "
        />
      </template>

      <template #item.id="{ item }">
        <router-link
          :to="{
            name: '/{{lc}}s/show.[id]',
            params: { id: encodeURIComponent(item['@id']) },
          }"
        >
          \{{ item["@id"] }}
        </router-link>
      </template>

      {{#each fields}}
      {{#if isReferences}}
      <template #item.{{reference.name}}="{ item }">
        <template
          v-if="router.hasRoute('/{{lowercase reference.title}}s/show.[id]')"
        >
          <router-link
            v-for="{{lowercase reference.title}} in item.{{reference.name}}"
            :to="{ name: '/{{lowercase reference.title}}s/show/.id', params: { id: encodeURIComponent({{lowercase reference.title}}) } }"
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
      </template>
      {{else if reference}}
      <template #item.{{lowercase reference.title}}="{ item }">
        <router-link
          v-if="router.hasRoute('/{{lowercase reference.title}}s/show.[id]')"
          :to="{ name: '/{{lowercase reference.title}}s/show.[id]', params: { id: item.{{lowercase reference.title}} } }"
        >
          \{{ item.{{lowercase reference.title}} }}
        </router-link>

        <p v-else>\{{ item.{{lowercase reference.title}} }}</p>
      </template>
      {{else if isEmbeddeds}}
      <template #item.{{embedded.name}}="{ item }">
        <template
          v-if="router.hasRoute('/{{lowercase embedded.title}}s/show.[id]')"
        >
          <router-link
            v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
            :to="{ name: '/{{lowercase embedded.title}}s/show.[id]', params: { id: encodeURIComponent({{lowercase embedded.title}}['@id']) } }"
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
      </template>
      {{else if embedded}}
      <template #item.{{lowercase embedded.title}}="{ item }">
        <router-link
          v-if="router.hasRoute('/{{lowercase embedded.title}}s/show.[id]')"
          :to="{ name: '/{{lowercase embedded.title}}s/show.[id]', params: { id: encodeURIComponent(item.{{lowercase embedded.title}}['@id']) } }"
        >
          \{{ item.{{lowercase embedded.title}}["@id"] }}
        </router-link>

        <p v-else>\{{ item.{{lowercase embedded.title}}["@id"] }}</p>
      </template>
      {{else if (compare htmlInputType "==" "dateTime") }}
      <template #item.{{name}}="{ item }">
        \{{ formatDateTime(item.{{name}}) }}
      </template>
      {{/if}}
      {{/each}}
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount{{#if parameters.length}}, Ref{{/if}} } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { use{{titleUcFirst}}ListStore } from "@/store/{{lc}}/list";
import { use{{titleUcFirst}}DeleteStore } from "@/store/{{lc}}/delete";
import Toolbar from "@/components/common/Toolbar.vue";
{{#if parameters.length }}
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/{{lc}}/{{titleUcFirst}}Filter.vue";
{{/if}}
import ActionCell from "@/components/common/ActionCell.vue";
{{#if hasDateField}}
import { formatDateTime } from "@/utils/date";
{{/if}}
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { {{#if parameters.length}}Filters, {{/if}}VuetifyOrder } from "@/types/list";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted, mercureDeleted } = storeToRefs({{lc}}DeleteStore);

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, totalItems, error, isLoading } = storeToRefs({{lc}}ListStore);

const page = ref("1");
{{#if parameters.length}}
const filters: Ref<Filters> = ref({});
{{/if}}
const order = ref({});

async function sendRequest() {
  await {{lc}}ListStore.getItems({
    page: page.value,
    order: order.value,
    {{#if parameters.length}}
    ...filters.value,
    {{/if}}
  });
}

useMercureList({ store: {{lc}}ListStore, deleteStore: {{lc}}DeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "id", value: "@id" },
  {{#each fields}}
  {
    title: t("{{../lc}}.{{name}}"),
    key: "{{name}}",
    sortable: {{#if sortable}}true{{else}}false{{/if}},
  },
  {{/each}}
];

function updatePage(newPage: string) {
  page.value = newPage;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  const newOrder = newOrders[0];
  order.value = { [newOrder.key]: newOrder.order };

  sendRequest();
}

{{#if parameters.length}}
function onSendFilter() {
  sendRequest();
}

function resetFilter() {
  filters.value = {};

  sendRequest();
}
{{/if}}

function goToShowPage(item: {{titleUcFirst}}) {
  router.push({
    name: "/{{lc}}s/show.[id]",
    params: { id: encodeURIComponent(item["@id"]) },
  });
}

function goToCreatePage() {
  router.push({
    name: "/{{lc}}s/create",
  });
}

function goToUpdatePage(item: {{titleUcFirst}}) {
  router.push({
    name: "/{{lc}}s/edit.[id]",
    params: { id: encodeURIComponent(item["@id"]) },
  });
}

async function deleteItem(item: {{titleUcFirst}}, toggleConfirmDelete: () => void) {
  await {{lc}}DeleteStore.deleteItem(item);

  await sendRequest();
  toggleConfirmDelete()
}

onBeforeUnmount(() => {
  {{lc}}DeleteStore.$reset();
});
</script>
