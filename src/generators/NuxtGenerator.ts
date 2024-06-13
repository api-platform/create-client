import handlebars from "handlebars";
// @ts-expect-error Old lib that is not typed
import hbh_comparison from "handlebars-helpers/lib/comparison.js";
// @ts-expect-error Old lib that is not typed
import hbh_array from "handlebars-helpers/lib/array.js";
// @ts-expect-error Old lib that is not typed
import hbh_string from "handlebars-helpers/lib/string.js";
import { BaseGenerator } from "./BaseGenerator";
import type { Api, Resource } from "@api-platform/api-doc-parser";
import type { GeneratorParams } from "../types";

export class NuxtGenerator extends BaseGenerator {
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

      // composables
      "composables/api.ts",

      // pages
      "pages/index.vue",
      "pages/foos/create.vue",
      "pages/foos/index.vue",
      "pages/foos/[id]/edit.vue",
      "pages/foos/[id]/index.vue",
      "pages/foos/page/[page].vue",

      // stores
      "stores/foo/create.ts",
      "stores/foo/delete.ts",
      "stores/foo/list.ts",
      "stores/foo/show.ts",
      "stores/foo/update.ts",

      // types
      "types/api.ts",

      // utils
      "utils/resource.ts",
    ]);

    handlebars.registerHelper("compare", hbh_comparison.compare);
    handlebars.registerHelper("forEach", hbh_array.forEach);
    handlebars.registerHelper("lowercase", hbh_string.lowercase);
  }

  getContextForResource(resource: Resource) {
    if (!resource.title) {
      console.error(`No title found for resource ${resource.name}`);
      return undefined;
    }
    const lc = resource.title.toLowerCase();
    const titleUcFirst = this.ucFirst(resource.title);
    const fields = this.parseFields(resource);
    const hasIsRelation = fields.some((field) => field.isRelation);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasRelations = hasIsRelation || hasIsRelations;

    return {
      fields,
      hasIsRelation,
      hasIsRelations,
      hasRelations,
      hydraPrefix: this.hydraPrefix,
      lc,
      name: resource.name,
      title: resource.title,
      titleUcFirst,
      uc: resource.title.toUpperCase(),
    };
  }

  async generate(api: Api, resource: Resource, dir: string) {
    const context = this.getContextForResource(resource);
    if (!context) {
      return;
    }

    const { lc, titleUcFirst } = context;

    await this.createDir(`${dir}/assets/css`, false);

    await Promise.all(
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
        "pages/%ss/page/[page].vue",

        // stores
        "stores/%s/create.ts",
        "stores/%s/delete.ts",
        "stores/%s/list.ts",
        "stores/%s/show.ts",
        "stores/%s/update.ts",

        // types
        "types/%s.ts",
      ].map((pattern) =>
        this.createFileFromPattern(pattern, dir, [lc, titleUcFirst], context)
      )
    );

    await Promise.all(
      [
        // components
        "components/common/FormRepeater.vue",

        // composables
        "composables/api.ts",
        "composables/mercureItem.ts",
        "composables/mercureList.ts",

        // pages
        "pages/index.vue",

        // types
        "types/api.ts",
        "types/collection.ts",
        "types/error.ts",
        "types/item.ts",
        "types/view.ts",

        // utils
        "utils/date.ts",
        "utils/error.ts",
        "utils/mercure.ts",

        // utils
        "utils/resource.ts",
      ].map((path) => this.createFile(path, `${dir}/${path}`, context, false))
    );

    // config
    return this.createConfigFile(`${dir}/utils/config.ts`, {
      entrypoint: api.entrypoint,
    });
  }
}
