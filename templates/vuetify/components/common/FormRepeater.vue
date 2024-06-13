<template>
  <div>
    <div class="text-body-1">
      <span class="mr-2"> \{{ label }} </span>

      <v-btn color="secondary" @click="addField">\{{ $t("add") }}</v-btn>
    </div>

    <div class="my-4">
      <v-text-field
        v-for="(field, index) in fields"
        v-model="fields[index]"
        :key="index"
        @update:model-value="(value: string) => updateField(index, value)"
      >
        <template #append-inner>
          <v-icon style="cursor: pointer" @click="removeField(index)">
            mdi-delete
          </v-icon>
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  values?: string[];
  label: string;
}>();

const emit = defineEmits<{
  (e: "update", values: string[]): void;
}>();

let fields = ref<string[]>([]);

if (props.values) {
  fields.value.push(...props.values);
}

function addField() {
  fields.value.push("");
}

function updateField(index: number, value: string) {
  fields.value.splice(index, 1, value.trim());

  emitUpdate();
}

function removeField(index: number) {
  fields.value.splice(index, 1);

  emitUpdate();
}

function emitUpdate() {
  emit(
    "update",
    fields.value.filter((review) => review.length)
  );
}
</script>
