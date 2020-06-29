<template>
  <div>
    <button class="btn btn-primary float-right" @click="filtersExpanded = !filtersExpanded">
      <i class="fa fa-filter"></i>
    </button>
    <div v-if="filtersExpanded">
      <p class="card card-header">
        Filters
      </p>
      <div class="card-body">
        <slot name="filter"></slot>

        <button class="btn btn-primary" @click="handleFilter">Filtrer</button>
        <button class="btn btn-primary ml-2" text @click="handleReset">Reset</button>
      </div>
    </div>
  </div>
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
    data() {
      return {
        filtersExpanded: false
      };
    }
  };
</script>
