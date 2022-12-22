import chalk from "chalk";
import handlebars from "handlebars";
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import BaseGenerator from "./BaseGenerator.js";

export default class ReactGenerator extends BaseGenerator {
  constructor(params) {
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

  help(resource) {
    const titleLc = resource.title.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );
    console.log(
      "Paste the following definitions in your application configuration (`client/src/index.tsx` by default):"
    );
    console.log(
      chalk.green(`
// import routes
import ${titleLc}Routes from './routes/${titleLc}';

// Add routes to <Routes>
{ ${titleLc}Routes }
`)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);
    const fields = this.parseFields(resource);

    const context = {
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf,
      fields,
      formFields: this.buildFields(fields),
      hasRelations: fields.some((field) => field.reference || field.embedded),
      hasManyRelations: fields.some(
        (field) => field.isReferences || field.isEmbeddeds
      ),
      hydraPrefix: this.hydraPrefix,
      title: resource.title,
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/utils`,
      `${dir}/config`,
      `${dir}/interfaces`,
      `${dir}/routes`,
      `${dir}/components/${lc}`,
      `${dir}/hooks`,
    ].forEach((dir) => this.createDir(dir, false));

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
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, [lc], context)
    );

    // interface pattern should be camel cased
    this.createFile(
      "interfaces/foo.ts",
      `${dir}/interfaces/${context.ucf}.ts`,
      context
    );

    // copy with regular name
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

    return Object.values(fields);
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
