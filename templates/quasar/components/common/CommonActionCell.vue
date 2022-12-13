<template>
  <q-td auto-width>
    <q-btn
      v-if="actions.includes('show')"
      flat
      round
      dense
      color="secondary"
      icon="format_align_justify"
      @click="emitShow"
    />

    <q-btn
      v-if="actions.includes('edit')"
      flat
      round
      dense
      color="secondary"
      icon="edit"
      @click="emitEdit"
    />

    <q-btn
      v-if="actions.includes('delete')"
      icon="delete"
      flat
      round
      dense
      color="secondary"
      @click="toggleConfirmDelete"
    />

    <ConfirmDelete
      v-if="actions.includes('delete')"
      :show="confirmDelete"
      @delete="emitDelete"
      @cancel="toggleConfirmDelete"
    />
  </q-td>
</template>

<script lang="ts" setup>
import ConfirmDelete from 'src/components/common/CommonConfirmDelete.vue';
import { ref, toRefs } from 'vue';

const props = defineProps<{
  actions: ('show' | 'edit' | 'delete')[];
}>();

const { actions } = toRefs(props);

const emit = defineEmits<{
  (e: 'show'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

function emitShow() {
  emit('show');
}

function emitEdit() {
  emit('edit');
}

function emitDelete() {
  emit('delete');
}

const confirmDelete = ref(false);

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}
</script>
