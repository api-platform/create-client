<template>
  <q-dialog :model-value="show" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="primary" text-color="white" />

        <span class="q-ml-sm">
          {{ $t('Are you sure you want to delete this item?') }}
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          v-close-popup
          @click="emitCancel"
        />

        <q-btn
          flat
          label="Delete"
          color="primary"
          v-close-popup
          @click="emitDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';

let props = defineProps<{
  show: boolean;
}>();

let show = toRef(props, 'show');

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'delete'): void;
}>();

function emitCancel() {
  emit('cancel');
}

function emitDelete() {
  emit('delete');
}
</script>
