import React from 'react';
import { Scene, Stack, Actions } from 'react-native-router-flux';

import {List,Create, Update, Show} from '../components/{{{lc}}}/';


export default <Stack key='{{{name}}}'>
  <Scene
    component={List}
    rightTitle="Add"
    key='{{{name}}}List'
    onRight={() => {Actions.{{name}}Create();}}
    title='{{{name}}} List'
    type='replace'
    initial
  />
  <Scene
    component={Create}
    key='{{{name}}}Create'
    title='{{{name}}} Create'
    type='replace'
    leftTitle='List'
    onLeft={() => Actions.{{name}}List()}
  />
  <Scene
    component={Show}
    key='{{{name}}}Show'
    title='{{{name}}} Show'
    type="replace"
    leftTitle="List"
    onLeft={() => Actions.{{name}}List()}
  />
  <Scene
    component={Update}
    key='{{{name}}}Update'
    title='{{{name}}} Update'
    type='replace'
    leftTitle="List"
    onLeft={() => Actions.{{name}}List()}
  />
</Stack>;
