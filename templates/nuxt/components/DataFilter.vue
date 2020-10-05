<template>
  <v-menu
    transition="slide-y-transition"
    :close-on-content-click="false"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="white"
        v-on="on"
        v-bind="attrs"
      >
        Filter <v-icon right>mdi-filter-variant</v-icon>
      </v-btn>
    </template>

    <v-sheet>
      <v-card-title>Filters</v-card-title>

      <slot name="filter"></slot>

      <v-card-actions>
        <v-spacer />

        <v-btn color="primary" @click="onFilter">
          Filter
        </v-btn>
        <v-btn color="primary" class="ml-2" text @click="onCancel">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-sheet>
  </v-menu>
</template>

<script>
  export default {
    name: 'DataFilter',
    props: {
      handleReset: {
        type: Function,
        required: true
      },
      handleFilter: {
        type: Function,
        required: true
      }
    },
    methods: {
      onFilter() {
        this.handleFilter()
      },
      onCancel() {
        this.handleReset()
      }
    }
  };
</script>
