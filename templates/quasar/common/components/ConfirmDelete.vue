<template>
  <q-dialog :value="show" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="primary" text-color="white" />
        <span class="q-ml-sm">\{{ $t('{{{labels.confirmDelete}}}') }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="{{{labels.cancel}}}" color="primary" v-close-popup @click="handleCancel" />
        <q-btn flat label="{{{labels.delete}}}" color="primary" v-close-popup @click="handleDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ConfirmDelete',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    handleDelete: {
      type: Function,
      required: true,
    },
    handleCancel: {
      type: Function,
      required: false,
    },
  },
};
</script>
