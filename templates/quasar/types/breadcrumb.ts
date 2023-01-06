import { RouteLocation } from 'vue-router';

export interface BreadcrumbValue {
  label: string;
  icon: string;
  to?: RouteLocation;
}
