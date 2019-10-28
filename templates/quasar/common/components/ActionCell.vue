<template>
  <q-td slot="body-cell-action" auto-width>
    <q-btn
      v-if="handleShow"
      flat
      round
      dense
      color="secondary"
      @click="handleShow"
      icon="format_align_justify"
    />
    <q-btn v-if="handleEdit" flat round dense color="secondary" @click="handleEdit" icon="edit" />
    <q-btn
      v-if="handleDelete"
      icon="delete"
      flat
      round
      dense
      color="secondary"
      @click="confirmDelete = true"
    />
    <ConfirmDelete
      v-if="handleDelete"
      :show="confirmDelete"
      :handle-delete="handleDelete"
      :handle-cancel="() => (confirmDelete = false)"
    />
  </q-td>
</template>

<script>
import ConfirmDelete from "./ConfirmDelete";

export default {
  name: "ActionCell",
  components: {
    ConfirmDelete
  },
  data() {
    return {
      confirmDelete: false
    };
  },
  props: {
    handleShow: {
      type: Function,
      required: false
    },
    handleEdit: {
      type: Function,
      required: false
    },
    handleDelete: {
      type: Function,
      required: false
    }
  }
};
</script>
