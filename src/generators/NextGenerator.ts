import type { Api, Resource } from "@api-platform/api-doc-parser";
import handlebars from "handlebars";
// @ts-expect-error Old lib that is not typed
import hbhComparison from "handlebars-helpers/lib/comparison.js";
// @ts-expect-error Old lib that is not typed
import hbhString from "handlebars-helpers/lib/string.js";
import type { GeneratorParams } from "../types";
import { BaseGenerator } from "./BaseGenerator";

export class NextGenerator extends BaseGenerator {
  constructor(params: GeneratorParams) {
    super(params);

    this.registerTemplates(`next/`, [
      // components
      "components/common/Layout.tsx",
      "components/common/Pagination.tsx",
      "components/common/ReferenceLinks.tsx",
      "components/foo/List.tsx",
      "components/foo/PageList.tsx",
      "components/foo/Show.tsx",
      "components/foo/Form.tsx",

      // types
      "types/collection.ts",
      "types/foo.ts",
      "types/item.ts",

      // pages
      "pages/foos/[id]/index.tsx",
      "pages/foos/[id]/edit.tsx",
      "pages/foos/page/[page].tsx",
      "pages/foos/index.tsx",
      "pages/foos/create.tsx",
      "pages/_app.tsx",

      // utils
      "utils/dataAccess.ts",
      "utils/mercure.ts",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
    handlebars.registerHelper("lowercase", hbhString.lowercase);
  }

  async generate(api: Api, resource: Resource, dir: string) {
    if (!resource.title) {
      console.error("No title found for resource");
      return;
    }

    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);
    const fields = this.parseFields(resource);

    const context = {
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf,
      fields,
      hydraPrefix: this.hydraPrefix,
      title: resource.title,
      hasRelations: fields.some((field) => field.reference || field.embedded),
      hasManyRelations: fields.some(
        (field) => field.isReferences || field.isEmbeddeds
      ),
    };

    await Promise.all(
      [
        // components
        "components/%s/List.tsx",
        "components/%s/PageList.tsx",
        "components/%s/Show.tsx",
        "components/%s/Form.tsx",

        // pages
        "pages/%ss/[id]/index.tsx",
        "pages/%ss/[id]/edit.tsx",
        "pages/%ss/page/[page].tsx",
        "pages/%ss/index.tsx",
        "pages/%ss/create.tsx",
      ].map((pattern) =>
        this.createFileFromPattern(pattern, dir, [context.lc], context)
      )
    );

    // interface pattern should be camel cased
    await this.createFile(
      "types/foo.ts",
      `${dir}/types/${context.ucf}.ts`,
      context
    );

    // copy with regular name
    await Promise.all(
      [
        // components
        "components/common/Layout.tsx",
        "components/common/Pagination.tsx",
        "components/common/ReferenceLinks.tsx",

        // types
        "types/collection.ts",
        "types/item.ts",

        // pages
        "pages/_app.tsx",

        // utils
        "utils/dataAccess.ts",
        "utils/mercure.ts",
      ].map((file) => this.createFile(file, `${dir}/${file}`, context, false))
    );

    // API config
    return this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);
  }
}
