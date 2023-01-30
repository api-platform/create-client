<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        \{{ $t("filters") }}

        <template #actions>
          <v-icon large>mdi-filter-variant</v-icon>
        </template>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <slot name="filter" />

        <v-btn color="primary" @click="emitFilter">\{{ $t("filter") }}</v-btn>

        <v-btn color="primary" class="ml-2" text @click="emitReset">
          \{{ $t("reset") }}
        </v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "filter"): void;
  (e: "reset"): void;
}>();

function emitFilter() {
  emit("filter");
}

function emitReset() {
  emit("reset");
}
</script>
