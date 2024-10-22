{{#each apiResource}}
import  { {{this}}Routes } from '@router/{{lowercase this}}'
{{/each}}
export const resourcesRoutes = [
  {{#each apiResource}}
  ...{{this}}Routes,
  {{/each}}
];
