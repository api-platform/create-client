import {{{titleUcFirst}}}List from '../components/{{{lc}}}/List';
import {{{titleUcFirst}}}Create from '../components/{{{lc}}}/Create';
import {{{titleUcFirst}}}Update from '../components/{{{lc}}}/Update';
import {{{titleUcFirst}}}Show from '../components/{{{lc}}}/Show';

export default [
  {
    name: '{{{titleUcFirst}}}List',
    path: '/{{{name}}}/',
    component: {{{ titleUcFirst }}}List,
    meta: {
      breadcrumb: [{ label: '{{{ titleUcFirst }}} List', icon: 'whatshot' }],
    },
  },
  {
    name: '{{{titleUcFirst}}}Create',
    path: '/{{{name}}}/create',
    component: {{{ titleUcFirst }}}Create,
    meta: {
      breadcrumb: [
        { label: '{{{ titleUcFirst }}} List', icon: 'whatshot', to: { name: '{{{ titleUcFirst }}}List' } },
        { label: 'New {{{ titleUcFirst }}}', icon: 'whatshot' },
      ],
    },
  },
  {
    name: '{{{titleUcFirst}}}Update',
    path: '/{{{name}}}/edit/:id',
    component: {{{ titleUcFirst }}}Update,
    meta: {
      breadcrumb: [
        { label: '{{{ titleUcFirst }}} List', icon: 'whatshot', to: { name: '{{{ titleUcFirst }}}List' } },
        { label: 'Edit {{{ titleUcFirst }}}', icon: 'whatshot' },
      ],
    },
  },
  {
    name: '{{{titleUcFirst}}}Show',
    path: '/{{{name}}}/show/:id',
    component: {{{ titleUcFirst }}}Show,
    meta: {
      breadcrumb: [
        { label: '{{{ titleUcFirst }}} List', icon: 'whatshot', to: { name: '{{{ titleUcFirst }}}List' } },
        { label: 'Show {{{ titleUcFirst }}}', icon: 'whatshot' },
      ],
    },
  },
];
