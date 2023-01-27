<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4">
      \{{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4">
      \{{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4">
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
          @show="goToShowPage(item.raw)"
          @update="goToUpdatePage(item.raw)"
          @delete="deleteItem(item.raw)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link
          :to="{ name: '{{titleUcFirst}}Show', params: { id: item.raw['@id'] } }"
        >
          \{{ item.raw["@id"] }}
        </router-link>
      </template>

      {{#each fields}}
      {{#if isReferences}}
      <template #item.{{reference.name}}="{ item }">
        <template v-if="router.hasRoute('{{reference.title}}Show')">
          <router-link
            v-for="{{lowercase reference.title}} in item.raw.{{reference.name}}"
            :to="{ name: '{{reference.title}}Show', params: { id: {{lowercase reference.title}} } }"
            :key="{{lowercase reference.title}}"
          >
            \{{ {{lowercase reference.title}} }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="{{lowercase reference.title}} in item.raw.{{reference.name}}" :key="{{lowercase reference.title}}">
            \{{ {{lowercase reference.title}} }}
          </p>
        </template>
      </template>
      {{else if reference}}
      <template #item.{{lowercase reference.title}}="{ item }">
        <router-link
          v-if="router.hasRoute('{{reference.title}}Show')"
          :to="{ name: '{{reference.title}}Show', params: { id: item.raw.{{lowercase reference.title}} } }"
        >
          \{{ item.raw.{{lowercase reference.title}} }}
        </router-link>

        <p v-else>
          \{{ item.raw.{{lowercase reference.title}} }}
        </p>
      </template>
      {{else if isEmbeddeds}}
      <template #item.{{embedded.name}}="{ item }">
        <template v-if="router.hasRoute('{{embedded.title}}Show')">
          <router-link
            v-for="{{lowercase embedded.title}} in item.raw.{{embedded.name}}"
            :to="{ name: '{{embedded.title}}Show', params: { id: {{lowercase embedded.title}}['@id'] } }"
            :key="{{lowercase embedded.title}}['@id']"
          >
            \{{ {{lowercase embedded.title}}["@id"] }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="{{lowercase embedded.title}} in item.raw.{{embedded.name}}" :key="{{lowercase embedded.title}}['@id']">
            \{{ {{lowercase embedded.title}}["@id"] }}
          </p>
        </template>
      </template>
      {{else if embedded}}
      <template #item.{{lowercase embedded.title}}="{ item }">
        <router-link
          v-if="router.hasRoute('{{embedded.title}}Show')"
          :to="{ name: '{{embedded.title}}Show', params: { id: item.raw.{{lowercase embedded.title}}['@id'] } }"
        >
          \{{ item.raw.{{lowercase embedded.title}}["@id"] }}
        </router-link>

        <p v-else>
          \{{ item.raw.{{lowercase embedded.title}}["@id"] }}
        </p>
      </template>
      {{else if (compare type "==" "dateTime") }}
      <template #item.{{name}}="{ item }">
        \{{ formatDateTime(item.raw.{{name}}) }}
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
  { title: t("id"), key: "@id" },
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
    name: "{{titleUcFirst}}Show",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "{{titleUcFirst}}Create",
  });
}

function goToUpdatePage(item: {{titleUcFirst}}) {
  router.push({
    name: "{{titleUcFirst}}Update",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: {{titleUcFirst}}) {
  await {{lc}}DeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  {{lc}}DeleteStore.$reset();
});
</script>
