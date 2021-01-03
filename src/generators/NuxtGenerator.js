import chalk from "chalk";
import BaseVueGenerator from "./VueBaseGenerator";

export default class NuxtGenerator extends BaseVueGenerator {
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

      // mixins
      "mixins/create.js",
      "mixins/list.js",
      "mixins/notification.js",
      "mixins/show.js",
      "mixins/update.js",

      // pages
      "pages/foos/new.vue",
      "pages/foos/index.vue",
      "pages/foos/_id.vue",

      // store
      "store/crud.js",
      "store/notifications.js",
      "store/foo.js",
    ]);
  }

  help(resource) {
    console.log(
      chalk.green('Code for the "%s" resource type has been generated!'),
      resource.title
    );
  }

  generateFiles(api, resource, dir, params) {
    const context = super.getContextForResource(resource, params);
    const lc = context.lc;

    [
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/mixins`,
      `${dir}/services`,
      `${dir}/store`,
      `${dir}/utils`,
      `${dir}/validators`,
    ].forEach((dir) => this.createDir(dir, false));

    // error
    this.createFile(
      "error/SubmissionError.js",
      `${dir}/error/SubmissionError.js`,
      {},
      false
    );

    // mixins
    [
      "mixins/create.js",
      "mixins/list.js",
      "mixins/notification.js",
      "mixins/show.js",
      "mixins/update.js",
    ].forEach((file) =>
      this.createFile(file, `${dir}/${file}`, context, false)
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
    ["dates.js", "fetch.js", "hydra.js"].forEach((file) =>
      this.createFile(`utils/${file}`, `${dir}/utils/${file}`, {}, false)
    );

    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.js`);

    for (let dir of [`${dir}/components/${lc}`, `${dir}/pages/${lc}s`]) {
      this.createDir(dir);
    }

    this.createFile("services/api.js", `${dir}/services/api.js`, {}, false);

    [
      // components
      "components/%s/Filter.vue",
      "components/%s/Form.vue",

      // pages
      "pages/%ss/new.vue",
      "pages/%ss/index.vue",
      "pages/%ss/_id.vue",

      // service
      "services/%s.js",

      // store
      "store/%s.js",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, lc, context)
    );

    // components
    [
      "ActionCell.vue",
      "Alert.vue",
      "ConfirmDelete.vue",
      "DataFilter.vue",
      "InputDate.vue",
      "Loading.vue",
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
