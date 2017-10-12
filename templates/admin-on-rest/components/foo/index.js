import React from 'react';
import {
  List, Datagrid, Edit, Create, Show, SimpleShowLayout, SimpleForm,
  DateField, TextField,
  DisabledInput, TextInput, DateInput,
  EditButton,ShowButton, DeleteButton
} from 'admin-on-rest';
import {configList, configEdit, configCreate, configShow} from '../../config/{{{lc}}}';

export const {{title}}List = (props) => (
  <List {...props}>
    <Datagrid>
    {{#each fields}}
      {configList.{{name}} && <TextField source="{{{name}}}" />}
    {{/each}}
      {configList.buttons.show && <ShowButton />}
      {configList.buttons.edit && <EditButton />}
      {configList.buttons.delete && <DeleteButton />}
    </Datagrid>
  </List>
);

const {{title}}Title = ({record}) => {
  return <span>{{title}} {record && record.id ? ` : ${record.id}` : ''}</span>;
};

export const {{title}}Edit = (props) => (
  <Edit title={<{{title}}Title />} {...props}>
    <SimpleForm>
    {{#each formFields}}
     {{#compare type "==" "dateTime" }}
      {configEdit.{{name}} && <DateInput source="{{{name}}}" />}
     {{else}}
      {configEdit.{{name}} && <TextInput source="{{{name}}}" />}
     {{/compare}}
    {{/each}}
    </SimpleForm>
  </Edit>
);

export const {{title}}Create = (props) => (
  <Create title='Create a {{{title}}}' {...props}>
    <SimpleForm>
    {{#each formFields}}
     {{#compare type "==" "dateTime" }}
      {configCreate.{{name}} && <DateField source="{{{name}}}" />}
     {{else}}
      {configCreate.{{name}} && <TextInput source="{{{name}}}" />}
     {{/compare}}
    {{/each}}
    </SimpleForm>
  </Create>
);

export const {{title}}Show = (props) => (
  <Show title={<{{title}}Title />} {...props}>
    <SimpleShowLayout>
    {{#each fields}}
      {configShow.{{name}} && <TextField source="{{{name}}}" />}
    {{/each}}
    </SimpleShowLayout>
  </Show>
);
