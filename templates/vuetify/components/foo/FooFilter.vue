<template>
  <v-container fluid>
    {{#forEach parameters}}
    {{#ifOdd index}}
    <v-row>
    {{/ifOdd}}
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.{{name}}"
          :label="$t('{{../lc}}.{{name}}')"
          type="{{type}}"
        />
      </v-col>
    {{#ifEven index}}
    </v-row>
    {{/ifEven}}
    {{/forEach}}
  </v-container>
</template>

<script lang="ts" setup>
import { {{titleUcFirst}} } from "@/types/book";
import { toRef } from "vue";

const props = defineProps<{
  values: {{titleUcFirst}};
}>();

const item = toRef(props, "values");
</script>
<!--
{{#compare type "==" "checkbox" }}
  <v-col cols="12" sm="6" md="6">
    <v-checkbox
      v-model="item.{{{name}}}"
      :label="$t('{{{name}}}')"
    />
  </v-col>
{{/compare}}
{{#compare type "==" "date" }}
  <v-col cols="12" sm="6" md="6">
    <InputDate
      v-model="item.{{{name}}}"
      :label="$t('{{{name}}}')"
    />
  </v-col>
{{/compare}}
{{#compare type "==" "number" }}
  <v-col cols="12" sm="6" md="6">
    <v-text-field
      v-model.number="item.{{{name}}}"
      :label="$t('{{{name}}}')"
    />
  </v-col>
{{/compare}}
{{#compare type "==" "text" }}
{{#if reference}}
  <v-col cols="12" sm="6" md="6">
    <v-combobox
      v-model="item.{{{name}}}"
      :items="{{{name}}}SelectItems"
      :no-data-text="$t('{{{../labels.noresults}}}')"
      :label="$t('{{{name}}}')"{{#unless maxCardinality}}
      multiple{{/unless}}
      item-text="name"
      item-value="@id"
      chips
    />
  </v-col>
{{/if}}
{{/compare}} -->
