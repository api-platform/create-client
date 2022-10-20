export default [
  {
    name: '{{{titleUcFirst}}}List',
    path: '/{{{name}}}/',
    component: () => import('../components/{{{lc}}}/ListView.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Create',
    path: '/{{{name}}}/create',
    component: () => import('../components/{{{lc}}}/CreateView.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Update',
    path: '/{{{name}}}/edit/:id',
    component: () => import('../components/{{{lc}}}/UpdateView.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Show',
    path: '/{{{name}}}/show/:id',
    component: () => import('../components/{{{lc}}}/ShowView.vue'),
  },
]
