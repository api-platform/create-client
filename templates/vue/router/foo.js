export default [
  {
    name: '{{{titleUcFirst}}}List',
    path: '/{{{name}}}/',
    component: () => import('../components/{{{lc}}}/List.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Create',
    path: '/{{{name}}}/create',
    component: () => import('../components/{{{lc}}}/Create.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Update',
    path: '/{{{name}}}/edit/:id',
    component: () => import('../components/{{{lc}}}/Update.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Show',
    path: '/{{{name}}}/show/:id',
    component: () => import('../components/{{{lc}}}/Show.vue'),
  },
]
