<template>
  <q-breadcrumbs class="q-mr-sm">
    <q-breadcrumbs-el icon="home" to="/" />
    <q-breadcrumbs-el
      v-for="(breadcrumb, idx) in values"
      :key="idx"
      :label="
        $t(breadcrumb.label) +
          ' ' +
          (idx === values.length - 1 && item && item['@id'] ? item['@id'] : '')
      "
      :icon="breadcrumb.icon"
      :to="breadcrumb.to"
    />
  </q-breadcrumbs>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    values: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: false,
    },
  },
};
</script>