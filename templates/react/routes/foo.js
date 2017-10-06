import React from 'react';
import {Route} from 'react-router-dom';
import {List,Create, Update, Show} from '../components/{{{lc}}}/';

export default [
  <Route path='/{{{name}}}/create' component={Create} exact={true} key='create'/>,
  <Route path='/{{{name}}}/edit/:id' component={Update} exact={true} key='update'/>,
  <Route path='/{{{name}}}/show/:id' component={Show} exact={true} key='show'/>,
  <Route path='/{{{name}}}/:page?' component={List} strict={true} key='list'/>,
];
