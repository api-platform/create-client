<script setup lang="ts">
import { ref, type Ref } from "vue";

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
    fields.value.filter((review) => review.length)
  );
}
</script>

<template>
  <div class="mb-3">
    <div v-for="(field, index) in fields" :key="index" class="input-group mb-3">
      <input
        v-model="fields[index]"
        type="text"
        class="form-control"
        @input="updateField(index, ($event?.target as HTMLInputElement)?.value)"
      />

      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="removeField(index)"
      >
        Remove
      </button>
    </div>

    <button type="button" class="btn btn-outline-success" @click="addField">
      Add
    </button>
  </div>
</template>
