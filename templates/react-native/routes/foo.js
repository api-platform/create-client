import React from 'react';
import {Scene, Stack, Actions} from 'react-native-router-flux';

import {
  List as {{title}}List,
  Create as {{title}}Create,
  Show as {{title}}Show,
  Update as {{title}}Update
} from '../components/{{{lc}}}/';


export default (
  <Stack key="{{{name}}}" >
    <Scene
      component={ {{title}}List }
      rightTitle="Add"
      onRight={() => {Actions.{{title}}Create()}}
      key="{{{title}}}List"
      title="{{{title}}} List"
      type="replace"
      initial
    />
    <Scene
      component={ {{title}}Create}
      key="{{{title}}}Create"
      title="{{{title}}} Create"
      type="replace"
      leftTitle="List"
      onLeft={() => Actions.{{title}}List()}
    />
    <Scene
      component={ {{title}}Show }
      key="{{{title}}}Show"
      title="{{{title}}} Show"
      type="replace"
      leftTitle="List"
      onLeft={() => Actions.{{title}}List()}
    />
    <Scene
      component={ {{title}}Update }
      key="{{{title}}}Update"
      title="{{{title}}} Update"
      type="replace"
      leftTitle="List"
      onLeft={() => Actions.{{title}}List()}
    />
  </Stack>
);
