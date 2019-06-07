{{#each imports}}
import { {{type}} } from "{{file}}";
{{/each}}
{{#if imports.length}}

{{/if}}
export interface {{{name}}} {
  '@id'?: string;
{{#each fields}}
 {{#if readonly}} readonly{{/if}} {{{name}}}{{#if notrequired}}?{{/if}}: {{{type}}};
{{/each}}
}
