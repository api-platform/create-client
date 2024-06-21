import BaseGenerator from "./BaseGenerator.js";
import handlebars from "handlebars";
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import hbhString from "handlebars-helpers/lib/string.js";
import chalk from "chalk";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("common/", [
      // utils
      "utils/config.ts",
      "utils/date.ts",
    ]);

    this.registerTemplates("angular/", [
      // COMMON COMPONENTS
      "app/components/common/delete/delete.component.html",
      "app/components/common/delete/delete.component.ts",
      "app/components/common/header/header.component.css",
      "app/components/common/header/header.component.html",
      "app/components/common/header/header.component.ts",
      "app/components/common/layout/layout.component.html",
      "app/components/common/layout/layout.component.ts",
      "app/components/common/sidebar/sidebar.component.css",
      "app/components/common/sidebar/sidebar.component.html",
      "app/components/common/sidebar/sidebar.component.ts",
      "app/components/common/svg/list-svg/list-svg.component.svg",
      "app/components/common/svg/list-svg/list-svg.component.ts",
      "app/components/common/svg/show-svg/show-svg.component.svg",
      "app/components/common/svg/show-svg/show-svg.component.ts",
      "app/components/common/svg/edit-svg/edit-svg.component.svg",
      "app/components/common/svg/edit-svg/edit-svg.component.ts",
      "app/components/common/svg/menu/menu.component.svg",
      "app/components/common/svg/menu/menu.component.ts",

      // COMPONENTS
      "app/components/foo/create/create.component.html",
      "app/components/foo/create/create.component.ts",
      "app/components/foo/edit/edit.component.html",
      "app/components/foo/edit/edit.component.ts",
      "app/components/foo/form/form.component.html",
      "app/components/foo/form/form.component.ts",
      "app/components/foo/list/list.component.html",
      "app/components/foo/list/list.component.ts",
      "app/components/foo/show/show.component.html",
      "app/components/foo/show/show.component.ts",
      "app/components/foo/table/table.component.html",
      "app/components/foo/table/table.component.ts",
      "app/app.component.html",
      "app/app.component.ts",

      //INTERFACE
      "app/interface/api.ts",

      // ROUTER
      "app/router/foo.ts",
      "app/router/index.ts",
      "app/app.routes.ts",

      //SERVICE
      "app/service/api.service.ts",
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
      "Paste the following definitions in your application configuration (`client/src/index.js` by default):"
    );
    console.log(
      chalk.green(`
      // import reducers
      import ${titleLc} from './reducers/${titleLc}/';

      // Add the reducer
      combineReducers({ ${titleLc}, /* ... */ }),
      `)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);
    const fields = this.parseFields(resource);
    const hasIsRelation = fields.some((field) => field.isRelation);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasDateField = fields.some((field) => field.type === "dateTime");
    const formFields = this.buildFields(fields);

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields,
      formFields,
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
      hasIsRelation,
      hasIsRelations,
      hasRelations: hasIsRelation || hasIsRelations,
      hasDateField,
      apiResource: this.apiResource(api),
    };

    //CREATE DIRECTORIES - These directories may already exist
    [
      `${dir}/app/components/${lc}/create`,
      `${dir}/app/components/${lc}/edit`,
      `${dir}/app/components/${lc}/form`,
      `${dir}/app/components/${lc}/list`,
      `${dir}/app/components/${lc}/show`,
      `${dir}/app/components/${lc}/table`,
      `${dir}/app/components/common/delete`,
      `${dir}/app/components/common/header`,
      `${dir}/app/components/common/sidebar`,
      `${dir}/app/components/common/svg/list-svg`,
      `${dir}/app/components/common/svg/show-svg`,
      `${dir}/app/components/common/svg/edit-svg`,
      `${dir}/app/components/common/svg/menu`,
      `${dir}/app/interface`,
      `${dir}/app/router`,
      `${dir}/app/service`,
      `${dir}/app/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    //CREATE FILE
    [
      "app/components/common/svg/list-svg/list-svg.component.svg",
      "app/components/common/svg/list-svg/list-svg.component.ts",
      "app/components/common/svg/show-svg/show-svg.component.svg",
      "app/components/common/svg/show-svg/show-svg.component.ts",
      "app/components/common/svg/edit-svg/edit-svg.component.svg",
      "app/components/common/svg/edit-svg/edit-svg.component.ts",
      "app/components/common/svg/menu/menu.component.svg",
      "app/components/common/svg/menu/menu.component.ts",
      "app/components/common/delete/delete.component.html",
      "app/components/common/delete/delete.component.ts",
      "app/components/common/header/header.component.css",
      "app/components/common/header/header.component.html",
      "app/components/common/header/header.component.ts",
      "app/components/common/sidebar/sidebar.component.css",
      "app/components/common/sidebar/sidebar.component.html",
      "app/components/common/sidebar/sidebar.component.ts",
      "app/interface/api.ts",
      "app/service/api.service.ts",
      "app/app.component.html",
      "app/app.component.ts",
      "app/app.routes.ts",
    ].forEach((file) =>
      this.createFile(file, `${dir}/${file}`, context, false)
    );

    // DYNAMIC FILE
    [
      "app/router/%s.ts",
      "app/components/%s/list/list.component.html",
      "app/components/%s/list/list.component.ts",
      "app/components/%s/create/create.component.html",
      "app/components/%s/create/create.component.ts",
      "app/components/%s/edit/edit.component.html",
      "app/components/%s/edit/edit.component.ts",
      "app/components/%s/form/form.component.html",
      "app/components/%s/form/form.component.ts",
      "app/components/%s/show/show.component.html",
      "app/components/%s/show/show.component.ts",
      "app/components/%s/show/show.component.html",
      "app/components/%s/table/table.component.html",
      "app/components/%s/table/table.component.ts",
    ].forEach((file) =>
      this.createFileFromPattern(file, dir, [lc, formFields], context)
    );

    // CONFIG
    this.createConfigFile(`${dir}/app/utils/config.ts`, {
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
          isRelation: field.reference || field.embedded,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    return Object.values(fields);
  }

  apiResource(api) {
    return api.resources
      .filter((val) => !val.deprecated)
      .map((val) => val.title);
  }
}
