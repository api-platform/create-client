import chalk from "chalk";
import BaseGenerator from "./BaseGenerator.js";
import handlebars from "handlebars";
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import hbhString from "handlebars-helpers/lib/string.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("common/", [
      // utils
      "utils/mercure.js",
    ]);

    this.registerTemplates(`vue/`, [
      // modules
      "stores/foo/create.ts",
      "stores/foo/delete.ts",
      "stores/foo/list.ts",
      "stores/foo/show.ts",
      "stores/foo/update.ts",

      // views
      "views/foo/CreateView.vue",
      "views/foo/ListView.vue",
      "views/foo/UpdateView.vue",
      "views/foo/ShowView.vue",

      // components
      "components/foo/EntityCreate.vue",
      "components/foo/EntityForm.vue",
      "components/foo/EntityList.vue",
      "components/foo/EntityUpdate.vue",
      "components/foo/EntityShow.vue",
      "components/common/FormRepeater.vue",

      // composables
      "composables/mercureItem.ts",
      "composables/mercureList.ts",

      // routes
      "router/foo.ts",

      // error
      "error/SubmissionError.ts",

      // utils
      "utils/date.ts",
      "utils/fetch.ts",
      "utils/hydra.ts",
      "utils/types.ts",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
    handlebars.registerHelper("lowercase", hbhString.lowercase);
  }

  help(resource) {
    const titleLc = resource.title.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );
    console.log(
      "Paste the following definitions in your application configuration:"
    );
    console.log(
      chalk.green(`
// Import routes
import ${titleLc}Routes from '@/router/${titleLc}';

// Add routes to VueRouter
const router = createRouter({
  // ...
  routes: [
      ...${titleLc}Routes,
  ]
});
      `)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);
    const { fields } = this.parseFields(resource);
    const hasRelations = fields.some(
      (field) => field.reference || field.embedded
    );
    const hasManyRelations = fields.some(
      (field) => field.isReferences || field.isEmbeddeds
    );

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields,
      formFields: this.buildFields(fields),
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
      hasRelations,
      hasManyRelations,
      hasRelationsOrManyRelations: hasRelations || hasManyRelations,
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/router`,
      `${dir}/utils`,
      `${dir}/composables`,
    ].forEach((dir) => this.createDir(dir, false));

    [
      `${dir}/stores/${lc}`,
      `${dir}/components/${lc}`,
      `${dir}/components/common`,
      `${dir}/views/${lc}`,
    ].forEach((dir) => this.createDir(dir));

    [
      // modules
      "stores/%s/create.ts",
      "stores/%s/delete.ts",
      "stores/%s/list.ts",
      "stores/%s/show.ts",
      "stores/%s/update.ts",

      // views
      "views/%s/CreateView.vue",
      "views/%s/ListView.vue",
      "views/%s/ShowView.vue",
      "views/%s/UpdateView.vue",

      // components
      "components/%s/EntityCreate.vue",
      "components/%s/EntityForm.vue",
      "components/%s/EntityList.vue",
      "components/%s/EntityUpdate.vue",
      "components/%s/EntityShow.vue",

      // routes
      "router/%s.ts",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, lc, context)
    );

    // common components
    this.createFile(
      "components/common/FormRepeater.vue",
      `${dir}/components/common/FormRepeater.vue`,
      context,
      false
    );

    // composables
    this.createFile(
      "composables/mercureItem.ts",
      `${dir}/composables/mercureItem.ts`,
      {},
      false
    );
    this.createFile(
      "composables/mercureList.ts",
      `${dir}/composables/mercureList.ts`,
      {},
      false
    );

    // error
    this.createFile(
      "error/SubmissionError.ts",
      `${dir}/error/SubmissionError.ts`,
      context,
      false
    );

    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);
    this.createFile("utils/date.ts", `${dir}/utils/date.ts`, {}, false);
    this.createFile(
      "utils/fetch.ts",
      `${dir}/utils/fetch.ts`,
      { hydraPrefix: this.hydraPrefix },
      false
    );
    this.createFile(
      "utils/hydra.ts",
      `${dir}/utils/hydra.ts`,
      { hydraPrefix: this.hydraPrefix },
      false
    );
    this.createFile(
      "utils/types.ts",
      `${dir}/utils/types.ts`,
      { hydraPrefix: this.hydraPrefix },
      false
    );
    this.createFile("utils/mercure.js", `${dir}/utils/mercure.ts`);
  }

  parseFields(resource) {
    const fields = [
      ...resource.writableFields,
      ...resource.readableFields,
    ].reduce((list, field) => {
      if (list[field.name]) {
        return list;
      }

      const isReferences = Boolean(
        field.reference && field.maxCardinality !== 1
      );
      const isEmbeddeds = Boolean(field.embedded && field.maxCardinality !== 1);

      return {
        ...list,
        [field.name]: {
          ...field,
          isReferences,
          isEmbeddeds,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    const fieldsArray = Object.values(fields);

    return { fields: fieldsArray };
  }
}
