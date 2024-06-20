import {Routes} from '@angular/router';
import {ListComponent} from "@components/foo/list/list.component";
import {ShowComponent} from "@components/foo/show/show.component";
import {EditComponent} from "@components/foo/edit/edit.component";
import {CreateComponent} from "@components/foo/create/create.component";
import {LayoutComponent} from "@components/common/layout/layout.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '{{lc}}',
        component: ListComponent
      },
      {
        path: '{{lc}}/add',
        component: CreateComponent
      },
      {
        path: '{{lc}}/:id',
        component: ShowComponent,
      },
      {
        path: '{{lc}}/:id/edit',
        component: EditComponent
      },
    ]
  }
];
