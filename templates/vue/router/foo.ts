export default [
  {
    name: '{{{titleUcFirst}}}List',
    path: '/{{{name}}}/',
    component: () => import('@/views/{{{lc}}}/ListView.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Create',
    path: '/{{{name}}}/create',
    component: () => import('@/views/{{{lc}}}/CreateView.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Update',
    path: '/{{{name}}}/edit/:id',
    component: () => import('@/views/{{{lc}}}/UpdateView.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Show',
    path: '/{{{name}}}/show/:id',
    component: () => import('@/views/{{{lc}}}/ShowView.vue'),
  },
]
