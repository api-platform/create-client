export class {{{ucf}}} {
  public "@id"?: string;

  constructor(
    _id?: string,
{{#each fields}}
 {{#if readonly}}readonly{{/if}} public {{{name}}}?: {{{type}}},
{{/each}}
  ) {
    this["@id"] = _id;
  }
}
