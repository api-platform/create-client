export default [
  {
    name: "{{titleUcFirst}}List",
    path: "/{{lc}}s/",
    component: () => import("@/views/{{lc}}/ViewList.vue"),
  },
  {
    name: "{{titleUcFirst}}Create",
    path: "/{{lc}}s/create",
    component: () => import("@/views/{{lc}}/ViewCreate.vue"),
  },
  {
    name: "{{titleUcFirst}}Update",
    path: "/{{lc}}s/edit/:id",
    component: () => import("@/views/{{lc}}/ViewUpdate.vue"),
  },
  {
    name: "{{titleUcFirst}}Show",
    path: "/{{lc}}s/show/:id",
    component: () => import("@/views/{{lc}}/ViewShow.vue"),
  },
];
