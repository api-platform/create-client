import pc from "picocolors";
import handlebars from "handlebars";
// @ts-expect-error Old lib that is not typed
import hbh_comparison from "handlebars-helpers/lib/comparison.js";
// @ts-expect-error Old lib that is not typed
import hbh_string from "handlebars-helpers/lib/string.js";
import { BaseGenerator } from "./BaseGenerator";
import type { Api, Resource } from "@api-platform/api-doc-parser";
import type { Context, GeneratorParams, ParamType } from "../types";

export class QuasarGenerator extends BaseGenerator {
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

    this.registerTemplates("quasar/", [
      // components
      "components/foo/FooCreate.vue",
      "components/foo/FooFilter.vue",
      "components/foo/FooForm.vue",
      "components/foo/FooList.vue",
      "components/foo/FooShow.vue",
      "components/foo/FooUpdate.vue",

      // common components
      "components/common/CommonActionCell.vue",
      "components/common/CommonBreadcrumb.vue",
      "components/common/CommonConfirmDelete.vue",
      "components/common/CommonDataFilter.vue",
      "components/common/CommonFormRepeater.vue",
      "components/common/CommonLoading.vue",
      "components/common/CommonToolbar.vue",

      // composables
      "composables/breadcrumb.ts",
      "composables/errors.ts",
      "composables/notifications.ts",

      // i18n
      "i18n/foo.ts",
      "i18n/common.ts",

      // pages
      "pages/foo/PageCreate.vue",
      "pages/foo/PageList.vue",
      "pages/foo/PageShow.vue",
      "pages/foo/PageUpdate.vue",

      // router
      "router/foo.ts",

      // stores
      "stores/foo/create.ts",
      "stores/foo/delete.ts",
      "stores/foo/list.ts",
      "stores/foo/show.ts",
      "stores/foo/update.ts",

      // types
      "types/breadcrumb.ts",
      "types/list.ts",
    ]);

    handlebars.registerHelper("compare", hbh_comparison.compare);
    handlebars.registerHelper("lowercase", hbh_string.lowercase);
    handlebars.registerHelper("capitalize", hbh_string.capitalize);
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
// Import routes in src/router/routes.ts
import ${titleLc}Routes from './${titleLc}';

const routes: RouteRecordRaw[] = [
  // ...
  ...${titleLc}Routes,
];

// import translations in src/i18n/en-US/index.ts
import ${titleLc} from './${titleLc}';

export {
  // ...
  ${titleLc},
}
`)
    );
  }

  async generate(api: Api, resource: Resource, dir: string) {
    try {
      const parameters = (await resource?.getParameters?.()) ?? [];

      const parametersWithInputType = parameters.map((param) => ({
        ...param,
        ...this.getHtmlInputTypeFromField(param),
      }));

      const cleanedUpParams = this.cleanupParams(parametersWithInputType);
      return this.generateFiles(api, resource, dir, cleanedUpParams);
    } catch (error) {
      console.error(pc.red((error as Error).message));
    }
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
        result.push(p);
        return;
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

  async generateFiles(
    api: Api,
    resource: Resource,
    dir: string,
    params: ParamType[]
  ) {
    if (!resource.title) {
      console.error(`No title found for resource ${resource.name}`);
      return undefined;
    }

    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

    const fields = this.parseFields(resource);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasDateField = fields.some((field) => field.type === "dateTime");

    const parameters: (Partial<(typeof fields)[0]> & {
      multiple?: boolean;
      variable?: string;
      filterType?: string;
    })[] = [];

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

        if (p.variable.startsWith("exists[")) {
          const exists = p.variable.slice(7, -1);
          const foundExistsField = fields.find(
            (field) => field.name === exists
          );

          if (foundExistsField) {
            parameters.push({
              ...foundExistsField,
              variable: p.variable,
              filterType: "exists",
            });
          } else {
            parameters.push({ ...p, name: exists, filterType: "exists" });
          }
          return;
        }
      } else {
        parameters.push({ ...param, multiple: p.multiple });
      }
    });

    const labels = this.commonLabelTexts();

    const context = {
      name: resource.name,
      title: resource.title,
      lc,
      fields,
      hasIsRelations,
      hasDateField,
      parameters,
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
      labels,
    };

    await Promise.all(
      [
        // common components
        "components/common/CommonActionCell.vue",
        "components/common/CommonBreadcrumb.vue",
        "components/common/CommonConfirmDelete.vue",
        "components/common/CommonDataFilter.vue",
        "components/common/CommonFormRepeater.vue",
        "components/common/CommonLoading.vue",
        "components/common/CommonToolbar.vue",

        // composables
        "composables/breadcrumb.ts",
        "composables/errors.ts",
        "composables/mercureItem.ts",
        "composables/mercureList.ts",
        "composables/notifications.ts",

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

        // pages
        "pages/%s/PageCreate.vue",
        "pages/%s/PageList.vue",
        "pages/%s/PageShow.vue",
        "pages/%s/PageUpdate.vue",

        // routes
        "router/%s.ts",

        // stores
        "stores/%s/create.ts",
        "stores/%s/delete.ts",
        "stores/%s/list.ts",
        "stores/%s/show.ts",
        "stores/%s/update.ts",

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
      "i18n/common.ts",
      `${dir}/i18n/en-US/common.ts`,
      { labels },
      false
    );

    const contextLabels = {
      labels: this.getLabels(fields),
    };

    return this.createFile(
      "i18n/foo.ts",
      `${dir}/i18n/en-US/${lc}.ts`,
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
      submit: "Submit",
      reset: "Reset",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this item?",
      noresults: "No results",
      close: "Close",
      cancel: "Cancel",
      updated: "Updated",
      field: "Field",
      value: "Value",
      filters: "Filters",
      filter: "Filter",
      unavail: "Data unavailable",
      loading: "Loading...",
      deleted: "Deleted",
      numValidation: "Please, insert a value bigger than zero!",
      stringValidation: "Please type something",
      required: "Field is required",
      recPerPage: "Records per page:",
      id: "ID",
      actions: "Actions",
    };
  }
}
