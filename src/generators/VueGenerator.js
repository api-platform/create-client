import chalk from "chalk";
import BaseGenerator from "./BaseGenerator.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("common/", [
      // utils
      "utils/mercure.js",
    ]);

    this.registerTemplates(`vue/`, [
      // modules
      "store/index.js",
      "store/modules/foo/index.js",
      "store/modules/foo/create/actions.js",
      "store/modules/foo/create/index.js",
      "store/modules/foo/create/mutation_types.js",
      "store/modules/foo/create/mutations.js",
      "store/modules/foo/delete/actions.js",
      "store/modules/foo/delete/index.js",
      "store/modules/foo/delete/mutation_types.js",
      "store/modules/foo/delete/mutations.js",
      "store/modules/foo/list/actions.js",
      "store/modules/foo/list/index.js",
      "store/modules/foo/list/mutation_types.js",
      "store/modules/foo/list/mutations.js",
      "store/modules/foo/show/actions.js",
      "store/modules/foo/show/index.js",
      "store/modules/foo/show/mutation_types.js",
      "store/modules/foo/show/mutations.js",
      "store/modules/foo/update/actions.js",
      "store/modules/foo/update/index.js",
      "store/modules/foo/update/mutation_types.js",
      "store/modules/foo/update/mutations.js",

      // components
      "components/Sidebar.vue",

      // views
      "App.vue",
      "views/Home.vue",
      "views/apps/foo/Create.vue",
      "views/apps/foo/Form.vue",
      "views/apps/foo/List.vue",
      "views/apps/foo/Update.vue",
      "views/apps/foo/Show.vue",
      "views/Layout/DashboardLayout.vue",

      //internationalization plugin
      "libs/i18n/locales/fr.json",
      "libs/i18n/locales/en.json",
      "libs/i18n/index.js",

      // mixins
      "mixins/ItemWatcher.js",
      "mixins/ListWatcher.js",

      // routes
      "router/foo.js",
      "router/index.js",

      // error
      "error/SubmissionError.js",

      // utils
      "utils/fetch.js",
      "utils/hydra.js",

      // main
      "resourceMain.js",
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
//import routes
import ${titleLc}Routes from './router/${titleLc}';

// Add routes to VueRouter
const router = new VueRouter({
  // ...
  routes: [
      ...${titleLc}Routes,
  ]
});

// Add the modules in the store
import ${titleLc} from './store/modules/${titleLc}/';

export const store = new Vuex.Store({
  // ...
  modules: {
    ${titleLc}
  }
});
`)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields: resource.readableFields,
      formFields: this.buildFields(resource.writableFields),
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/mixins`,
      `${dir}/router`,
      `${dir}/utils`,
      `${dir}/views/Layout`,
      `${dir}/libs/i18n/locales`,
    ].forEach((dir) => this.createDir(dir, false));

    [
      `${dir}/store/modules/${lc}`,
      `${dir}/store/modules/${lc}/create`,
      `${dir}/store/modules/${lc}/delete`,
      `${dir}/store/modules/${lc}/list`,
      `${dir}/store/modules/${lc}/show`,
      `${dir}/store/modules/${lc}/update`,
      `${dir}/components/${lc}`,
      `${dir}/views/apps/${lc}`,
    ].forEach((dir) => this.createDir(dir));

    [
      // modules
      "store/modules/%s/index.js",
      "store/modules/%s/create/actions.js",
      "store/modules/%s/create/index.js",
      "store/modules/%s/create/mutation_types.js",
      "store/modules/%s/create/mutations.js",
      "store/modules/%s/delete/actions.js",
      "store/modules/%s/delete/index.js",
      "store/modules/%s/delete/mutation_types.js",
      "store/modules/%s/delete/mutations.js",
      "store/modules/%s/list/actions.js",
      "store/modules/%s/list/index.js",
      "store/modules/%s/list/mutation_types.js",
      "store/modules/%s/list/mutations.js",
      "store/modules/%s/show/actions.js",
      "store/modules/%s/show/index.js",
      "store/modules/%s/show/mutation_types.js",
      "store/modules/%s/show/mutations.js",
      "store/modules/%s/update/actions.js",
      "store/modules/%s/update/index.js",
      "store/modules/%s/update/mutation_types.js",
      "store/modules/%s/update/mutations.js",

      //views
      "views/apps/%s/Create.vue",
      "views/apps/%s/Form.vue",
      "views/apps/%s/List.vue",
      "views/apps/%s/Update.vue",
      "views/apps/%s/Show.vue",

      // routes
      "router/%s.js",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, lc, context)
    );

    for (const file of [
      "views/Layout/DashboardLayout.vue",
      "libs/i18n/locales/en.json",
      "libs/i18n/locales/fr.json",
      "libs/i18n/index.js",
      "mixins/ItemWatcher.js",
      "mixins/ListWatcher.js",
    ]) {
      this.createFile(file, `${dir}/${file}`, {}, false);
    }

    // error
    this.createFile(
      "error/SubmissionError.js",
      `${dir}/error/SubmissionError.js`,
      context,
      false
    );

    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.js`);
    this.createFile(
      "utils/fetch.js",
      `${dir}/utils/fetch.js`,
      { hydraPrefix: this.hydraPrefix },
      false
    );
    this.createFile(
      "utils/hydra.js",
      `${dir}/utils/hydra.js`,
      { hydraPrefix: this.hydraPrefix },
      false
    );
    this.createFile("utils/mercure.js", `${dir}/utils/mercure.js`);
  }
}
