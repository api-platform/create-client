export default [
  {
    name: '{{{titleUcFirst}}}List',
    path: '/{{{name}}}/',
    component: () =>
      import(/* webpackChunkName: "{{{lc}}}" */ '../components/{{{lc}}}/List'),
  },
  {
    name: '{{{titleUcFirst}}}Create',
    path: '/{{{name}}}/create',
    component: () =>
      import(
        /* webpackChunkName: "{{{lc}}}" */ '../components/{{{lc}}}/Create'
      ),
  },
  {
    name: '{{{titleUcFirst}}}Update',
    path: '/{{{name}}}/edit/:id',
    component: () =>
      import(
        /* webpackChunkName: "{{{lc}}}" */ '../components/{{{lc}}}/Update'
      ),
  },
  {
    name: '{{{titleUcFirst}}}Show',
    path: '/{{{name}}}/show/:id',
    component: () =>
      import(/* webpackChunkName: "{{{lc}}}" */ '../components/{{{lc}}}/Show'),
  },
];
