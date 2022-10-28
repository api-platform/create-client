<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { use{{titleUcFirst}}ShowStore } from "@/stores/{{lc}}/show";
import { use{{titleUcFirst}}DeleteStore } from "@/stores/{{lc}}/delete";
import { storeToRefs } from "pinia";
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

<template>
  <h1>Show {{titleUcFirst}} \{{ item?.["@id"] }}</h1>

  <div v-if="isLoading" class="alert alert-info" role="status">Loading...</div>
  <div v-if="error" class="alert alert-danger" role="alert">
    <i class="bi-exclamation-triangle" />
    \{{ error }}
  </div>
  <div v-if="deleteError" class="alert alert-danger" role="alert">
    <i class="bi-exclamation-triangle" />
    \{{ deleteError }}
  </div>

  <div v-if="item" class="table-responsive">
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {{#each fields}}
        <tr>
          <th scope="row">{{name}}</th>
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
        {{/each}}
      </tbody>
    </table>
  </div>

  <router-link :to="{ name: '{{titleUcFirst}}List' }" class="btn btn-primary">
    Back to list
  </router-link>
  <router-link
    v-if="item"
    :to="{ name: '{{titleUcFirst}}Update', params: { id: item['@id'] } }"
    class="btn btn-warning"
  >
    Edit
  </router-link>
  <button class="btn btn-danger" @click="deleteItem">Delete</button>
</template>
