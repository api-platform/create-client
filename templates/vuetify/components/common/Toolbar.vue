<template>
  <v-toolbar class="px-4 d-flex justify-space-around" elevation="0">
    <Breadcrumb :breadcrumb="breadcrumb" />

    <v-spacer />

    <div>
      <v-btn
        v-if="actions?.includes('delete')"
        color="error"
        class="ml-sm-2"
        @click="toggleConfirmDelete"
      >
        \{{ $t("delete") }}
      </v-btn>

      <v-btn
        v-if="actions?.includes('add')"
        icon="mdi-plus-circle"
        color="primary"
        @click="emitAdd"
      />
    </div>

    <ConfirmDelete
      v-if="actions?.includes('delete')"
      :show="confirmDelete"
      @delete="emitDelete"
      @cancel="toggleConfirmDelete"
    />
  </v-toolbar>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import ConfirmDelete from "@/components/common/ConfirmDelete.vue";
import type { BreadcrumbValue } from "@/types/breadcrumb";

const props = defineProps<{
  actions?: ("submit" | "reset" | "delete" | "add")[];
  isLoading: boolean;
  breadcrumb: BreadcrumbValue[];
}>();

const { actions } = toRefs(props);

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
  (e: "add"): void;
  (e: "delete"): void;
}>();

function emitAdd() {
  emit("add");
}

function emitDelete() {
  emit("delete");
}

const confirmDelete = ref(false);

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}
</script>
