import pc from "picocolors";
import handlebars from "handlebars";
// @ts-expect-error Old lib that is not typed
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import { BaseGenerator } from "./BaseGenerator";
import type { GeneratorParams } from "../types";
import type { Api, Resource } from "@api-platform/api-doc-parser";

export class ReactGenerator extends BaseGenerator {
  constructor(params: GeneratorParams) {
    super(params);

    this.registerTemplates("react/", [
      // utils
      "utils/dataAccess.ts",
      "utils/types.ts",

      // hooks
      "hooks/create.ts",
      "hooks/delete.ts",
      "hooks/fetch.ts",
      "hooks/index.ts",
      "hooks/list.ts",
      "hooks/mercure.ts",
      "hooks/retrieve.ts",
      "hooks/update.ts",
      "hooks/show.ts",

      // interfaces
      "interfaces/Collection.ts",
      "interfaces/foo.ts",

      // components
      "components/foo/Create.tsx",
      "components/foo/Form.tsx",
      "components/foo/index.ts",
      "components/foo/List.tsx",
      "components/foo/Update.tsx",
      "components/foo/type.ts",
      "components/foo/Show.tsx",
      "components/Field.tsx",
      "components/Links.tsx",
      "components/Pagination.tsx",

      // routes
      "routes/foo.tsx",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
  }

  help(resource: Resource) {
    const titleLc = resource.title?.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );
    console.log(
      "Paste the following definitions in your application configuration (`client/src/index.tsx` by default):"
    );
    console.log(
      pc.green(`
// import routes
import ${titleLc}Routes from './routes/${titleLc}';

// Add routes to <Routes>
{ ${titleLc}Routes }
`)
    );
  }

  async generate(api: Api, resource: Resource, dir: string) {
    if (!resource.title) {
      console.error(`No title found for resource ${resource.name}`);
      return undefined;
    }
    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);
    const fields = this.parseFields(resource);

    const context = {
      fields,
      hasManyRelations: fields.some(
        (field) => field.isReferences || field.isEmbeddeds
      ),
      hasRelations: fields.some((field) => field.reference || field.embedded),
      hydraPrefix: this.hydraPrefix,
      lc,
      name: resource.name,
      title: resource.title,
      uc: resource.title.toUpperCase(),
      ucf,
    };

    await Promise.all(
      [
        // components
        "components/%s/Create.tsx",
        "components/%s/Form.tsx",
        "components/%s/index.ts",
        "components/%s/List.tsx",
        "components/%s/Update.tsx",
        "components/%s/type.ts",
        "components/%s/Show.tsx",

        // routes
        "routes/%s.tsx",
      ].map((pattern) =>
        this.createFileFromPattern(pattern, dir, [lc], context)
      )
    );

    // interface pattern should be camel cased
    await this.createFile(
      "interfaces/foo.ts",
      `${dir}/interfaces/${context.ucf}.ts`,
      context
    );

    // copy with regular name
    await Promise.all(
      [
        // interfaces
        "interfaces/Collection.ts",

        // components
        "components/Field.tsx",
        "components/Links.tsx",
        "components/Pagination.tsx",

        // hooks
        "hooks/create.ts",
        "hooks/delete.ts",
        "hooks/fetch.ts",
        "hooks/index.ts",
        "hooks/list.ts",
        "hooks/mercure.ts",
        "hooks/retrieve.ts",
        "hooks/update.ts",
        "hooks/show.ts",

        // utils
        "utils/dataAccess.ts",
        "utils/types.ts",
      ].map((file) => this.createFile(file, `${dir}/${file}`, context, false))
    );

    // API config
    return this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);
  }
}
