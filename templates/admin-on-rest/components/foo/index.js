import React from 'react';
import {List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, DisabledInput, TextInput, LongTextInput, DateInput} from 'admin-on-rest';

export const {{name}}List = (props) => (
  <List {...props}>
    <Datagrid>
    {{#each fields}}
      <TextField source="{{{name}}}" />
    {{/each}}
    </Datagrid>
  </List>
);

const {{name}}Title = ({record}) => {
  return <span>{{name}} {record ? `"${record.title}"` : ''}</span>;
};

export const {{name}}Edit = (props) => (
  <Edit title={<{{name}}Title />} {...props}>
    <SimpleForm>
      {{#each fields}}
      <TextInput source="{{{name}}}" />
      {{/each}}
    </SimpleForm>
  </Edit>
);

export const {{name}}Create = (props) => (
  <Create title='Create a {{{name}}}' {...props}>
    <SimpleForm>
      {{#each fields}}
      <TextInput source="{{{name}}}" />
      {{/each}}
    </SimpleForm>
  </Create>
);
