import { ApiResource } from "../utils/types";

export interface {{{ucf}}} extends ApiResource {
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{{name}}}?: {{#if (compare tsType "==" "date")}}string{{else}}{{{tsType}}}{{/if}};
{{/each}}
}
