const names = {
  list: "{{titleUcFirst}}List",
  create: "{{titleUcFirst}}Create",
  update: "{{titleUcFirst}}Update",
  show: "{{titleUcFirst}}Show",
};

const breadcrumbs = {
  list: { title: names.list, to: { name: names.list } },
  create: { title: names.create, to: { name: names.create } },
  update: { title: names.update, to: { name: names.update } },
  show: { title: names.show, to: { name: names.show } },
};

export default [
  {
    name: names.list,
    path: "/{{lc}}s",
    component: () => import("@/views/{{lc}}/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/{{lc}}s/create",
    component: () => import("@/views/{{lc}}/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/{{lc}}s/edit/:id",
    component: () => import("@/views/{{lc}}/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/{{lc}}s/show/:id",
    component: () => import("@/views/{{lc}}/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
