<template>
  <Suspense>
    <List />

    <template #fallback>\{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/{{lc}}/{{titleUcFirst}}List.vue";

definePage({
  meta: {
    breadcrumb: [
      {
        title: "{{titleUcFirst}}List",
        to: {
          name: "/{{lc}}s/",
        },
      },
    ],
  },
});
</script>
