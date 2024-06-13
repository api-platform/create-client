import handlebars from "handlebars";
import { keyword } from "esutils";
import { BaseGenerator } from "./BaseGenerator";
import type { Api, Resource } from "@api-platform/api-doc-parser";
import type { GeneratorParams } from "../types";

export class TypescriptInterfaceGenerator extends BaseGenerator {
  constructor(params: GeneratorParams) {
    super(params);

    this.registerTemplates(`typescript/`, ["interface.ts"]);

    handlebars.registerHelper("isIdentifier", (name) =>
      keyword.isIdentifierES5(name, true)
    );
  }

  help(resource: Resource) {
    console.log(
      'Interface for the "%s" resource type has been generated!',
      resource.title
    );
  }

  async generate(api: Api, resource: Resource, dir: string) {
    if (!resource.title) {
      console.error("No title found for resource");
      return;
    }
    const dest = `${dir}/interfaces`;
    const fields = this.parseFields(resource);

    await this.createDir(dest, false);
    await this.createFile(
      "interface.ts",
      `${dest}/${resource.title.toLowerCase()}.ts`,
      {
        fields,
        name: resource.title.replace(/-/g, "_"),
      }
    );
  }
}
