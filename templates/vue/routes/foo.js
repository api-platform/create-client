import {{{titleUcFirst}}}List from '../components/{{{lc}}}/List.vue';
import {{{titleUcFirst}}}Create from '../components/{{{lc}}}/Create.vue';
import {{{titleUcFirst}}}Update from '../components/{{{lc}}}/Update.vue';
import {{{titleUcFirst}}}Show from '../components/{{{lc}}}/Show.vue';

export default [
  { name: '{{{titleUcFirst}}}List', path: '/{{{name}}}/', component: {{{titleUcFirst}}}List },
  { name: '{{{titleUcFirst}}}Create', path: '/{{{name}}}/create', component: {{{titleUcFirst}}}Create },
  { name: '{{{titleUcFirst}}}Update', path: '/{{{name}}}/edit/:id', component: {{{titleUcFirst}}}Update },
  { name: '{{{titleUcFirst}}}Show', path: '/{{{name}}}/show/:id', component: {{{titleUcFirst}}}Show }
]
