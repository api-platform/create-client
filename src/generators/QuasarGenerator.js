import chalk from "chalk";
import BaseGenerator from "./BaseGenerator";
import handlebars from "handlebars";
import hbh_comparison from "handlebars-helpers/lib/comparison";
import hbh_array from "handlebars-helpers/lib/array";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`quasar/`, [
      // modules
      "store/modules/foo/index.js",
      "store/modules/foo/create/actions.js",
      "store/modules/foo/create/getters.js",
      "store/modules/foo/create/index.js",
      "store/modules/foo/create/mutation_types.js",
      "store/modules/foo/create/mutations.js",
      "store/modules/foo/create/state.js",
      "store/modules/foo/delete/actions.js",
      "store/modules/foo/delete/getters.js",
      "store/modules/foo/delete/index.js",
      "store/modules/foo/delete/mutation_types.js",
      "store/modules/foo/delete/mutations.js",
      "store/modules/foo/delete/state.js",
      "store/modules/foo/list/actions.js",
      "store/modules/foo/list/getters.js",
      "store/modules/foo/list/index.js",
      "store/modules/foo/list/mutation_types.js",
      "store/modules/foo/list/mutations.js",
      "store/modules/foo/list/state.js",
      "store/modules/foo/show/actions.js",
      "store/modules/foo/show/getters.js",
      "store/modules/foo/show/index.js",
      "store/modules/foo/show/mutation_types.js",
      "store/modules/foo/show/mutations.js",
      "store/modules/foo/show/state.js",
      "store/modules/foo/update/actions.js",
      "store/modules/foo/update/getters.js",
      "store/modules/foo/update/index.js",
      "store/modules/foo/update/mutation_types.js",
      "store/modules/foo/update/mutations.js",
      "store/modules/foo/update/state.js",

      // components
      "components/foo/Create.vue",
      "components/foo/Filter.vue",
      "components/foo/Form.vue",
      "components/foo/List.vue",
      "components/foo/Update.vue",
      "components/foo/Show.vue",

      // routes
      "router/foo.js",

      // error
      "error/SubmissionError.js",

      // utils
      "utils/fetch.js"
    ]);

    handlebars.registerHelper("compare", hbh_comparison.compare);
    handlebars.registerHelper("ifEven", hbh_comparison.ifEven);
    handlebars.registerHelper("ifOdd", hbh_comparison.ifOdd);
    handlebars.registerHelper("forEach", hbh_array.forEach);
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
//Add to quasar.conf
// 1. in 'framework.components'
  'QTable',
  'QTh',
  'QTr',
  'QTd',
  'QAjaxBar',
  'QBreadcrumbs',
  'QBreadcrumbsEl',
  'QSpace',
  'QInput',
  'QForm',
  'QSelect',
  'QMarkupTable',
  'QDate',
  'QTime',
  'QCheckbox',
  'QPopupProxy',

// 2. in 'framework.config', customize later
notify: {
  position: 'top',
  multiLine: true,
  timeout: 0,
},

// 3. in 'framework.directives
  'ClosePopup'

// 4. in 'framework.plugins
  'Notify'

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
    return resource.getParameters().then(params => {
      params = params.map(param => ({
        ...param,
        ...this.getHtmlInputTypeFromField(param)
      }));
      this.generateFiles(api, resource, dir, params);
    });
  }

  generateFiles(api, resource, dir, parameters) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

    const formFields = this.buildFields(resource.writableFields);

    const dateTypes = ["time", "date", "dateTime"];
    const containsDate = formFields.some(e => dateTypes.includes(e.type));

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields: resource.readableFields,
      parameters,
      formFields,
      containsDate,
      hydraPrefix: this.hydraPrefix,
      titleUcFirst
    };

    // Create directories
    // These directories may already exist
    for (let dir of [
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/router`,
      `${dir}/utils`
    ]) {
      this.createDir(dir, false);
    }

    for (let dir of [
      `${dir}/store/modules/${lc}`,
      `${dir}/store/modules/${lc}/create`,
      `${dir}/store/modules/${lc}/delete`,
      `${dir}/store/modules/${lc}/list`,
      `${dir}/store/modules/${lc}/show`,
      `${dir}/store/modules/${lc}/update`,
      `${dir}/components/${lc}`
    ]) {
      this.createDir(dir);
    }

    for (let pattern of [
      // modules
      "store/modules/%s/index.js",
      "store/modules/%s/create/actions.js",
      "store/modules/%s/create/getters.js",
      "store/modules/%s/create/index.js",
      "store/modules/%s/create/mutation_types.js",
      "store/modules/%s/create/mutations.js",
      "store/modules/%s/create/state.js",
      "store/modules/%s/delete/actions.js",
      "store/modules/%s/delete/getters.js",
      "store/modules/%s/delete/index.js",
      "store/modules/%s/delete/mutation_types.js",
      "store/modules/%s/delete/mutations.js",
      "store/modules/%s/delete/state.js",
      "store/modules/%s/list/actions.js",
      "store/modules/%s/list/getters.js",
      "store/modules/%s/list/index.js",
      "store/modules/%s/list/mutation_types.js",
      "store/modules/%s/list/mutations.js",
      "store/modules/%s/list/state.js",
      "store/modules/%s/show/actions.js",
      "store/modules/%s/show/getters.js",
      "store/modules/%s/show/index.js",
      "store/modules/%s/show/mutation_types.js",
      "store/modules/%s/show/mutations.js",
      "store/modules/%s/show/state.js",
      "store/modules/%s/update/actions.js",
      "store/modules/%s/update/getters.js",
      "store/modules/%s/update/index.js",
      "store/modules/%s/update/mutation_types.js",
      "store/modules/%s/update/mutations.js",
      "store/modules/%s/update/state.js",

      // components
      "components/%s/Create.vue",
      "components/%s/Filter.vue",
      "components/%s/Form.vue",
      "components/%s/List.vue",
      "components/%s/Update.vue",
      "components/%s/Show.vue",

      // routes
      "router/%s.js"
    ]) {
      if (
        pattern === "components/%s/Filter.vue" &&
        !context.parameters.length
      ) {
        continue;
      }
      this.createFileFromPattern(pattern, dir, lc, context);
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
  }
}
