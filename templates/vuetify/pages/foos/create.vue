<template>
  <Suspense>
    <Create />

    <template #fallback>\{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import Create from "@/components/{{lc}}/{{titleUcFirst}}Create.vue";

definePage({
  meta: {
    breadcrumb: [
      {
        title: "{{titleUcFirst}}List",
        to: { name: "/{{lc}}s/" },
      },
      {
        title: "{{titleUcFirst}}Create",
      },
    ],
  },
});
</script>
