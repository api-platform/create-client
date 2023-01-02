import type { Item } from "./item";

export interface {{titleUcFirst}} extends Item {
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{{name}}}?: {{#if (compare type "==" "dateTime")}}string{{else if (compare type "==" "integer")}}number{{else if isRelation}}any{{else}}{{{type}}}{{/if}};
{{/each}}
}
