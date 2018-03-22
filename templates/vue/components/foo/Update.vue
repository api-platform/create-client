<template>
  <div>
    <h1>Edit \{{ item && item['@id'] }}</h1>

    <div
      v-if="created"
      class="alert alert-success"
      role="status">\{{ created['@id'] }} created.</div>
    <div
      v-if="updated"
      class="alert alert-success"
      role="status">\{{ updated['@id'] }} updated.</div>
    <div
      v-if="isLoading || deleteLoading"
      class="alert alert-info"
      role="status">Loading...</div>
    <div
      v-if="error"
      class="alert alert-danger"
      role="alert">
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true" /> \{{ error }}
    </div>
    <div
      v-if="deleteError"
      class="alert alert-danger"
      role="alert">
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true" /> \{{ deleteError }}
    </div>

    <{{{titleUcFirst}}}Form
      v-if="item"
      :handle-submit="onSendForm"
      :handle-update-field="updateField"
      :values="item"
      :errors="violations"
      :initial-values="retrieved" />

    <router-link
      v-if="item"
      :to="{ name: '{{{titleUcFirst}}}List' }"
      class="btn btn-default">Back to list</router-link>
    <button
      class="btn btn-danger"
      @click="del">Delete</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {{{titleUcFirst}}}Form from './Form.vue'

export default {
  components: {
    {{{titleUcFirst}}}Form
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      isLoading: '{{{lc}}}/update/isLoading',
      error: '{{{lc}}}/update/error',
      deleteError: '{{{lc}}}/del/error',
      deleteLoading: '{{{lc}}}/del/isLoading',
      created: '{{{lc}}}/create/created',
      deleted: '{{{lc}}}/del/deleted',
      retrieved: '{{{lc}}}/update/retrieved',
      updated: '{{{lc}}}/update/updated',
      violations: '{{{lc}}}/update/violations'
    })
  },

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    deleted: function (deleted) {
      if (!deleted) {
        return
      }

      this.$router.push({ name: '{{{titleUcFirst}}}List' })
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      createReset: '{{{lc}}}/create/reset',
      deleteItem: '{{{lc}}}/del/del',
      delReset: '{{{lc}}}/del/reset',
      retrieve: '{{{lc}}}/update/retrieve',
      updateReset: '{{{lc}}}/update/reset',
      update: '{{{lc}}}/update/update',
      updateRetrieved: '{{{lc}}}/update/updateRetrieved'
    }),

    del () {
      if (window.confirm('Are you sure you want to delete this {{{ lc }}} ?')) {
        this.deleteItem(this.retrieved)
      }
    },

    reset () {
      this.updateReset()
      this.delReset()
      this.createReset()
    },

    onSendForm () {
      this.update()
    },

    updateField (field, value) {
      this.updateRetrieved({ [field]: value })
    }
  }
}
</script>
