import React from 'react';
import {Route} from 'react-router-dom';

import {
  List as {{{titleUcFirst}}}List,
  Create as {{{titleUcFirst}}}Create,
  Update as {{{titleUcFirst}}}Update,
  Show as {{{titleUcFirst}}}Show
} from '../components/{{{lc}}}/';

export default (
  [
    <Route path='/{{{name}}}/' component={ {{{titleUcFirst}}}List } exact={true} strict={true} key='{{{titleUcFirst}}}List'/>,
    <Route path='/{{{name}}}/create' component={ {{{titleUcFirst}}}Create } exact={true} key='{{{titleUcFirst}}}Create'/>,
    <Route path="/{{{name}}}/edit/:id" component={ {{{titleUcFirst}}}Update } exact={true} key='{{{titleUcFirst}}}Update'/>,
    <Route path="/{{{name}}}/show/:id" component={ {{{titleUcFirst}}}Show } exact={true} key='{{{titleUcFirst}}}Show'/>
  ]
);
