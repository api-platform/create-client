<template>
  <div class="flex items-center justify-between">
    <h1 class="text-3xl my-4">{{titleUcFirst}} List</h1>

    <nuxt-link
      :to="{ name: '{{lc}}s-create' }"
      class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
    >
      Create
    </nuxt-link>
  </div>

  <div
    v-if="isLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    \{{ error }}
  </div>

  <div
    v-if="deletedItem || mercureDeletedItem"
    class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm"
    role="status"
  >
    <template v-if="deletedItem">\{{ deletedItem["@id"] }} deleted.</template>
    <template v-else-if="mercureDeletedItem">
      \{{ mercureDeletedItem["@id"] }} deleted by another user.
    </template>
  </div>

  <div v-if="!isLoading" class="overflow-x-auto">
    <table class="min-w-full">
      <thead class="border-b">
        <tr>
          <th class="text-sm font-medium px-6 py-4 text-left capitalize">
            id
          </th>
          {{#each fields}}
          <th class="text-sm font-medium px-6 py-4 text-left capitalize">
            {{name}}
          </th>
          {{/each }}
          <th
            colspan="2"
            class="text-sm font-medium px-6 py-4 text-left capitalize"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-b">
          <td class="px-6 py-4 text-sm">
            <nuxt-link
              :to="{ name: '{{lc}}s-id', params: { id: item.id } }"
              class="text-blue-600 hover:text-blue-800"
            >
              \{{ item["@id"] }}
            </nuxt-link>
          </td>
          {{#each fields}}
          <td class="px-6 py-4 text-sm">
          {{#if isReferences}}
            <template v-if="router.hasRoute('{{reference.name}}-id')">
              <nuxt-link
                v-for="{{lowercase reference.title}} in item.{{reference.name}}"
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
                v-for="{{lowercase reference.title}} in item.{{reference.name}}"
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

            <p v-else>
              \{{ item.{{lowercase reference.title}} }}
            </p>
          {{else if isEmbeddeds}}
            <template v-if="router.hasRoute('{{embedded.name}}-id')">
              <nuxt-link
                v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
                :key="{{lowercase embedded.title}}.id"
                :to="{ name: '{{lowercase embedded.title}}s-id', params: { id: {{lowercase embedded.title}}.id } }"
                class="text-blue-600 hover:text-blue-800"
              >
                \{{ {{lowercase embedded.title}}["@id"] }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="{{lowercase embedded.title}} in item.{{embedded.name}}"
                :key="{{lowercase embedded.title}}.id"
              >
                \{{ {{lowercase embedded.title}}["@id"] }}
              </p>
            </template>
          {{else if embedded}}
            <nuxt-link
              v-if="router.hasRoute('{{embedded.name}}-id')"
              :to="{ name: '{{lowercase embedded.title}}s-id', params: { id: item.{{lowercase embedded.title}}.id } }"
              class="text-blue-600 hover:text-blue-800"
            >
              \{{ item.{{lowercase embedded.title}}["@id"] }}
            </nuxt-link>

            <p v-else>
              \{{ item.{{lowercase embedded.title}}["@id"] }}
            </p>
          {{else if (compare type "==" "dateTime") }}
            \{{ formatDateTime(item.{{name}}) }}
          {{else}}
            \{{ item.{{name}} }}
          {{/if}}
          </td>
          {{/each}}
          <td class="px-6 py-4 text-sm">
            <nuxt-link
              :to="{ name: '{{lc}}s-id', params: { id: item.id } }"
              class="px-6 py-2 bg-blue-600 text-white text-xs rounded shadow-md hover:bg-blue-700"
            >
              Show
            </nuxt-link>
          </td>
          <td class="px-6 py-4 text-sm">
            <nuxt-link
              :to="{ name: '{{lc}}s-id-edit', params: { id: item.id } }"
              class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
            >
              Edit
            </nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="view" class="flex justify-center">
    <nav aria-label="Page navigation">
      <ul class="flex list-style-none">
        <li :class="{ disabled: !pagination.previous }">
          <nuxt-link
            :to="{
              name: '{{lc}}s-page-page',
              params: { page: pagination.first },
            }"
            aria-label="First page"
            :class="
              !pagination.previous
                ? 'text-gray-500 pointer-events-none'
                : 'text-gray-800 hover:bg-gray-200'
            "
            class="block py-2 px-3 rounded"
          >
            <span aria-hidden="true">&lArr;</span> First
          </nuxt-link>
        </li>

        <li :class="{ disabled: !pagination.previous }">
          <nuxt-link
            :to="{
              name: '{{lc}}s-page-page',
              params: { page: pagination.previous ?? pagination.first },
            }"
            :class="
              !pagination.previous
                ? 'text-gray-500 pointer-events-none'
                : 'text-gray-800 hover:bg-gray-200'
            "
            class="block py-2 px-3 rounded"
            aria-label="Previous page"
          >
            <span aria-hidden="true">&larr;</span> Previous
          </nuxt-link>
        </li>

        <li :class="{ disabled: !pagination.next }">
          <nuxt-link
            :to="{
              name: '{{lc}}s-page-page',
              params: { page: pagination.next ?? pagination.last },
            }"
            :class="
              !pagination.next
                ? 'text-gray-500 pointer-events-none'
                : 'text-gray-800 hover:bg-gray-200'
            "
            class="block py-2 px-3 rounded"
            aria-label="Next page"
          >
            Next <span aria-hidden="true">&rarr;</span>
          </nuxt-link>
        </li>

        <li :class="{ disabled: !pagination.next }">
          <nuxt-link
            :to="{ name: '{{lc}}s-page-page', params: { page: pagination.last } }"
            :class="
              !pagination.next
                ? 'text-gray-500 pointer-events-none'
                : 'text-gray-800 hover:bg-gray-200'
            "
            class="block py-2 px-3 rounded"
            aria-label="Last page"
          >
            Last <span aria-hidden="true">&rArr;</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMercureList } from "~~/composables/mercureList";
import { use{{titleUcFirst}}DeleteStore } from "~~/stores/{{lc}}/delete";
import { use{{titleUcFirst}}ListStore } from "~~/stores/{{lc}}/list";
import { useFetchAll } from "~~/composables/api";
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";

{{#if hasRelations}}
const router = useRouter();
{{/if}}

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted: deletedItem, mercureDeleted: mercureDeletedItem } =
  storeToRefs({{lc}}DeleteStore);

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, view, error, isLoading, hubUrl } = await useFetchAll<{{titleUcFirst}}>(
  "{{name}}"
);
{{lc}}ListStore.setData({ items, view, error, isLoading, hubUrl });

const pagination = {
  first: view.value?.["hydra:first"]?.slice(-1),
  previous: view.value?.["hydra:previous"]?.slice(-1),
  next: view.value?.["hydra:next"]?.slice(-1),
  last: view.value?.["hydra:last"]?.slice(-1),
};

useMercureList({ store: {{lc}}ListStore, deleteStore: {{lc}}DeleteStore });

onBeforeUnmount(() => {
  {{lc}}ListStore.$reset();
  {{lc}}DeleteStore.$reset();
});
</script>
