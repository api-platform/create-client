import {ListComponent} from "../components/{{lc}}/list/list.component";
import {CreateComponent} from "../components/{{lc}}/create/create.component";
import {ShowComponent} from "../components/{{lc}}/show/show.component";
import {EditComponent} from "../components/{{lc}}/edit/edit.component";

export const {{title}}Routes = [
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
