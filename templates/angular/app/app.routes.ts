import { Routes } from "@angular/router";
import { LayoutComponent } from "@components/common/layout/layout.component";
import { resourcesRoutes } from "@router/index";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: resourcesRoutes,
  },
];
