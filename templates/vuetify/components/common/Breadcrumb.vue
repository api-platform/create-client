<template>
  <v-breadcrumbs>
    <v-breadcrumbs-item :title="$t('home')" href="/" />

    /

    <v-breadcrumbs-item
      v-for="(item, index) in breadcrumb"
      :key="index"
      :to="{ name: item.name }"
    >
      \{{ item.name }}

      <template v-if="index + 1 !== breadcrumb.length">/</template>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script lang="ts" setup>
import { BreadcrumbValue } from "@/types/breadcrumb";

defineProps<{
  breadcrumb: BreadcrumbValue[];
}>();
</script>

<style>
.v-breadcrumbs-item--active {
  font-size: 20px;
  font-weight: bold;
}
</style>
