<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">
      <router-link
        :to="{ name: '{{titleUcFirst}}List' }"
        class="text-blue-600 hover:text-blue-800"
      >
        &lt; Back to list
      </router-link>

      <div>
        <router-link
          v-if="item"
          :to="{ name: '{{titleUcFirst}}Update', params: { id: item['@id'] } }"
          class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
        >
          Edit
        </router-link>
        <button
          class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
          @click="deleteItem"
        >
          Delete
        </button>
      </div>
    </div>

    <h1 class="text-3xl my-4">Show {{titleUcFirst}} \{{ item?.["@id"] }}</h1>

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
              {{name}}
            </th>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
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
          </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { use{{titleUcFirst}}ShowStore } from "@/stores/{{lc}}/show";
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import { formatDateTime } from "@/utils/date";
import { useMercureItem } from "@/composables/mercureItem";

const route = useRoute();
const router = useRouter();

const {{lc}}DeleteStore = use{{titleUcFirst}}DeleteStore();
const { error: deleteError, deleted } = storeToRefs({{lc}}DeleteStore);

const {{lc}}ShowStore = use{{titleUcFirst}}ShowStore();
const { retrieved: item, isLoading, error } = storeToRefs({{lc}}ShowStore);

useMercureItem({
  store: {{lc}}ShowStore,
  deleteStore: {{lc}}DeleteStore,
  redirectRouteName: "{{titleUcFirst}}List",
});

await {{lc}}ShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    {{lc}}DeleteStore.setError("This item does not exist anymore");
    return;
  }

  if (window.confirm("Are you sure you want to delete this {{lc}}?")) {
    await {{lc}}DeleteStore.deleteItem(item.value);

    if (deleted) {
      router.push({ name: "{{titleUcFirst}}List" });
    }
  }
}

onBeforeUnmount(() => {
  {{lc}}ShowStore.$reset();
});
</script>

