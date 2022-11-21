import chalk from "chalk";
import handlebars from "handlebars";
import hbh_comparison from "handlebars-helpers/lib/comparison.js";
import hbh_string from "handlebars-helpers/lib/string.js";
import BaseGenerator from "./BaseGenerator.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("common/", [
      // utils
      "utils/mercure.ts",
    ]);

    this.registerTemplates(`quasar/`, [
      // common components
      "components/common/ActionCellComponent.vue",
      "components/common/BreadcrumbComponent.vue",
      "components/common/ConfirmDeleteComponent.vue",
      "components/common/DataFilterComponent.vue",
      "components/common/FormRepeaterComponent.vue",
      "components/common/LoadingComponent.vue",
      "components/common/ToolbarComponent.vue",

      // components
      "components/foo/CreateComponent.vue",
      "components/foo/FilterComponent.vue",
      "components/foo/FormComponent.vue",
      "components/foo/ListComponent.vue",
      "components/foo/ShowComponent.vue",
      "components/foo/UpdateComponent.vue",

      // composables
      "composables/breadcrumb.ts",
      "composables/errors.ts",
      "composables/mercureItem.ts",
      "composables/mercureList.ts",
      "composables/notifications.ts",

      // i18n
      "i18n/foo.ts",
      "i18n/common.ts",

      // pages
      "pages/foo/CreatePage.vue",
      "pages/foo/ListPage.vue",
      "pages/foo/ShowPage.vue",
      "pages/foo/UpdatePage.vue",

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
      "types/collection.ts",
      "types/error.ts",
      "types/foo.ts",
      "types/item.ts",
      "types/list.ts",
      "types/view.ts",

      // utils
      "utils/date.ts",
      "utils/fetch.ts",
    ]);

    handlebars.registerHelper("compare", hbh_comparison.compare);
    handlebars.registerHelper("lowercase", hbh_string.lowercase);
    handlebars.registerHelper("capitalize", hbh_string.capitalize);
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
// Add to quasar.conf
// 1. in 'framework.config', can be customized later
notify: {
  position: 'top',
  multiLine: true,
  timeout: 0,
},

// 2. in 'framework.plugins
  'Notify'

// Import routes in src/router/routes.ts
import ${titleLc}Routes from './${titleLc}';

const routes: RouteRecordRaw[] = [
  // ...
  ...${titleLc}Routes,
];

// import translations in src/i18n/en-US/index.ts
import common from './common';
import ${titleLc} from './${titleLc}';

export default {
  // ...
  ...common,
  ${titleLc},
}
`)
    );
  }

  generate(api, resource, dir) {
    return resource
      .getParameters()
      .then((params) => {
        params = params.map((param) => ({
          ...param,
          ...this.getHtmlInputTypeFromField(param),
        }));

        params = this.cleanupParams(params);
        this.generateFiles(api, resource, dir, params);
      })
      .catch((e) => console.log(chalk.red(e)));
  }

  cleanupParams(params) {
    const stats = {};
    const result = [];
    params.forEach((p) => {
      let key = p.variable.endsWith("[]")
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

  generateFiles(api, resource, dir, params) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

    const { fields } = this.parseFields(resource);
    const formFields = this.buildFields(fields);
    const hasRelations = fields.some(
      (field) => field.reference || field.embedded
    );
    const hasManyRelations = fields.some(
      (field) => field.isReferences || field.isEmbeddeds
    );
    const hasDateField = fields.some((field) => field.type === "dateTime");

    const parameters = [];
    params.forEach((p) => {
      const paramIndex = fields.findIndex((field) => field.name === p.variable);
      if (paramIndex === -1) {
        if (p.variable.startsWith("order[")) {
          var v = p.variable.slice(6, -1);
          var found = fields.findIndex((field) => field.name === v);
          if (found !== -1) {
            fields[found].sortable = true;
          }
          return;
        }

        if (p.variable.startsWith("exists[")) {
          var exists = p.variable.slice(7, -1);
          var foundExistsFieldIndex = fields.findIndex(
            (field) => field.name === exists
          );
          if (foundExistsFieldIndex !== -1) {
            const param = fields[foundExistsFieldIndex];
            param.variable = p.variable;
            param.filterType = "exists";
            parameters.push(param);
          } else {
            p.name = exists;
            p.filterType = "exists";
            parameters.push(p);
          }
          return;
        }
      } else {
        const param = fields[paramIndex];
        param.multiple = p.multiple;
        parameters.push(param);
      }
    });

    const labels = this.commonLabelTexts();

    const context = {
      name: resource.name,
      lc,
      fields,
      hasRelations,
      hasManyRelations,
      hasDateField,
      parameters,
      formFields,
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
      labels,
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/components/common`,
      `${dir}/composables`,
      `${dir}/config`,
      `${dir}/types`,
      `${dir}/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    [
      `${dir}/components/${lc}`,
      `${dir}/pages/${lc}`,
      `${dir}/stores/${lc}`,
    ].forEach((dir) => this.createDir(dir));

    [
      // common components
      "components/common/ActionCellComponent.vue",
      "components/common/BreadcrumbComponent.vue",
      "components/common/ConfirmDeleteComponent.vue",
      "components/common/DataFilterComponent.vue",
      "components/common/FormRepeaterComponent.vue",
      "components/common/LoadingComponent.vue",
      "components/common/ToolbarComponent.vue",

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
      "utils/date.ts",
      "utils/fetch.ts",
      "utils/mercure.ts",
    ].forEach((common) =>
      this.createFile(common, `${dir}/${common}`, context, false)
    );

    [
      // components
      "components/%s/CreateComponent.vue",
      "components/%s/FilterComponent.vue",
      "components/%s/FormComponent.vue",
      "components/%s/ListComponent.vue",
      "components/%s/ShowComponent.vue",
      "components/%s/UpdateComponent.vue",

      // pages
      "pages/%s/CreatePage.vue",
      "pages/%s/ListPage.vue",
      "pages/%s/ShowPage.vue",
      "pages/%s/UpdatePage.vue",

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
    ].forEach((pattern) => {
      if (
        pattern === "components/%s/FilterComponent.vue" &&
        !context.parameters.length
      ) {
        return;
      }
      this.createFileFromPattern(pattern, dir, lc, context);
    });

    // entrypoint
    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);

    this.createFile(
      "i18n/common.ts",
      `${dir}/i18n/en-US/common.ts`,
      { labels },
      false
    );

    const contextLabels = {
      labels: this.contextLabelTexts(formFields, fields),
    };

    this.createFile(
      "i18n/foo.ts",
      `${dir}/i18n/en-US/${lc}.ts`,
      contextLabels,
      false
    );
  }

  contextLabelTexts(formFields, fields) {
    let texts = [];
    formFields.forEach((x) => texts.push(x.name)); // forms
    fields.forEach((x) => texts.push(x.name)); // for show, too
    return [...new Set(texts)];
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

    const fieldsArray = Object.values(fields);

    return { fields: fieldsArray };
  }
}
