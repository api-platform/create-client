<template>
  <v-container fluid>
    <v-row>
      {{#each parameters}}
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.{{name}}"
          :label="$t('{{../lc}}.{{name}}')"
          type="{{htmlInputType}}"
        />
      </v-col>
      {{/each}}
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";

const props = defineProps<{
  values: {{titleUcFirst}};
}>();

const item = toRef(props, "values");
</script>
