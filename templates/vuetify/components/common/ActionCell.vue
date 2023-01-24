<template>
  <v-row justify="space-around">
    <v-btn
      v-if="actions?.includes('show')"
      icon="mdi-eye"
      color="secondary"
      size="small"
      class="mb-2"
      @click="emitShow"
    />

    <v-btn
      v-if="actions?.includes('update')"
      icon="mdi-pencil"
      color="secondary"
      size="small"
      class="mb-2"
      @click="emitUpdate"
    />

    <v-btn
      v-if="actions?.includes('delete')"
      icon="mdi-delete"
      color="secondary"
      size="small"
      class="mb-2"
      @click="toggleConfirmDelete"
    />
  </v-row>

  <ConfirmDelete
    v-if="actions?.includes('delete')"
    :show="confirmDelete"
    @delete="emitDelete"
    @cancel="toggleConfirmDelete"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ConfirmDelete from "@/components/common/ConfirmDelete.vue";

defineProps<{
  actions?: ("show" | "update" | "delete")[];
}>();

const emit = defineEmits<{
  (e: "show"): void;
  (e: "update"): void;
  (e: "delete"): void;
}>();

function emitShow() {
  emit("show");
}

function emitUpdate() {
  emit("update");
}

function emitDelete() {
  emit("delete");
}

const confirmDelete = ref(false);

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}
</script>
