import {{lc}} from './{{lc}}';

export default {
  {{#each labels}}
  {{@key}}: '{{this}}',
  {{/each }}
  {{lc}},
};
