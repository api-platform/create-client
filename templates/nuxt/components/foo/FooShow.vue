<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: '{{lc}}s' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <div>
      <nuxt-link
        v-if="item"
        :to="{
          name: '{{lc}}s-id-edit',
          params: { id: getIdFromIri(item['@id']) },
        }"
        class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Edit
      </nuxt-link>
      <button
        class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
        @click="deleteItem"
      >
        Delete
      </button>
    </div>
  </div>

  <h1 class="text-3xl my-4">Show {{ titleUcFirst }} \{{ item?.["@id"] }}</h1>

  <div
    v-if="isLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error || deleteError"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    \{{ error || deleteError }}
  </div>

  <div v-if="item" class="overflow-x-auto">
    <table class="min-w-full">
      <thead class="border-b">
        <tr>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
            Field
          </th>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {{#each fields}}
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            {{ name }}
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{#if isReferences}}
            <template v-if="router.hasRoute('{{reference.name}}-id')">
              <nuxt-link
                v-for="{{lowercase reference.title}} in item.{{name}}"
                :key="{{lowercase reference.title}}"
                :to="{ name: '{{lowercase reference.title}}s-id', params: { id: {{lowercase reference.title}} } }"
                class="text-blue-600 hover:text-blue-800"
              >
                \{{ {{lowercase reference.title}} }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="{{lowercase reference.title}} in item.{{name}}"
                :key="{{lowercase reference.title}}"
              >
                \{{ {{lowercase reference.title}} }}
              </p>
            </template>
            {{else if reference}}
            <nuxt-link
              v-if="router.hasRoute('{{reference.name}}-id')"
              :to="{ name: '{{lowercase reference.title}}s-id', params: { id: item.{{lowercase reference.title}} } }"
              class="text-blue-600 hover:text-blue-800"
            >
              \{{ item.{{lowercase reference.title}} }}
            </nuxt-link>

            <p v-else>\{{ item.{{lowercase reference.title}} }}</p>
            {{else if isEmbeddeds}}
            <template v-if="router.hasRoute('{{embedded.name}}-id')">
              <nuxt-link
                v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
                :key="{{lowercase embedded.title}}['@id']"
                :to="{ name: '{{lowercase embedded.title}}s-id', params: { id: getIdFromIri({{lowercase embedded.title}}['@id']) } }"
                class="text-blue-600 hover:text-blue-800"
              >
                \{{ {{lowercase embedded.title}}["@id"] }}

                <br />
              </nuxt-link>
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
            <nuxt-link
              v-if="router.hasRoute('{{embedded.name}}-id')"
              :to="{ name: '{{lowercase embedded.title}}s-id', params: { id: getIdFromIri(item.{{lowercase embedded.title}}['@id']) } }"
              class="text-blue-600 hover:text-blue-800"
            >
              \{{ item.{{lowercase embedded.title}}["@id"] }}
            </nuxt-link>

            <p v-else>\{{ item.{{lowercase embedded.title}}["@id"] }}</p>
            {{else if (compare htmlInputType "==" "dateTime") }}
            \{{ formatDateTime(item.{{name}}) }}
            {{else}}
            \{{ item.{{name}} }}
            {{/if}}
          </td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { use{{titleUcFirst}}ShowStore } from "~~/stores/{{lc}}/show";
import { use{{titleUcFirst}}DeleteStore } from "~~/stores/{{lc}}/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";

const route = useRoute();
const router = useRouter();

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { error: deleteError, deleted } = storeToRefs({{lc}}DeleteStore);

const {{lc}}ShowStore = use{{titleUcFirst}}ShowStore();

useMercureItem({
  store: {{lc}}ShowStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: "{{lc}}s",
});

const id = decodeURIComponent(route.params.id as string);
const {
  retrieved: item,
  isLoading,
  error,
  hubUrl,
} = await useFetchItem<{{titleUcFirst}}>(`{{name}}/${id}`);
{{lc}}ShowStore.setData({ retrieved: item, isLoading, error, hubUrl });

async function deleteItem() {
  if (!item?.value) {
    {{lc}}DeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this {{lc}}?")) {
    const { error } = await useDeleteItem(item.value);

    if (error.value) {
      {{lc}}DeleteStore.setError(error.value);
      return;
    }

    {{lc}}DeleteStore.setDeleted(item.value);
    {{lc}}DeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "{{lc}}s" });
    }
  }
}

onBeforeUnmount(() => {
  {{lc}}ShowStore.$reset();
});
</script>
