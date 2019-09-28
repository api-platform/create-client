import {{{titleUcFirst}}}List from '../components/{{{lc}}}/List';
import {{{titleUcFirst}}}Create from '../components/{{{lc}}}/Create';
import {{{titleUcFirst}}}Update from '../components/{{{lc}}}/Update';
import {{{titleUcFirst}}}Show from '../components/{{{lc}}}/Show';

const list = {
  label: '{{{ titleUcFirst }}}List',
  icon: 'whatshot',
};
const create = {
  label: '{{{ titleUcFirst }}}Create',
  icon: 'whatshot',
};
const update = {
  label: '{{{ titleUcFirst }}}Update',
  icon: 'whatshot',
};
const show = {
  label: '{{{ titleUcFirst }}}Show',
  icon: 'whatshot',
};

export default [
  {
    name: list['label'],
    path: '/{{{name}}}/',
    component: {{{ titleUcFirst }}}List,
    meta: {
      breadcrumb: [list],
    },
  },
  {
    name: create['label'],
    path: '/{{{name}}}/create',
    component: {{{ titleUcFirst }}}Create,
    meta: {
      breadcrumb: [
        { ...list , to: { name: list['label'] } },
        create,
      ],
    },
  },
  {
    name: update['label'],
    path: '/{{{name}}}/edit/:id',
    component: {{{ titleUcFirst }}}Update,
    meta: {
      breadcrumb: [
        { ...list , to: { name: list['label'] } },
        update,
      ],
    },
  },
  {
    name: show['label'],
    path: '/{{{name}}}/show/:id',
    component: {{{ titleUcFirst }}}Show,
    meta: {
      breadcrumb: [
        { ...list , to: { name: list['label'] } },
        show,
      ],
    },
  },
];
