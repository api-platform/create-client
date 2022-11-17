import { BreadcrumbValue } from 'src/types/breadcrumb';
import { useRoute } from 'vue-router';

export function useBreadcrumb() {
  const route = useRoute();
  const breadcrumb = route.meta.breadcrumb as BreadcrumbValue[];

  return breadcrumb;
}
