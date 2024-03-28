import ApiResource from "./ApiResource";

export default interface {{{ucf}}} extends ApiResource {
    {{#each fields}}
        {{#if readonly}}readonly{{/if}} {{{name}}}?: {{#if (compare type "==" "Date")}}string{{else}}{{{type}}}{{/if}};
    {{/each}}
}