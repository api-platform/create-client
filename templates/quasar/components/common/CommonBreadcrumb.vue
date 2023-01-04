<template>
  <q-breadcrumbs class="q-mr-sm">
    <q-breadcrumbs-el icon="home" to="/" />

    <q-breadcrumbs-el
      v-for="(breadcrumb, index) in props.values"
      :key="index"
      :label="`${breadcrumb.label} ${
        index === props.values.length - 1 && props.item?.['@id']
          ? props.item['@id']
          : ''
      }`"
      :icon="breadcrumb.icon"
      :to="breadcrumb.to"
    />
  </q-breadcrumbs>
</template>

<script lang="ts" setup>
import type { BreadcrumbValue } from 'src/types/breadcrumb';
import type { Item } from 'src/types/item';

const props = defineProps<{
  values: BreadcrumbValue[];
  item?: Item;
}>();
</script>
