export default [
  {
    name: '{{{titleUcFirst}}}List',
    path: '/{{{name}}}/',
    component: () => import('../views/apps/{{{lc}}}/List.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Create',
    path: '/{{{name}}}/create',
    component: () => import('../views/apps/{{{lc}}}/Create.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Update',
    path: '/{{{name}}}/edit/:id',
    component: () => import('../views/apps/{{{lc}}}/Update.vue'),
  },
  {
    name: '{{{titleUcFirst}}}Show',
    path: '/{{{name}}}/show/:id',
    component: () => import('../views/apps/{{{lc}}}/Show.vue'),
  },
]
