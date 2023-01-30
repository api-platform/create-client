import { useRoute } from "vue-router";
import type { BreadcrumbValue } from "@/types/breadcrumb";

export function useBreadcrumb() {
  const route = useRoute();
  const breadcrumb = route.meta.breadcrumb as BreadcrumbValue[];

  return breadcrumb;
}
