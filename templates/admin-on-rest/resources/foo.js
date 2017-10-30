import React from 'react'
import { Resource, Delete } from 'admin-on-rest'
import { {{title}}Create, {{title}}Edit, {{title}}List, {{title}}Show } from '../components/{{{lc}}}';

export default (
    <Resource
      key='{{{name}}}'
      name='{{{name}}}'
      list={ {{title}}List }
      create={ {{title}}Create }
      edit={ {{title}}Edit }
      show={ {{title}}Show }
      remove={ Delete }
    />
);
