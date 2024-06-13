import pc from "picocolors";
import handlebars from "handlebars";
import type { Api, Resource } from "@api-platform/api-doc-parser";

// @ts-expect-error Old lib that is not typed
import hbh_comparison from "handlebars-helpers/lib/comparison.js";
// @ts-expect-error Old lib that is not typed
import hbh_string from "handlebars-helpers/lib/string.js";
import { BaseGenerator } from "./BaseGenerator";
import type { ParamType, Context, GeneratorParams } from "../types";

export class VuetifyGenerator extends BaseGenerator {
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

    this.registerTemplates("vuetify/", [
      // components
      "components/foo/FooCreate.vue",
      "components/foo/FooFilter.vue",
      "components/foo/FooForm.vue",
      "components/foo/FooList.vue",
      "components/foo/FooShow.vue",
      "components/foo/FooUpdate.vue",

      // common components
      "components/common/ActionCell.vue",
      "components/common/Breadcrumb.vue",
      "components/common/ConfirmDelete.vue",
      "components/common/DataFilter.vue",
      "components/common/FormRepeater.vue",
      "components/common/Loading.vue",
      "components/common/Toolbar.vue",

      // composables
      "composables/breadcrumb.ts",

      // locales
      "locales/en-US/foo.ts",
      "locales/en-US/index.ts",
      "locales/index.ts",

      // plugins
      "plugins/i18n.ts",

      // routes
      // "router/foo.ts",

      // store
      "store/foo/create.ts",
      "store/foo/delete.ts",
      "store/foo/list.ts",
      "store/foo/show.ts",
      "store/foo/update.ts",

      // types
      "types/breadcrumb.ts",
      "types/list.ts",

      // // pages
      // "pages/foos.vue", // list
      // "pages/foos.create.vue", // create
      // "pages/foos.edit.[id].vue", // update
      // "pages/foos.show.[id].vue", // show

      // pages
      "pages/foos/index.vue", // list
      "pages/foos/create.vue", // create
      "pages/foos/edit.[id].vue", // update
      "pages/foos/show.[id].vue", // show

      // views
      "views/foo/ViewCreate.vue",
      "views/foo/ViewList.vue",
      "views/foo/ViewShow.vue",
      "views/foo/ViewUpdate.vue",
    ]);

