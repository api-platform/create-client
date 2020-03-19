<template>
  <q-expansion-item icon="search" :label="$t('{{{labels.filters}}}')" v-model="filtersExpanded">
    <q-card>
      <q-card-section @keydown.enter.prevent="handleFilter">
        <slot name="filter"></slot>
      </q-card-section>
      <q-card-section>
        <q-btn :label="$t('{{{labels.filter}}}')" color="primary" @click="handleFilter" />
        <q-btn :label="$t('{{{labels.reset}}}')" color="primary" flat class="q-ml-sm" @click="handleReset" />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
export default {
  name: 'DataFilter',
  props: {
    handleReset: {
      type: Function,
      required: true,
    },
    handleFilter: {
      type: Function,
      required: true,
    },
    expanded: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      filtersExpanded: false,
    };
  },
  watch: {
    expanded(val) {
      this.filtersExpanded = this.expanded;
    }
  }
};
</script>
