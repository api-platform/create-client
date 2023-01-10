<template>
  <div>
    <div class="text-body1">
      <span class="q-mr-sm">
        \{{ label }}
      </span>

      <q-btn color="secondary" @click="addField">Add</q-btn>
    </div>

    <div class="q-my-md">
      <q-input
        v-for="(field, index) in fields"
        v-model="fields[index]"
        :key="index"
        filled
        class="q-mb-sm"
        @update:model-value="(value) => updateField(index, value as string)"
      >
        <template #append>
          <q-icon
            name="delete"
            class="cursor-pointer"
            @click="removeField(index)"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

const props = defineProps<{
  values?: string[];
  label: string;
}>();

const emit = defineEmits<{
  (e: 'update', values: string[]): void;
}>();

let fields: Ref<string[]> = ref([]);

if (props.values) {
  fields.value.push(...props.values);
}

function addField() {
  fields.value.push('');
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
    'update',
    fields.value.filter((field) => field.length)
  );
}
</script>
