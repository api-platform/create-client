<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      {{#each formFields}}
      {{#if isRelations}}
      <v-col cols="12">
        <FormRepeater
          :values="item.{{name}}"
          :label="$t('{{../lc}}.{{name}}')"
          @update="(values: any) => (item.{{name}} = values)"
        />
      </v-col>
      {{else}}
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.{{name}}"
          :error="Boolean(violations?.{{name}})"
          :error-messages="violations?.{{name}}"
          :label="$t('{{../lc}}.{{name}}')"
          {{#compare type "==" "dateTime" }}
          type="date"
          {{/compare}}
          {{#if required}}
          required
          {{/if}}
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.{{name}} = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      {{/if}}
      {{/each}}
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" type="submit">\{{ $t("submit") }}</v-btn>

        <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
          \{{ $t("reset") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
{{#if hasIsRelations}}
import FormRepeater from "@/components/common/FormRepeater.vue";
import type { Item } from 'src/types/item';
{{/if}}
import { {{titleUcFirst}} } from "@/types/{{lc}}";
import { SubmissionErrors } from "@/types/error";
{{#if hasDateField}}
import { formatDateInput } from "@/utils/date";
{{/if}}
import { VForm } from "vuetify/lib/components/index";

const props = defineProps<{
  values?: {{titleUcFirst}};
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<{{titleUcFirst}}> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    {{#each formFields}}
    {{#compare type "==" "dateTime" }}
    publicationDate: formatDateInput(props.values.publicationDate),
    {{/compare}}
    {{#if isEmbeddeds}}
    {{name}}: props.values.{{name}}?.map((item: Item) => item["@id"] ?? "") ?? [],
    {{else if embedded}}
    {{name}}: props.values.{{name}}?.["@id"],
    {{/if}}
    {{/each}}
  };
}

const emit = defineEmits<{
  (e: "submit", item: {{titleUcFirst}}): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
