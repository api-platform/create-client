<template>
  <q-expansion-item
    v-model="filtersExpanded"
    :label="$t('filters')"
    icon="search"
  >
    <q-card>
      <q-card-section @keydown.enter.prevent="emitFilter">
        <slot name="filter"></slot>
      </q-card-section>

      <q-card-section>
        <q-btn :label="$t('filter')" color="primary" @click="emitFilter" />

        <q-btn
          :label="$t('reset')"
          color="primary"
          flat
          class="q-ml-sm"
          @click="emitReset"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const filtersExpanded = ref(false);

const emit = defineEmits<{
  (e: 'filter'): void;
  (e: 'reset'): void;
}>();

function emitFilter() {
  emit('filter');
}

function emitReset() {
  emit('reset');
}
</script>
