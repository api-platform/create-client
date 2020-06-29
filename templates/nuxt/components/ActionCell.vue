<template>
  <div>
    <div class="d-flex justify-content-around">
      <a
        v-if="handleShow"
        class="mr-2"
        @click="handleShow">
        <span
          class="fa fa-search"
          aria-hidden="true"></span>
        <span class="sr-only">Show</span>
      </a>
      <a
        v-if="handleEdit"
        class="mr-2"
        @click="handleEdit">
        <span
          class="fa fa-pencil"
          aria-hidden="true"></span>
        <span class="sr-only">Edit</span>
      </a>
      <a
        v-if="handleDelete"
        @click="confirmDelete = true">
        <span
          class="fa fa-trash"
          aria-hidden="true"></span>
        <span class="sr-only">Delete</span>
      </a>
    </div>
    <ConfirmDelete
      v-if="handleDelete"
      :visible="confirmDelete"
      :handle-delete="handleDelete"
      @close="confirmDelete = false"
    />
  </div>
</template>
<script>
    import ConfirmDelete from './ConfirmDelete';

    export default {
        name: 'ActionCell',
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
        },
    };
</script>
