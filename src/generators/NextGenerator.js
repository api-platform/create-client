import chalk from "chalk";
import BaseGenerator from "./BaseGenerator";

export default class NextGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.routeAddedtoServer = false;
    this.registerTemplates(`next/`, [
      // components
      "components/common/ReferenceLinks.tsx",
      "components/foo/List.tsx",
      "components/foo/Show.tsx",
      "components/foo/Form.tsx",

      // interfaces
      "error/SubmissionError.ts",

      // types
      "types/Collection.ts",
      "types/foo.ts",

      // pages
      "pages/foos/[id]/index.tsx",
      "pages/foos/[id]/edit.tsx",
      "pages/foos/index.tsx",
      "pages/foos/create.tsx",

      // utils
      "utils/dataAccess.ts",
    ]);
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
      this.createFileFromPattern(pattern, dir, context.lc, context)
    );

    // interface pattern should be camel cased
    this.createFile("types/foo.ts", `${dir}/types/${context.ucf}.ts`, context);

    // copy with regular name
    [
      // components
      "components/common/ReferenceLinks.tsx",

      // error
      "error/SubmissionError.ts",

      // types
      "types/Collection.ts",

      // utils
      "utils/dataAccess.ts",
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

      return {
        ...list,
        [field.name]: {
          notrequired: !field.required,
          name: field.name,
          type: this.getType(field),
          description: this.getDescription(field),
          readonly: false,
          reference: field.reference,
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
