<template>
  <v-breadcrumbs :items="items" />
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import type { BreadcrumbValue } from "@/types/breadcrumb";

const { t } = useI18n();

const props = defineProps<{
  breadcrumb: BreadcrumbValue[];
}>();

const items = [{ title: t("home"), to: "/" }, ...props.breadcrumb];
</script>

<style>
.v-breadcrumbs-item--active {
  font-size: 20px;
  font-weight: bold;
  opacity: 1 !important;
}
</style>
