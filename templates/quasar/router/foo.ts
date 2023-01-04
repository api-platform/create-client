import type { BreadcrumbValue } from 'types/breadcrumb';

const list: BreadcrumbValue = {
  label: '{{titleUcFirst}}List',
  icon: 'whatshot',
};
const create: BreadcrumbValue = {
  label: '{{titleUcFirst}}Create',
  icon: 'whatshot',
};
const update: BreadcrumbValue = {
  label: '{{titleUcFirst}}Update',
  icon: 'whatshot',
};
const show: BreadcrumbValue = {
  label: '{{titleUcFirst}}Show',
  icon: 'whatshot',
};

export default [
  {
    name: list.label,
    path: '/{{name}}/',
    component: () => import('pages/{{lc}}/PageList.vue'),
    meta: {
      breadcrumb: [list],
    },
  },
  {
    name: create.label,
    path: '/{{name}}/create',
    component: () => import('pages/{{lc}}/PageCreate.vue'),
    meta: {
      breadcrumb: [{ ...list, to: { name: list.label } }, create],
    },
  },
  {
    name: update.label,
    path: '/{{name}}/edit/:id',
    component: () => import('pages/{{lc}}/PageUpdate.vue'),
    meta: {
      breadcrumb: [{ ...list, to: { name: list.label } }, update],
    },
  },
  {
    name: show.label,
    path: '/{{name}}/show/:id',
    component: () => import('pages/{{lc}}/PageShow.vue'),
    meta: {
      breadcrumb: [{ ...list, to: { name: list.label } }, show],
    },
  },
];
