export interface {{{name}}} {
  '@id'?: string;
{{#each fields}}
 {{#if readonly}} readonly{{/if}} {{{name}}}{{#if notrequired}}?{{/if}}: {{{type}}};
{{/each}}
}