    handlebars.registerHelper("compare", hbh_comparison.compare);
    handlebars.registerHelper("lowercase", hbh_string.lowercase);
    handlebars.registerHelper("capitalize", hbh_string.capitalize);
  }

  help(resource: Resource) {
    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );
  }

  async generate(api: Api, resource: Resource, dir: string) {
    const parameters = (await resource?.getParameters?.()) ?? [];

    const paramsWithInputType = parameters.map((param) => ({
      ...param,
      ...this.getHtmlInputTypeFromField(param),
    }));

    const cleanedUpParams = this.cleanupParams(paramsWithInputType);

    return this.generateFiles(api, resource, dir, cleanedUpParams);
  }

  cleanupParams(params: ParamType[]) {
    const stats: { [key: string]: number } = {};
    const result: ParamType[] = [];

    params.forEach((p) => {
      const key = p.variable.endsWith("[]")
        ? p.variable.slice(0, -2)
        : p.variable;
      if (!stats[key]) {
        stats[key] = 0;
      }
      stats[key] += 1;
    });

    params.forEach((p) => {
      if (p.variable.startsWith("exists[")) {
        return; // removed for the moment, it can help to add null option to select
      }
      if (p.variable.startsWith("order[")) {
        result.push(p);
        return;
      }
      if (!stats[p.variable] && p.variable.endsWith("[]")) {
        if (stats[p.variable.slice(0, -2)] === 1) {
          result.push(p);
        }
      } else {
        if (stats[p.variable] === 2) {
          p.multiple = true;
        }
        result.push(p);
      }
    });

    return result;
  }

  getContextForResource(resource: Resource, params: ParamType[]) {
    if (!resource.title) {
      console.error(`No title found for resource ${resource.name}`);
      return undefined;
    }

    const lc = resource.title.toLowerCase();
    const titleUcFirst = lc.charAt(0).toUpperCase() + lc.slice(1);
    const fields = this.parseFields(resource);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasDateField = fields.some((field) => field.type === "dateTime");

    const parameters: ((typeof fields)[0] & { multiple?: boolean })[] = [];
    params.forEach((p) => {
      const param = fields.find((field) => field.name === p.variable);
      if (!param) {
        if (p.variable.startsWith("order[")) {
          const v = p.variable.slice(6, -1);
          const found = fields.findIndex((field) => field.name === v);
          if (found !== -1) {
            fields[found].sortable = true;
          }
          return;
        }
      } else {
        parameters.push({ ...param, multiple: p.multiple });
      }
    });

    const labels = this.commonLabelTexts();

    return {
      title: resource.title,
      titleUcFirst,
      name: resource.name,
      lc,
      fields,
      hasIsRelations,
      hasDateField,
      parameters,
      hydraPrefix: this.hydraPrefix,
      labels,
    };
  }

  async generateFiles(
    api: Api,
    resource: Resource,
    dir: string,
    params: ParamType[]
  ) {
    const context = this.getContextForResource(resource, params);
    if (!context) {
      return;
    }
    const { lc, titleUcFirst, labels, fields } = context;

    await Promise.all(
      [
        // common components
        "components/common/ActionCell.vue",
        "components/common/Breadcrumb.vue",
        "components/common/ConfirmDelete.vue",
        "components/common/DataFilter.vue",
        "components/common/FormRepeater.vue",
        "components/common/Loading.vue",
        "components/common/Toolbar.vue",

        // composables
        "composables/breadcrumb.ts",
        "composables/mercureItem.ts",
        "composables/mercureList.ts",

        // locales
        "locales/index.ts",

        // plugins
        "plugins/i18n.ts",

        // types
        "types/breadcrumb.ts",
        "types/collection.ts",
        "types/error.ts",
        "types/item.ts",
        "types/list.ts",
        "types/view.ts",

        // utils
        "utils/api.ts",
        "utils/date.ts",
        "utils/error.ts",
        "utils/mercure.ts",
      ].map((common) =>
        this.createFile(common, `${dir}/${common}`, context, false)
      )
    );

    await Promise.all(
      [
        // components
        "components/%s/%sCreate.vue",
        "components/%s/%sFilter.vue",
        "components/%s/%sForm.vue",
        "components/%s/%sList.vue",
        "components/%s/%sShow.vue",
        "components/%s/%sUpdate.vue",

        // routes
        // "router/%s.ts",

        // store
        "store/%s/create.ts",
        "store/%s/delete.ts",
        "store/%s/list.ts",
        "store/%s/show.ts",
        "store/%s/update.ts",

        // pages
        "pages/%ss/index.vue", // list
        "pages/%ss/create.vue", // create
        "pages/%ss/edit.[id].vue", // update
        "pages/%ss/show.[id].vue", // show
        // views
        // "views/%s/ViewCreate.vue",
        // "views/%s/ViewList.vue",
        // "views/%s/ViewShow.vue",
        // "views/%s/ViewUpdate.vue",

        // types
        "types/%s.ts",
      ].flatMap((pattern) => {
        if (
          pattern === "components/%s/%sFilter.vue" &&
          !context.parameters.length
        ) {
          return [];
        }

        return this.createFileFromPattern(
          pattern,
          dir,
          [lc, titleUcFirst],
          context
        );
      })
    );

    // config
    await this.createConfigFile(`${dir}/utils/config.ts`, {
      entrypoint: api.entrypoint,
    });

    await this.createFile(
      "locales/en-US/index.ts",
      `${dir}/locales/en-US/index.ts`,
      { labels },
      false
    );

    const contextLabels = {
      labels: this.getLabels(fields),
    };

    await this.createFile(
      "locales/en-US/foo.ts",
      `${dir}/locales/en-US/${lc}.ts`,
      contextLabels,
      false
    );
  }

  getLabels(fields: Context["fields"]) {
    const labels = fields.map((x) => x.name);
    return [...new Set(labels)];
  }

  commonLabelTexts() {
    return {
      home: "Home",
      submit: "Submit",
      reset: "Reset",
      add: "Add",
      delete: "Delete",
      edit: "Edit",
      show: "Show",
      cancel: "Cancel",
      updated: "Updated",
      filters: "Filters",
      filter: "Filter",
      actions: "Actions",
      id: "Id",
      itemCreated: "{0} created",
      itemUpdated: "{0} updated",
      itemDeleted: "{0} deleted",
      itemDeletedByAnotherUser: "{0} deleted by another user",
      field: "Field",
      value: "Value",
      itemNotFound: "No item found. Please reload",
      confirmDelete: "Are you sure you want to delete this item?",
      loading: "Loading...",
    };
  }
}
