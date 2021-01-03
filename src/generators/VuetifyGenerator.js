import chalk from "chalk";
import BaseVueGenerator from "./VueBaseGenerator";

export default class extends BaseVueGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`vuetify/`, [
      // components
      "components/ActionCell.vue",
      "components/Breadcrumb.vue",
      "components/ConfirmDelete.vue",
      "components/DataFilter.vue",
      "components/InputDate.vue",
      "components/Loading.vue",
      "components/Snackbar.vue",
      "components/Toolbar.vue",
      "components/foo/Filter.vue",
      "components/foo/Form.vue",
      "components/foo/Layout.vue",

      // locales
      "locales/en.js",

      // routes
      "router/foo.js",

      // views
      "views/foo/Create.vue",
      "views/foo/List.vue",
      "views/foo/Show.vue",
      "views/foo/Update.vue",
    ]);
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
// Register the routes in you router
// src/router/index.js
import ${titleLc}Routes from './${titleLc}';

// Add routes to VueRouter
export default new VueRouter({
  // ...
  routes: [
      ${titleLc}Routes,
  ]
});

// Register the modules in the store
// src/store/index.js
import ${titleLc}Service from '../services/${titleLc}';
import makeCrudModule from './modules/crud';

export const store = new Vuex.Store({
  // ...
  modules: {
    // other modules
    ${titleLc}: makeCrudModule({
      service: ${titleLc}Service
    })
  }
});
`)
    );
  }

  generateFiles(api, resource, dir, params) {
    super.generateFiles(api, resource, dir, params);

    const context = super.getContextForResource(resource, params);
    const lc = context.lc;

    // Create directories
    // These directories may already exist
    this.createDir(`${dir}/router`, false);
    this.createDir(`${dir}/locales`, false);

    for (let dir of [`${dir}/components/${lc}`, `${dir}/views/${lc}`]) {
      this.createDir(dir);
    }

    this.createFile("locales/en.js", `${dir}/locales/en.js`, context, false);

    [
      // components
      "components/%s/Filter.vue",
      "components/%s/Form.vue",
      "components/%s/Layout.vue",

      // routes
      "router/%s.js",

      // views
      "views/%s/Create.vue",
      "views/%s/List.vue",
      "views/%s/Show.vue",
      "views/%s/Update.vue",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, lc, context)
    );

    // components
    [
      "ActionCell.vue",
      "Breadcrumb.vue",
      "ConfirmDelete.vue",
      "DataFilter.vue",
      "InputDate.vue",
      "Loading.vue",
      "Snackbar.vue",
      "Toolbar.vue",
    ].forEach((file) =>
      this.createFile(
        `components/${file}`,
        `${dir}/components/${file}`,
        context,
        false
      )
    );
  }
}
