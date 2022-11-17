<template>
  <q-form class="q-pa-md q-col-gutter-y-md" @submit="emitSubmit">
    <div class="row q-gutter-md">
    {{#each formFields}}
      {{#if isManyRelations}}
      <FormRepeater
        :values="item.{{name}}"
        :label="$t('{{lc}}.{{name}}')"
        class="col-12 col-md-8"
        @update="(values) => (item.{{name}} = values)"
      />
      {{else}}
      <q-input
        v-model="item.{{name}}"
        :label="$t('{{lc}}.{{name}}')"
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
        class="col-12 col-md"
      >
        <template #append>
          <q-icon
            name="close"
            class="cursor-pointer"
            @click.prevent.stop="item.{{name}} = ''"
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
import { SubmissionErrors } from 'src/types/error';
import { Ref, ref, toRef } from 'vue';
{#if hasManyRelations}}
import FormRepeater from 'src/components/common/FormRepeaterComponent.vue';
{{/if}}
import { Item } from 'src/types/item';
import { formatDateInput } from 'src/utils/date';

let props = defineProps<{
  values?: {{titleUcFirst}};
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, 'errors');

let item: Ref<{{titleUcFirst}}> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
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
