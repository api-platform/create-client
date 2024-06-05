import {ListComponent} from "../components/foo/list/list.component";
import {CreateComponent} from "../components/foo/create/create.component";
import {ShowComponent} from "../components/foo/show/show.component";
import {EditComponent} from "../components/foo/edit/edit.component";

export default [
  {
    path: 'heroes',
    component: ListComponent
  },
  {
    path: 'heroes/add',
    component: CreateComponent
  },
  {
    path: 'heroes/:id',
    component: ShowComponent,
  },
  {
    path: 'heroes/:id/edit',
    component: EditComponent
  },
]
