<template>
  <nav class="navbar navbar-light bg-light">
    <slot name="left"></slot>
    <div>
      <button
        v-if="handleEdit"
        :loading="isLoading"
        class="btn btn-primary"
        @click="editItem"
      >
        Submit
      </button>
      <button
        v-if="handleSubmit"
        :loading="isLoading"
        class="btn btn-primary"
        @click="submitItem"
      >
        Submit
      </button>
      <button
        v-if="handleReset"
        class="btn btn-primary ml-sm-2"
        @click="resetItem"
      >
        Reset
      </button>
      <button
        v-if="handleDelete"
        class="btn btn-danger ml-sm-2"
        @click="confirmDelete = true"
      >
        Delete
      </button>

      <button v-if="handleAdd" class="btn btn-primary" @click="addItem">
        <i class="fa fa-plus"></i>
      </button>
    </div>
    <ConfirmDelete
      v-if="handleDelete"
      :visible="confirmDelete"
      :handle-delete="handleDelete"
      @close="confirmDelete = false"
    />
  </nav>
</template>

<script>
import ConfirmDelete from './ConfirmDelete';

export default {
  name: 'Toolbar',
  components: {
    ConfirmDelete
  },
  data() {
    return {
      confirmDelete: false
    };
  },
  props: {
    handleEdit: {
      type: Function,
      required: false
    },
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
    },
    title: {
      type: String,
      required: false
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  methods: {
    addItem() {
      if (this.handleAdd) {
        this.handleAdd();
      }
    },
    editItem() {
      if (this.handleEdit) {
        this.handleEdit();
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
