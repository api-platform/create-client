import React from 'react';
import {CardActions} from 'material-ui/Card';
import {
  List, Datagrid, Edit, Create, Show, SimpleShowLayout, SimpleForm,
  DateField, TextField,
  TextInput, DateInput,
  EditButton,ShowButton, DeleteButton, RefreshButton, ListButton, CreateButton
} from 'admin-on-rest';
import {configList, configEdit, configCreate, configShow} from '../config/{{{lc}}}';

export const {{title}}List = (props) => (
  <List
    actions={<{{title}}ListActions/>}
    {...props}
  >
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
  <Edit
    actions={<{{title}}EditActions/>}
    title={<{{title}}Title />}
    {...props}
  >
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
  <Show
    actions={<{{title}}ShowActions/>}
    title={<{{title}}Title />}
    {...props}
  >
    <SimpleShowLayout>
    {{#each fields}}
      {configShow.{{name}} && <TextField source="{{{name}}}" />}
    {{/each}}
    </SimpleShowLayout>
  </Show>
);

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right',
};

const {{title}}ListActions = ({basePath, data}) => (
  <CardActions style={cardActionStyle}>
    {configList.buttons.create && <CreateButton basePath={basePath} />}
    {configList.buttons.refresh && <RefreshButton basePath={basePath} record={data} />}
  </CardActions>
);

const {{title}}ShowActions = ({basePath, data}) => (
  <CardActions style={cardActionStyle}>
    {configShow.buttons.edit && <EditButton basePath={basePath} record={data}/>}
    {configShow.buttons.list && <ListButton basePath={basePath}/>}
    {configShow.buttons.delete && <DeleteButton basePath={basePath} record={data}/>}
    {configShow.buttons.refresh && <RefreshButton basePath={basePath} record={data}/>}
  </CardActions>
);

const {{title}}EditActions = ({basePath, data}) => (
  <CardActions style={cardActionStyle}>
    {configShow.buttons.show && <ShowButton basePath={basePath} record={data}/>}
    {configShow.buttons.list && <ListButton basePath={basePath}/>}
    {configShow.buttons.delete && <DeleteButton basePath={basePath} record={data}/>}
    {configShow.buttons.refresh && <RefreshButton basePath={basePath} record={data}/>}
  </CardActions>
);
