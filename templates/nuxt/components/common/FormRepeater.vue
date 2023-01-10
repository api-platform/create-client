<template>
  <button
    type="button"
    class="my-2 px-6 py-2 border-2 border-green-500 text-green-500 text-xs rounded-full hover:text-white hover:bg-green-500"
    @click="addField"
  >
    Add
  </button>

  <div v-for="(field, index) in fields" :key="index" class="flex gap-2 mb-3">
    <input
      v-model="fields[index]"
      placeholder="Relation IRI"
      class="grow px-3 py-1.5 border rounded"
      @input="updateField(index, ($event?.target as HTMLInputElement)?.value)"
    />

    <button
      type="button"
      class="px-6 py-2 border-2 border-gray-800 font-medium text-xs uppercase rounded hover:text-white hover:bg-gray-800"
      @click="removeField(index)"
    >
      Remove
    </button>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from "vue";

const props = defineProps<{
  values?: string[];
}>();

const emit = defineEmits<{
  (e: "update", values: string[]): void;
}>();

let fields: Ref<string[]> = ref([]);

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
    fields.value.filter((field) => field.length)
  );
}
</script>
