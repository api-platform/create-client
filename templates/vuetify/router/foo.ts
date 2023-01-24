const names = {
  list: { name: "{{titleUcFirst}}List" },
  create: { name: "{{titleUcFirst}}Create" },
  update: { name: "{{titleUcFirst}}Update" },
  show: { name: "{{titleUcFirst}}Show" },
};

export default [
  {
    ...names.list,
    path: "/{{name}}",
    component: () => import("@/views/{{lc}}/ViewList.vue"),
    meta: {
      breadcrumb: [names.list],
    },
  },
  {
    ...names.create,
    path: "/{{name}}/create",
    component: () => import("@/views/{{lc}}/ViewCreate.vue"),
    meta: {
      breadcrumb: [names.list, names.create],
    },
  },
  {
    ...names.update,
    path: "/{{name}}/edit/:id",
    component: () => import("@/views/{{lc}}/ViewUpdate.vue"),
    meta: {
      breadcrumb: [names.list, names.update],
    },
  },
  {
    ...names.show,
    path: "/{{name}}/show/:id",
    component: () => import("@/views/{{lc}}/ViewShow.vue"),
    meta: {
      breadcrumb: [names.list, names.show],
    },
  },
];
