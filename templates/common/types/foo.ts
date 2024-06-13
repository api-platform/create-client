import type { Item } from "./item";

export interface {{titleUcFirst}} extends Item {
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{name}}?: {{#if (compare tsType "==" "dateTime")}}string{{else if (compare htmlInputType "==" "integer")}}number{{else if isRelation}}any{{else}}{{tsType}}{{/if}};
{{/each}}
}
