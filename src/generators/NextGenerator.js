import chalk from "chalk";
import handlebars from "handlebars";
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import hbhString from "handlebars-helpers/lib/string.js";
import BaseGenerator from "./BaseGenerator.js";

export default class NextGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.routeAddedtoServer = false;
    this.registerTemplates(`next/`, [
      // components
      "components/common/Layout.tsx",
      "components/common/Pagination.tsx",
      "components/common/ReferenceLinks.tsx",
      "components/foo/List.tsx",
      "components/foo/Show.tsx",
      "components/foo/Form.tsx",

      // types
      "types/collection.ts",
      "types/foo.ts",
      "types/item.ts",

      // pages
      "pages/foos/[id]/index.tsx",
      "pages/foos/[id]/edit.tsx",
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

  help(resource) {
    console.log(
      chalk.green('Code for the "%s" resource type has been generated!'),
      resource.title
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);
    const { fields, imports } = this.parseFields(resource);

    const context = {
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf,
      fields,
      formFields: this.buildFields(fields),
      imports,
      hydraPrefix: this.hydraPrefix,
      title: resource.title,
      hasRelations: fields.some((field) => field.reference || field.embedded),
      hasManyRelations: fields.some(
        (field) => field.isReferences || field.isEmbeddeds
      ),
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/components/common`,
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/types`,
      `${dir}/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    // Copy with patterned name
    this.createDir(`${dir}/components/${context.lc}`);
    this.createDir(`${dir}/pages/${context.lc}s`);
    this.createDir(`${dir}/pages/${context.lc}s/[id]`);
    [
      // components
      "components/%s/List.tsx",
      "components/%s/Show.tsx",
      "components/%s/Form.tsx",

      // pages
      "pages/%ss/[id]/index.tsx",
      "pages/%ss/[id]/edit.tsx",
      "pages/%ss/index.tsx",
      "pages/%ss/create.tsx",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, [context.lc], context)
    );

    // interface pattern should be camel cased
    this.createFile("types/foo.ts", `${dir}/types/${context.ucf}.ts`, context);

    // copy with regular name
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
    ].forEach((file) =>
      this.createFile(file, `${dir}/${file}`, context, false)
    );

    // API config
    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : "";
  }

  parseFields(resource) {
    const fields = [
      ...resource.writableFields,
      ...resource.readableFields,
    ].reduce((list, field) => {
      if (list[field.name]) {
        return list;
      }

      const isReferences = field.reference && field.maxCardinality !== 1;
      const isEmbeddeds = field.embedded && field.maxCardinality !== 1;

      return {
        ...list,
        [field.name]: {
          ...field,
          type: this.getType(field),
          description: this.getDescription(field),
          readonly: false,
          isReferences,
          isEmbeddeds,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    // Parse fields to add relevant imports, required for Typescript
    const fieldsArray = Object.values(fields);
    const imports = Object.values(fields).reduce(
      (list, { reference, type }) => {
        if (!reference) {
          return list;
        }

        return {
          ...list,
          [type]: {
            type,
            file: `./${type}`,
          },
        };
      },
      {}
    );

    return { fields: fieldsArray, imports: Object.values(imports) };
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
