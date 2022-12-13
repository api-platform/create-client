<template>
  <q-toolbar class="q-my-md">
    <slot name="left" />

    <q-space />

    <div>
      <q-btn
        v-if="actions?.includes('submit')"
        :label="$t('submit')"
        color="primary"
        icon="save"
        @click="emitSubmit"
      />

      <q-btn
        v-if="actions?.includes('reset')"
        :label="$t('reset')"
        color="primary"
        flat
        class="q-ml-sm"
        icon="settings_backup_restore"
        @click="emitReset"
      />

      <q-btn
        v-if="actions?.includes('delete')"
        :label="$t('delete')"
        color="primary"
        flat
        class="q-ml-sm"
        icon="delete"
        @click="toggleConfirmDelete"
      />

      <q-btn
        v-if="actions?.includes('add')"
        flat
        round
        dense
        icon="add"
        @click="emitAdd"
      />
    </div>

    <ConfirmDelete
      v-if="actions?.includes('delete')"
      :show="confirmDelete"
      @delete="emitDelete"
      @cancel="toggleConfirmDelete"
    />
  </q-toolbar>
</template>

<script lang="ts" setup>
import ConfirmDelete from 'src/components/common/CommonConfirmDelete.vue';
import { ref, toRefs } from 'vue';

const props = defineProps<{
  actions?: ('submit' | 'reset' | 'delete' | 'add')[];
}>();

const { actions } = toRefs(props);

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'reset'): void;
  (e: 'add'): void;
  (e: 'delete'): void;
}>();

function emitSubmit() {
  emit('submit');
}

function emitReset() {
  emit('reset');
}

function emitAdd() {
  emit('add');
}

function emitDelete() {
  emit('delete');
}

const confirmDelete = ref(false);

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}
</script>
