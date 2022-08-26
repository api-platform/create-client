<template>
  <div>
    <v-row justify="space-around">
      <v-btn
        v-if="showHref"
        color="primary"
        dark
        small
        class="mr-2"
        :href="showHref"
      >
        Show <v-icon dark>mdi-eye</v-icon>
      </v-btn>
      <v-btn
        v-if="editHref"
        color="primary"
        dark
        small
        class="mr-2"
        :href="editHref"
      >
        Edit <v-icon dark>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="handleDelete"
        color="primary"
        dark
        small
        class="mr-2"
        @click="handleDelete"
      >
        Delete <v-icon dark>mdi-delete</v-icon>
      </v-btn>
    </v-row>
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
  data: () => ({
    confirmDelete: false
  }),
  props: {
    showHref: {
      type: String,
      required: false
    },
    editHref: {
      type: String,
      required: false
    },
    handleDelete: {
      type: Function,
      required: false
    }
  }
};
</script>
