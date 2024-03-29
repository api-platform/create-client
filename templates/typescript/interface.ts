export interface {{{name}}} {
  '@id'?: string;
  {{#each fields}}
    {{#if readonly}} readonly{{/if}} {{#unless (isIdentifier name)}}"{{/unless}}
      {{~ name ~}}
    {{#unless (isIdentifier name)}}"{{/unless}}{{#if notrequired}}?{{/if}}: {{{type}}};
  {{/each}}
}
