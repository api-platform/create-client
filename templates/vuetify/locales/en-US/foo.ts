export default {
  {{#each labels}}
  {{this}}: '{{capitalize this}}',
  {{/each }}
};
