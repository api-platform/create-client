<template>
  <q-form class="q-pa-md q-col-gutter-y-md" @submit="emitSubmit">
    <div class="row q-gutter-md">
    {{#each formFields}}
    {{#if isRelations}}
      <FormRepeater
        :values="item.{{name}}"
        :label="$t('{{../lc}}.{{name}}')"
        class="col-12 col-md-8"
        @update="(values: any) => (item.{{name}} = values)"
      />
      {{else}}
      <q-input
        v-model{{#compare type "==" "number" }}.number{{/compare}}="item.{{name}}"
        :label="$t('{{../lc}}.{{name}}')"
        :error="Boolean(violations?.{{name}})"
        :error-message="violations?.{{name}}"
        name="{{name}}"
        {{#compare type "==" "dateTime" }}
        type="date"
        {{/compare}}
        {{#compare type "!=" "dateTime" }}
        type="{{type}}"
        {{/compare}}
        bottom-slots
        filled
        class="col-12 col-md-4"
      >
        <template #append>
          <q-icon
            name="close"
            class="cursor-pointer"
            @click.prevent.stop="item.{{name}} = undefined"
          />
        </template>
      </q-input>
      {{/if}}
    {{/each}}
    </div>

    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn
        label="Reset"
        type="reset"
        color="primary"
        flat
        class="q-ml-sm"
        @click="resetForm"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import type { SubmissionErrors } from 'src/types/error';
import { Ref, ref, toRef } from 'vue';
{{#if hasIsRelations}}
import FormRepeater from 'src/components/common/CommonFormRepeater.vue';
import { Item } from 'src/types/item';
{{/if}}
{{#if hasDateField}}
import { formatDateInput } from 'src/utils/date';
{{/if}}

let props = defineProps<{
  values?: {{titleUcFirst}};
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, 'errors');

let item: Ref<{{titleUcFirst}}> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    {{#each formFields}}
    {{#compare type "==" "dateTime" }}
    publicationDate: formatDateInput(props.values.publicationDate),
    {{/compare}}
    {{#if isEmbeddeds}}
    {{name}}: props.values.{{name}}?.map((item: Item) => item['@id'] ?? '') ?? [],
    {{else if embedded}}
    {{name}}: props.values.{{name}}?.['@id'],
    {{/if}}
    {{/each}}
  };
}

function resetForm() {
  item.value = { ...props.values };
}

let emit = defineEmits<{
  (e: 'submit', item: {{titleUcFirst}}): void;
}>();

function emitSubmit() {
  emit('submit', item.value);
}
</script>
