import { ApiResource } from "../utils/types";

export interface {{{ucf}}} extends ApiResource {
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{{name}}}?: {{#if (compare type "==" "Date")}}string{{else}}{{{type}}}{{/if}};
{{/each}}
}
