<script lang="ts" setup>
{{#if hasManyRelations}}
import FormRepeater from "@/components/common/FormRepeater.vue";
{{/if}}
import { formatDateInput } from "@/utils/date";
import type { {{titleUcFirst}}, SubmissionErrors } from "@/utils/types";
import { toRef } from "vue";

const props = defineProps<{
  values?: {{titleUcFirst}};
  errors: SubmissionErrors | null;
}>();

const emit = defineEmits<{
  (e: "sendForm", item: {{titleUcFirst}}): void;
}>();

const violations = toRef(props, "errors");

let item: any = {};

if (props.values) {
  item = {
    ...props.values,
    {{#each fields}}
    {{#compare type "==" "dateTime" }}
    publicationDate: formatDateInput(props.values.publicationDate),
    {{/compare}}
    {{#if isEmbeddeds}}
    {{name}}: props.values.{{name}}?.map((item) => item["@id"] ?? "") ?? [],
    {{else if embedded}}
    {{name}}: props.values.{{name}}?.["@id"],
    {{/if}}
    {{/each}}
  };
}

function emitSendForm() {
  emit("sendForm", item);
}
</script>

<template>
  <form @submit.prevent="emitSendForm">
  {{#each formFields}}
    <div class="form-group">
      <label for="{{../lc}}_{{name}}" class="form-control-label">
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
          'form-control',
          violations?.{{name}} ? 'is-invalid' : 'is-valid'
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
      <div v-if="violations?.{{name}}" class="invalid-feedback">
        \{{ violations.{{name}} }}
      </div>
    </div>
    {{/each}}

    <button type="submit" class="btn btn-success">Submit</button>
  </form>
</template>
