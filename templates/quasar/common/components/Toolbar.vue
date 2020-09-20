<template>
  <q-toolbar class="q-my-md">
    <slot name="left"></slot>
    <q-space />
    <div>
      <q-btn
        v-if="handleSubmit"
        :label="$t('{{{labels.submit}}}')"
        color="primary"
        @click="submitItem"
        icon="save"
      />
      <q-btn
        v-if="handleReset"
        :label="$t('{{{labels.reset}}}')"
        color="primary"
        flat
        class="q-ml-sm"
        @click="resetItem"
        icon="settings_backup_restore"
      />
      <q-btn
        v-if="handleDelete"
        :label="$t('{{{labels.delete}}}')"
        color="primary"
        flat
        class="q-ml-sm"
        @click="confirmDelete = true"
        icon="delete"
      />
      <q-btn v-if="handleAdd" flat round dense icon="add" @click="addItem" />
    </div>
    <ConfirmDelete
      v-if="handleDelete"
      :show="confirmDelete"
      :handle-delete="handleDelete"
      :handle-cancel="() => (confirmDelete = false)"
    />
  </q-toolbar>
</template>

<script>
import ConfirmDelete from "./ConfirmDelete";

export default {
  name: "Toolbar",
  components: {
    ConfirmDelete
  },
  data() {
    return {
      confirmDelete: false
    };
  },
  props: {
    handleSubmit: {
      type: Function,
      required: false
    },
    handleReset: {
      type: Function,
      required: false
    },
    handleDelete: {
      type: Function,
      required: false
    },
    handleAdd: {
      type: Function,
      required: false
    }
  },
  methods: {
    addItem() {
      if (this.handleAdd) {
        this.handleAdd();
      }
    },
    submitItem() {
      if (this.handleSubmit) {
        this.handleSubmit();
      }
    },
    resetItem() {
      if (this.handleReset) {
        this.handleReset();
      }
    }
  }
};
</script>
