<template>
  <Suspense>
    <Update />

    <template #fallback>\{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import Update from "@/components/{{lc}}/{{titleUcFirst}}Update.vue";

definePage({
  meta: {
    breadcrumb: [
      {
        title: "{{titleUcFirst}}List",
        to: { name: "/{{lc}}s/" },
      },
      {
        title: "{{titleUcFirst}}Update",
      },
    ],
  },
});
</script>
