import { Item } from "./item";

export class {{{ucf}}} implements Item {
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
