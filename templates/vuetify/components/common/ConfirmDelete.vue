<template>
  <v-dialog v-model="show" persistent width="300">
    <v-card>
      <v-card-text>
        \{{ $t("confirmDelete") }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn color="error darken-1" @click="emitDelete">
          \{{ $t("delete") }}
        </v-btn>

        <v-btn color="secondary darken-1" text @click.stop="emitCancel">
          \{{ $t("cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { toRef } from "vue";

const props = defineProps<{
  show: boolean;
}>();

let show = toRef(props, "show");

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "delete"): void;
}>();

function emitCancel() {
  emit("cancel");
}

function emitDelete() {
  emit("delete");
}
</script>
