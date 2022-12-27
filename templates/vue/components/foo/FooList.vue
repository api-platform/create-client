<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl my-4">{{title}} List</h1>

      <router-link
        :to="{ name: '{{titleUcFirst}}Create' }"
        class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Create
      </router-link>
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
      <template v-if="deletedItem">
        \{{ deletedItem["@id"] }} deleted.
      </template>
      <template v-else-if="mercureDeletedItem">
        \{{ mercureDeletedItem["@id"] }} deleted by another user.
      </template>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="border-b">
          <tr>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
              id
            </th>
            {{#each fields}}
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
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
          <tr v-for="item in items" :key="item['@id']" class="border-b">
            <td class="px-6 py-4 text-sm">
              <router-link
                v-if="item"
                :to="{ name: '{{titleUcFirst}}Show', params: { id: item['@id'] } }"
                class="text-blue-600 hover:text-blue-800"
              >
                \{{ item["@id"] }}
              </router-link>
            </td>
            {{#each fields}}
            <td class="px-6 py-4 text-sm">
            {{#if isReferences}}
            <template v-if="router.hasRoute('{{reference.title}}Show')">
              <router-link
                v-for="{{lowercase reference.title}} in item.{{reference.name}}"
                :to="{ name: '{{reference.title}}Show', params: { id: {{lowercase reference.title}} } }"
                :key="{{lowercase reference.title}}"
                class="text-blue-600 hover:text-blue-800"
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
                class="text-blue-600 hover:text-blue-800"
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
                class="text-blue-600 hover:text-blue-800"
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
              class="text-blue-600 hover:text-blue-800"
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
            {{/each}}
            <td class="px-6 py-4 text-sm">
              <router-link
                :to="{ name: '{{titleUcFirst}}Show', params: { id: item['@id'] } }"
                class="px-6 py-2 bg-blue-600 text-white text-xs rounded shadow-md hover:bg-blue-700"
              >
                Show
              </router-link>
            </td>
            <td class="px-6 py-4 text-sm">
              <router-link
                :to="{ name: '{{titleUcFirst}}Update', params: { id: item['@id'] } }"
                class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
              >
                Edit
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="view" class="flex justify-center">
      <nav aria-label="Page navigation">
        <ul class="flex list-style-none">
          <li :class="{ disabled: !view['{{hydraPrefix}}previous'] }">
            <router-link
              :to="
                view['{{hydraPrefix}}first']
                  ? view['{{hydraPrefix}}first']
                  : { name: '{{titleUcFirst}}List' }
              "
              aria-label="First page"
              :class="
                !view['{{hydraPrefix}}previous']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
            >
              <span aria-hidden="true">&lArr;</span> First
            </router-link>
          </li>

          <li :class="{ disabled: !view['{{hydraPrefix}}previous'] }">
            <router-link
              :to="
                !view['{{hydraPrefix}}previous'] ||
                view['{{hydraPrefix}}previous'] === view['{{hydraPrefix}}first']
                  ? { name: '{{titleUcFirst}}List' }
                  : view['{{hydraPrefix}}previous']
              "
              :class="
                !view['{{hydraPrefix}}previous']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
              aria-label="Previous page"
            >
              <span aria-hidden="true">&larr;</span> Previous
            </router-link>
          </li>

          <li :class="{ disabled: !view['{{hydraPrefix}}next'] }">
            <router-link
              :to="view['{{hydraPrefix}}next'] ? view['{{hydraPrefix}}next'] : '#'"
              :class="
                !view['{{hydraPrefix}}next']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
              aria-label="Next page"
            >
              Next <span aria-hidden="true">&rarr;</span>
            </router-link>
          </li>

          <li :class="{ disabled: !view['{{hydraPrefix}}next'] }">
            <router-link
              :to="view['{{hydraPrefix}}last'] ? view['{{hydraPrefix}}last'] : '#'"
              :class="
                !view['{{hydraPrefix}}next']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
              aria-label="Last page"
            >
              Last <span aria-hidden="true">&rArr;</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
{{#if hasRelationsOrManyRelations}}
import { useRouter } from "vue-router";
{{/if}}
import { storeToRefs } from "pinia";
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import { use{{titleUcFirst}}ListStore } from "@/stores/{{lc}}/list";
{{#if hasDateField}}
import { formatDateTime } from "@/utils/date";
{{/if}}
import { useMercureList } from "@/composables/mercureList";

const route = useRoute();
{{#if hasRelationsOrManyRelations}}
const router = useRouter();
{{/if}}

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { deleted: deletedItem, mercureDeleted: mercureDeletedItem } =
  storeToRefs({{lc}}DeleteStore);

const {{lc}}ListStore = use{{titleUcFirst}}ListStore();
const { items, error, view, isLoading } = storeToRefs({{lc}}ListStore);

useMercureList({ store: {{lc}}ListStore, deleteStore: {{lc}}DeleteStore });

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage as string;
    {{lc}}ListStore.getItems(page);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  {{lc}}DeleteStore.$reset();
});
</script>
