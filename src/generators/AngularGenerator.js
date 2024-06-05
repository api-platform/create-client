import BaseGenerator from "./BaseGenerator.js";
import handlebars from "handlebars";
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import hbhString from "handlebars-helpers/lib/string.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("angular/", [
      // COMMON COMPONENTS
      "app/components/common/delete/delete.component.html",
      "app/components/common/delete/delete.component.ts",
      "app/components/common/form/form.component.html",
      "app/components/common/form/form.component.ts",
      "app/components/common/header/header.component.html",
      "app/components/common/header/header.component.ts",
      "app/components/common/sidebar/sidebar.component.html",
      "app/components/common/sidebar/sidebar.component.ts",
      "app/components/common/table/table.component.html",
      "app/components/common/table/table.component.ts",

      // COMPONENTS
      "app/components/foo/create/create.component.html",
      "app/components/foo/create/create.component.ts",
      "app/components/foo/edit/edit.component.html",
      "app/components/foo/edit/edit.component.ts",
      "app/components/foo/list/list.component.html",
      "app/components/foo/list/list.component.ts",
      "app/components/foo/show/show.component.html",
      "app/components/foo/show/show.component.ts",
      "app/app.component.html",
      "app/app.component.ts",

      //SVG COMPONENT
      "app/components/svg/list-svg/list-svg.component.svg",
      "app/components/svg/list-svg/list-svg.component.ts",
      "app/components/svg/menu/menu.component.svg",
      "app/components/svg/menu/menu.component.ts",

      //INTERFACE
      "app/interface/api.ts",
      "app/interface/foo.model.ts",
      "app/interface/hero.model.ts",
      "app/interface/list.model.ts",
      "app/interface/show.model.ts",
      "app/interface/update.model.ts",

      // ROUTER
      "app/router/foo.ts",
      "app/app.routes.ts",

      //SERVICE
      "app/service/hero.service.ts",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
    handlebars.registerHelper("lowercase", hbhString.lowercase);
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);
    const fields = this.parseFields(resource);
    const hasIsRelation = fields.some((field) => field.isRelation);
    const hasIsRelations = fields.some((field) => field.isRelations);
    const hasDateField = fields.some((field) => field.type === "dateTime");

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields,
      formFields: this.buildFields(fields),
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
      hasIsRelation,
      hasIsRelations,
      hasRelations: hasIsRelation || hasIsRelations,
      hasDateField,
    };

    //CREATE DIRECTORIES - These directories may already exist
    [
      `${dir}/assets`,
      `${dir}/utils`,
      `${dir}/app/components/${lc}`,
      `${dir}/app/components/common`,
      `${dir}/app/components/svg`,
      `${dir}/app/interface`,
      `${dir}/app/router`,
      `${dir}/app/service`,
    ].forEach((dir) => this.createDir(dir, false));

    //CREATE FILE
    [
      `${dir}/app/components/svg/list-svg/list-svg.component.svg`,
      `${dir}/app/components/svg/list-svg/list-svg.component.ts`,
      `${dir}/app/components/svg/menu/menu.component.svg`,
      `${dir}/app/components/svg/menu/menu.component.ts`,
      `${dir}/app/components/common/delete/delete.component.html`,
      `${dir}/app/components/common/delete/delete.component.ts`,
      `${dir}/app/components/common/form/form.component.html`,
      `${dir}/app/components/common/form/form.component.ts`,
      `${dir}/app/components/common/header/header.component.html`,
      `${dir}/app/components/common/header/header.component.ts`,
      `${dir}/app/components/common/sidebar/sidebar.component.html`,
      `${dir}/app/components/common/sidebar/sidebar.component.ts`,
      `${dir}/app/components/common/table/table.component.html`,
      `${dir}/app/app.component.html`,
      `${dir}/app/app.component.ts`,
      `${dir}/app/app.routes.ts`,
    ].forEach((file) => this.createFile(file, file, context, false));

    [
      `app/components/%s/create/create.component.html",
      "app/components/%s/create/create.component.ts",
      "app/components/%s/edit/edit.component.html",
      "app/components/%s/edit/edit.component.ts",
      "app/components/%s/list/list.component.html",
      "app/components/%s/list/list.component.ts",
      "app/components/%s/show/show.component.html",
      "app/components/%s/show/show.component.ts",`,
    ].forEach((file) => this.createFileFromPattern(file, dir, [lc], context));
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
}
