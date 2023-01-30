import chalk from "chalk";
import handlebars from "handlebars";
import hbh_comparison from "handlebars-helpers/lib/comparison.js";
import hbh_string from "handlebars-helpers/lib/string.js";
import BaseGenerator from "./BaseGenerator.js";

export default class extends BaseGenerator {
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
      "router/foo.ts",

      // store
      "store/foo/create.ts",
      "store/foo/delete.ts",
      "store/foo/list.ts",
      "store/foo/show.ts",
      "store/foo/update.ts",

      // types
      "types/breadcrumb.ts",
      "types/list.ts",

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
// Import routes in src/router/index.ts
import ${titleLc}Routes from './${titleLc}';

const routes = [
  // ...
  ...${titleLc}Routes,
];

// import translations in src/locales/en-US/index.ts
import ${titleLc} from './${titleLc}';

export default {
  // ...
  ${titleLc},
}
`)
    );
  }

  generate(api, resource, dir) {
    return resource.getParameters().then((params) => {
      params = params.map((param) => ({
        ...param,
        ...this.getHtmlInputTypeFromField(param),
      }));

      params = this.cleanupParams(params);

      this.generateFiles(api, resource, dir, params);
    });
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

  getContextForResource(resource, params) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);
    const fields = this.parseFields(resource);
    const formFields = this.buildFields(fields);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasDateField = fields.some((field) => field.type === "dateTime");

    const parameters = [];
    params.forEach((p) => {
      const paramIndex = fields.findIndex((field) => field.name === p.variable);
      if (paramIndex === -1) {
        if (p.variable.startsWith("order[")) {
          let v = p.variable.slice(6, -1);
          let found = fields.findIndex((field) => field.name === v);
          if (found !== -1) {
            fields[found].sortable = true;
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

    return {
      title: resource.title,
      titleUcFirst,
      name: resource.name,
      lc,
      fields,
      formFields,
      hasIsRelations,
      hasDateField,
      parameters,
      hydraPrefix: this.hydraPrefix,
      labels,
    };
  }

  generateFiles(api, resource, dir, params) {
    const context = this.getContextForResource(resource, params);
    const { lc, titleUcFirst, labels, formFields, fields } = context;

    // Create directories
    // These directories may already exist
    [
      `${dir}/components/${lc}`,
      `${dir}/components/common`,
      `${dir}/composables`,
      `${dir}/locales`,
      `${dir}/locales/en-US`,
      `${dir}/plugins`,
      `${dir}/router`,
      `${dir}/store/${lc}`,
      `${dir}/types`,
      `${dir}/utils`,
      `${dir}/views/${lc}`,
    ].forEach((dir) => this.createDir(dir, false));

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
    ].forEach((common) =>
      this.createFile(common, `${dir}/${common}`, context, false)
    );

    [
      // components
      "components/%s/%sCreate.vue",
      "components/%s/%sFilter.vue",
      "components/%s/%sForm.vue",
      "components/%s/%sList.vue",
      "components/%s/%sShow.vue",
      "components/%s/%sUpdate.vue",

      // routes
      "router/%s.ts",

      // store
      "store/%s/create.ts",
      "store/%s/delete.ts",
      "store/%s/list.ts",
      "store/%s/show.ts",
      "store/%s/update.ts",

      // views
      "views/%s/ViewCreate.vue",
      "views/%s/ViewList.vue",
      "views/%s/ViewShow.vue",
      "views/%s/ViewUpdate.vue",

      // types
      "types/%s.ts",
    ].forEach((pattern) => {
      if (
        pattern === "components/%s/%sFilter.vue" &&
        !context.parameters.length
      ) {
        return;
      }
      this.createFileFromPattern(pattern, dir, [lc, titleUcFirst], context);
    });

    // config
    this.createConfigFile(`${dir}/utils/config.ts`, {
      entrypoint: api.entrypoint,
    });

    this.createFile(
      "locales/en-US/index.ts",
      `${dir}/locales/en-US/index.ts`,
      { labels },
      false
    );

    const contextLabels = {
      labels: this.contextLabelTexts(formFields, fields),
    };

    this.createFile(
      "locales/en-US/foo.ts",
      `${dir}/locales/en-US/${lc}.ts`,
      contextLabels,
      false
    );
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

  contextLabelTexts(formFields, fields) {
    let texts = [];
    formFields.forEach((x) => texts.push(x.name)); // forms
    fields.forEach((x) => texts.push(x.name)); // for show, too
    return [...new Set(texts)];
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
