<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    {{#each formFields}}
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
        @update="(values) => (item.{{name}} = values)"
      />
      {{else}}
      <input
        id="{{../lc}}_{{name}}"
        v-model="item.{{name}}"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.{{name}} ? 'border-red-500' : 'border-gray-300',
        ]"
        {{#compare type "==" "dateTime" }}
        type="date"
        {{/compare}}
        {{#compare type "!=" "dateTime" }}
        type="{{type}}"
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
    {{/each}}

    <button
      type="submit"
      class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import { toRef, ref, type Ref } from "vue";
{{#if hasManyRelations}}
import FormRepeater from "@/components/common/FormRepeater.vue";
{{/if}}
{{#if hasDateField}}
import { formatDateInput } from "@/utils/date";
{{/if}}
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { SubmissionErrors } from "@/types/error";

const props = defineProps<{
  values?: {{titleUcFirst}};
  errors?: SubmissionErrors;
}>();

const emit = defineEmits<{
  (e: "submit", item: {{titleUcFirst}}): void;
}>();

const violations = toRef(props, "errors");

let item: Ref<{{titleUcFirst}}> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    {{#each fields}}
    {{#compare type "==" "dateTime" }}
    publicationDate: formatDateInput(props.values.publicationDate),
    {{/compare}}
    {{#if isEmbeddeds}}
    {{name}}: props.values.{{name}}?.map((item: any) => item["@id"] ?? "") ?? [],
    {{else if embedded}}
    {{name}}: props.values.{{name}}?.["@id"],
    {{/if}}
    {{/each}}
  };
}

function emitSubmit() {
  emit("submit", item.value);
}
</script>
