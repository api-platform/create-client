import pc from "picocolors";
import { BaseGenerator } from "./BaseGenerator";
import type { GeneratorParams } from "../types";
import handlebars from "handlebars";
// @ts-expect-error Old lib that is not typed
import hbhComparison from "handlebars-helpers/lib/comparison.js";
// @ts-expect-error Old lib that is not typed
import hbhString from "handlebars-helpers/lib/string.js";
import type { Api, Resource } from "@api-platform/api-doc-parser";

export class VueGenerator extends BaseGenerator {
  constructor(params: GeneratorParams) {
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

    this.registerTemplates(`vue/`, [
      // components
      "components/foo/FooCreate.vue",
      "components/foo/FooForm.vue",
      "components/foo/FooList.vue",
      "components/foo/FooShow.vue",
      "components/foo/FooUpdate.vue",

      // common components
      "components/common/FormRepeater.vue",

      // routes
      "router/foo.ts",

      // stores
      "stores/foo/create.ts",
      "stores/foo/delete.ts",
      "stores/foo/list.ts",
      "stores/foo/show.ts",
      "stores/foo/update.ts",

      // types
      "types/stores.ts",

      // views
      "views/foo/ViewCreate.vue",
      "views/foo/ViewList.vue",
      "views/foo/ViewUpdate.vue",
      "views/foo/ViewShow.vue",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
    handlebars.registerHelper("lowercase", hbhString.lowercase);
  }

  help(resource: Resource) {
    const titleLc = resource.title?.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );

    console.log(
      "Paste the following definitions in your application configuration:"
    );
    console.log(
      pc.green(`
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

  async generate(api: Api, resource: Resource, dir: string) {
    if (!resource.title) {
      console.error(`No title found for resource ${resource.name}`);
      return undefined;
    }
    const lc = resource.title.toLowerCase();

    const titleUcFirst = lc.charAt(0).toUpperCase() + lc.slice(1);
    const fields = this.parseFields(resource);
    const hasIsRelation = fields.some((field) => field.isRelation);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasDateField = fields.some((field) => field.type === "dateTime");

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title?.toUpperCase(),
      fields,
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
      hasIsRelation,
      hasIsRelations,
      hasRelations: hasIsRelation || hasIsRelations,
      hasDateField,
    };

    await Promise.all(
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
        "views/%s/ViewCreate.vue",
        "views/%s/ViewList.vue",
        "views/%s/ViewShow.vue",
        "views/%s/ViewUpdate.vue",
      ].map((pattern) =>
        this.createFileFromPattern(pattern, dir, [lc, titleUcFirst], context)
      )
    );

    await Promise.all(
      [
        // components
        "components/common/FormRepeater.vue",

        // composables
        "composables/mercureItem.ts",
        "composables/mercureList.ts",

        // types
        "types/collection.ts",
        "types/error.ts",
        "types/item.ts",
        "types/stores.ts",
        "types/view.ts",

        // utils
        "utils/api.ts",
        "utils/date.ts",
        "utils/error.ts",
        "utils/mercure.ts",
      ].map((path) => this.createFile(path, `${dir}/${path}`, context, false))
    );

    // config
    await this.createConfigFile(`${dir}/utils/config.ts`, {
      entrypoint: api.entrypoint,
    });
  }
}
