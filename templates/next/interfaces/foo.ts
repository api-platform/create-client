export interface {{{ucf}}} {
  '@id'?: string;
  id?: string;
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{{name}}}?: {{{type}}};
{{/each}}
}
