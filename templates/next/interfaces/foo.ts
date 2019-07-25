{{#each imports}}
import { {{type}} } from "{{file}}";
{{/each}}
{{#if imports.length}}

{{/if}}
export interface {{{ucf}}} {
  '@id'?: string;
  id?: string;
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{{name}}}?: {{{type}}};
{{/each}}
}
