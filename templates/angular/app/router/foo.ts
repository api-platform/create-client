export const {{title}}Routes = [
  {
    path: '{{lc}}s',
    loadComponent: () => import("@components/{{lc}}/list/list.component").then(c => c.ListComponent)
  },
  {
    path: '{{lc}}s/create',
    loadComponent: () => import("@components/{{lc}}/create/create.component").then(c => c.CreateComponent)
  },
  {
    path: '{{lc}}s/:id',
    loadComponent: () => import("@components/{{lc}}/show/show.component").then(c => c.ShowComponent),
  },
  {
    path: '{{lc}}s/:id/edit',
    loadComponent: () => import("@components/{{lc}}/edit/edit.component").then(c => c.EditComponent)
  },
]
