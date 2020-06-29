import chalk from "chalk";
import { sprintf } from "sprintf-js";
import BaseVueGenerator from "./VueBaseGenerator";

export default class extends BaseVueGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`nuxt/`, [
      // components
      "components/ActionCell.vue",
      "components/Alert.vue",
      "components/ConfirmDelete.vue",
      "components/DataFilter.vue",
      "components/InputDate.vue",
      "components/Loading.vue",
      "components/Toolbar.vue",
      "components/foo/Filter.vue",
      "components/foo/Form.vue",

      // pages
      "pages/foo/new.vue",
      "pages/foo/index.vue",
      "pages/foo/_id.vue",

      // store
      "store/crud.js",
      "store/foo.js"
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
// Register the modules in the store
// src/store/index.js
import ${titleLc}Service from '../services/${titleLc}';
import makeCrudModule from './store/modules/crud';

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
    const context = super.getContextForResource(resource, params);
    const lc = context.lc;

    [
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/mixins`,
      `${dir}/utils`,
      `${dir}/validators`
    ].forEach(dir => this.createDir(dir, false));

    // error
    this.createFile(
      "error/SubmissionError.js",
      `${dir}/error/SubmissionError.js`,
      {},
      false
    );

    // mixins
    [
      "mixins/Create%s.js",
      "mixins/List%s.js",
      "mixins/Notification%s.js",
      "mixins/Show%s.js",
      "mixins/Update%s.js"
    ].forEach(pattern =>
      this.createFile(
        sprintf(`${pattern}`, "Mixin"),
        sprintf(`${dir}/${pattern}`, "Mixin"),
        {},
        false
      )
    );

    // stores
    this.createFile(
      `store/modules/notifications.js`,
      `${dir}/store/notifications.js`,
      { hydraPrefix: this.hydraPrefix },
      false
    );

    this.createFile(
      `store/crud.js`,
      `${dir}/store/crud.js`,
      { hydraPrefix: this.hydraPrefix },
      false
    );

    // validators
    this.createFile(
      "validators/date.js",
      `${dir}/validators/date.js`,
      { hydraPrefix: this.hydraPrefix },
      false
    );

    // utils
    ["dates.js", "fetch.js", "hydra.js"].forEach(file =>
      this.createFile(`utils/${file}`, `${dir}/utils/${file}`, {}, false)
    );

    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.js`);

    for (let dir of [`${dir}/components/${lc}`, `${dir}/pages/${lc}`]) {
      this.createDir(dir);
    }

    [
      // components
      "components/%s/Filter.vue",
      "components/%s/Form.vue",

      // pages
      "pages/%s/new.vue",
      "pages/%s/index.vue",
      "pages/%s/_id.vue",

      // service
      "services/%s.js",

      // store
      "store/%s.js"
    ].forEach(pattern => this.createFileFromPattern(pattern, dir, lc, context));

    // components
    [
      "ActionCell.vue",
      "Alert.vue",
      "ConfirmDelete.vue",
      "DataFilter.vue",
      "InputDate.vue",
      "Loading.vue",
      "Toolbar.vue"
    ].forEach(file =>
      this.createFile(
        `components/${file}`,
        `${dir}/components/${file}`,
        context,
        false
      )
    );
  }
}
