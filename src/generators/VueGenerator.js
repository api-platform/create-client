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
      "utils/mercure.ts",
    ]);

    this.registerTemplates(`vue/`, [
      // components
      "components/foo/FooCreate.vue",
      "components/foo/FooForm.vue",
      "components/foo/FooList.vue",
      "components/foo/FooShow.vue",
      "components/foo/FooUpdate.vue",

      // common components
      "components/common/FormRepeater.vue",

      // composables
      "composables/mercureItem.ts",
      "composables/mercureList.ts",

      // routes
      "router/foo.ts",

      // stores
      "stores/foo/create.ts",
      "stores/foo/delete.ts",
      "stores/foo/list.ts",
      "stores/foo/show.ts",
      "stores/foo/update.ts",

      // types
      "types/collection.ts",
      "types/error.ts",
      "types/foo.ts",
      "types/item.ts",
      "types/stores.ts",
      "types/view.ts",

      // utils
      "utils/date.ts",
      "utils/error.ts",
      "utils/fetch.ts",
      "utils/hydra.ts",

      // views
      "views/foo/CreateView.vue",
      "views/foo/ListView.vue",
      "views/foo/UpdateView.vue",
      "views/foo/ShowView.vue",
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
    const fields = this.parseFields(resource);
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
      `${dir}/composables`,
      `${dir}/router`,
      `${dir}/types`,
      `${dir}/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    [
      `${dir}/components/${lc}`,
      `${dir}/components/common`,
      `${dir}/stores/${lc}`,
      `${dir}/views/${lc}`,
    ].forEach((dir) => this.createDir(dir));

    [
      // components
      "components/%s/%sCreate.vue",
      "components/%s/%sForm.vue",
      "components/%s/%sList.vue",
      "components/%s/%sShow.vue",
      "components/%s/%sUpdate.vue",

      // router
      "router/%s.ts",

      // stores
      "stores/%s/create.ts",
      "stores/%s/delete.ts",
      "stores/%s/list.ts",
      "stores/%s/show.ts",
      "stores/%s/update.ts",

      // types
      "types/%s.ts",

      // views
      "views/%s/CreateView.vue",
      "views/%s/ListView.vue",
      "views/%s/ShowView.vue",
      "views/%s/UpdateView.vue",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, [lc, titleUcFirst], context)
    );

    [
      // components
      "components/common/FormRepeater.vue",

      // composables
      "composables/mercureItem.ts",
      "composables/mercureList.ts",

      // utils
      "utils/date.ts",
      "utils/error.ts",
      "utils/fetch.ts",
      "utils/hydra.ts",
      "utils/mercure.ts",

      // types
      "types/collection.ts",
      "types/error.ts",
      "types/item.ts",
      "types/stores.ts",
      "types/view.ts",
    ].forEach((path) =>
      this.createFile(path, `${dir}/${path}`, context, false)
    );

    // entrypoint
    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);
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
          isRelations: field.reference || field.embedded,
          isManyRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    return Object.values(fields);
  }
}
