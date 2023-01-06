import handlebars from "handlebars";
import hbh_comparison from "handlebars-helpers/lib/comparison.js";
import hbh_array from "handlebars-helpers/lib/array.js";
import hbh_string from "handlebars-helpers/lib/string.js";
import chalk from "chalk";
import BaseGenerator from "./BaseGenerator.js";

export default class NuxtGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("common/", [
      // types
      "types/collection.ts",
      "types/error.ts",
      "types/foo.ts",
      "types/item.ts",
      "types/view.ts",

      // utils
      "utils/api.ts",
      "utils/config.ts",
      "utils/date.ts",
      "utils/error.ts",
      "utils/mercure.ts",
    ]);

    this.registerTemplates("vue-common/", [
      // composables
      "composables/mercureItem.ts",
      "composables/mercureList.ts",
    ]);

    this.registerTemplates(`nuxt/`, [
      // common components
      "components/common/FormRepeater.vue",

      // components
      "components/foo/FooCreate.vue",
      "components/foo/FooForm.vue",
      "components/foo/FooList.vue",
      "components/foo/FooShow.vue",
      "components/foo/FooUpdate.vue",

      // pages
      "pages/index.vue",
      "pages/foos/create.vue",
      "pages/foos/index.vue",
      "pages/foos/[id]/edit.vue",
      "pages/foos/[id]/index.vue",

      // stores
      "stores/foo/create.ts",
      "stores/foo/delete.ts",
      "stores/foo/list.ts",
      "stores/foo/show.ts",
      "stores/foo/update.ts",
    ]);

    handlebars.registerHelper("compare", hbh_comparison.compare);
    handlebars.registerHelper("forEach", hbh_array.forEach);
    handlebars.registerHelper("lowercase", hbh_string.lowercase);
  }

  help(resource) {
    console.log(
      chalk.green('Code for the "%s" resource type has been generated!'),
      resource.title
    );
  }

  getContextForResource(resource) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);
    const fields = this.parseFields(resource);
    const hasIsRelation = fields.some((field) => field.isRelation);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasRelations = hasIsRelation || hasIsRelations;

    const formFields = this.buildFields(fields);

    return {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields,
      hasIsRelation,
      hasIsRelations,
      hasRelations,
      formFields,
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
    };
  }

  generate(api, resource, dir) {
    const context = this.getContextForResource(resource);
    const { lc, titleUcFirst } = context;

    [
      `${dir}/assets`,
      `${dir}/assets/css`,
      `${dir}/components`,
      `${dir}/components/common`,
      `${dir}/components/${lc}`,
      `${dir}/composables`,
      `${dir}/pages`,
      `${dir}/pages/${lc}s`,
      `${dir}/pages/${lc}s/[id]`,
      `${dir}/stores`,
      `${dir}/stores/${lc}`,
      `${dir}/types`,
      `${dir}/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    [
      // components
      "components/%s/%sCreate.vue",
      "components/%s/%sForm.vue",
      "components/%s/%sList.vue",
      "components/%s/%sShow.vue",
      "components/%s/%sUpdate.vue",

      // pages
      "pages/%ss/create.vue",
      "pages/%ss/index.vue",
      "pages/%ss/[id]/edit.vue",
      "pages/%ss/[id]/index.vue",

      // stores
      "stores/%s/create.ts",
      "stores/%s/delete.ts",
      "stores/%s/list.ts",
      "stores/%s/show.ts",
      "stores/%s/update.ts",

      // types
      "types/%s.ts",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, [lc, titleUcFirst], context)
    );

    [
      // components
      "components/common/FormRepeater.vue",

      // composables
      "composables/mercureItem.ts",
      "composables/mercureList.ts",

      // pages
      "pages/index.vue",

      // types
      "types/collection.ts",
      "types/error.ts",
      "types/item.ts",
      "types/view.ts",

      // utils
      "utils/api.ts",
      "utils/date.ts",
      "utils/error.ts",
      "utils/mercure.ts",
    ].forEach((path) =>
      this.createFile(path, `${dir}/${path}`, context, false)
    );

    // config
    this.createConfigFile(`${dir}/utils/config.ts`, {
      entrypoint: api.entrypoint,
    });
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
          readonly: false,
          isReferences,
          isEmbeddeds,
          isRelation: field.reference || field.embedded,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    return Object.values(fields);
  }
}
