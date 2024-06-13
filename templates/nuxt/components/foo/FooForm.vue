<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    {{#forEach fields}}
    <div class="mb-2">
      <label
        for="{{../lc}}_{{name}}"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        {{name}}
      </label>
      {{#if isRelations}}
      <FormRepeater
        :values="item.{{name}}"
        @update="(values: any[]) => (item.{{name}} = values)"
      />
      {{else}}
      <input
        id="{{../lc}}_{{name}}"
        v-model="item.{{name}}"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.{{name}} ? 'border-red-500' : 'border-gray-300',
        ]"
        {{#compare htmlInputType "==" "dateTime" }}
        type="date"
        {{else}}
        type="{{htmlInputType}}"
        {{/compare}}
        {{#if step}}
        step="{{step}}"
        {{/if}}
        {{#if required}}
        required
        {{/if}}
        placeholder="{{description}}"
      />
      {{/if}}
      <div
        v-if="violations?.{{name}}"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        \{{ violations.{{name}} }}
      </div>
    </div>
    {{/forEach}}

    <button
      type="submit"
      class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import { Ref } from "vue";
{{#if hasIsRelations}}
import FormRepeater from "~~/components/common/FormRepeater.vue";
{{/if}}
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: {{titleUcFirst}};
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<{{titleUcFirst}}> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    {{#each fields}}
    {{#compare htmlInputType "==" "dateTime" }}
    {{name}}: formatDateInput(props.values.{{name}}),
    {{/compare}}
    {{#if isEmbeddeds}}
    {{name}}: props.values.{{name}}?.map((item: any) => item["@id"] ?? "") ?? [],
    {{else if embedded}}
    {{name}}: props.values.{{name}}?.["@id"],
    {{/if}}
    {{/each}}
  };
}

let emit = defineEmits<{
  (e: "submit", item: {{titleUcFirst}}): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
