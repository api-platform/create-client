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
      "components/foo/ListItem.tsx",
      "components/foo/Show.tsx",

      // interfaces
      "error/SubmissionError.ts",

      // interfaces
      "interfaces/Collection.ts",
      "interfaces/foo.ts",

      // pages
      "pages/foos/[id].tsx",
      "pages/foos/index.tsx",

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
      `${dir}/interfaces`,
      `${dir}/pages`,
      `${dir}/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    // copy with patterned name
    this.createDir(`${dir}/components/${context.lc}`);
    this.createDir(`${dir}/pages/${context.lc}s`);
    [
      // components
      "components/%s/List.tsx",
      "components/%s/ListItem.tsx",
      "components/%s/Show.tsx",

      // pages
      "pages/%ss/[id].tsx",
      "pages/%ss/index.tsx",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, context.lc, context)
    );

    // interface pattern should be camel cased
    this.createFile(
      "interfaces/foo.ts",
      `${dir}/interfaces/${context.ucf}.ts`,
      context
    );

    // copy with regular name
    [
      // components
      "components/common/ReferenceLinks.tsx",

      // error
      "error/SubmissionError.ts",

      // interfaces
      "interfaces/Collection.ts",

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
