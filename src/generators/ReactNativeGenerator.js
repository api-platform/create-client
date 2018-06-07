import chalk from "chalk";
import BaseGenerator from "./BaseGenerator";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`react-common/`, [
      // actions
      "actions/foo/create.js",
      "actions/foo/delete.js",
      "actions/foo/list.js",
      "actions/foo/update.js",
      "actions/foo/show.js",

      // utils
      "utils/fetch.js",

      // reducers
      "reducers/foo/create.js",
      "reducers/foo/delete.js",
      "reducers/foo/index.js",
      "reducers/foo/list.js",
      "reducers/foo/update.js",
      "reducers/foo/show.js"
    ]);

    this.registerTemplates(`react/`, [
      // components
      "components/foo/Create.js",
      "components/foo/Form.js",
      "components/foo/index.js",
      "components/foo/List.js",
      "components/foo/Update.js",
      "components/foo/Show.js"
    ]);
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
combineReducers(${titleLc},{/* ... */}),
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
      titleUcFirst
    };

    // Create directories
    // These directories may already exist
    for (let dir of [`${dir}/utils`, `${dir}/config`]) {
      this.createDir(dir, false);
    }

    for (let dir of [
      `${dir}/actions/${lc}`,
      `${dir}/components/${lc}`,
      `${dir}/reducers/${lc}`
    ]) {
      this.createDir(dir);
    }

    for (let pattern of [
      // actions
      "actions/%s/create.js",
      "actions/%s/delete.js",
      "actions/%s/list.js",
      "actions/%s/update.js",
      "actions/%s/show.js",

      // components
      "components/%s/Create.js",
      "components/%s/Form.js",
      "components/%s/index.js",
      "components/%s/List.js",
      "components/%s/Update.js",
      "components/%s/Show.js",

      // reducers
      "reducers/%s/create.js",
      "reducers/%s/delete.js",
      "reducers/%s/index.js",
      "reducers/%s/list.js",
      "reducers/%s/update.js",
      "reducers/%s/show.js"
    ]) {
      this.createFileFromPattern(pattern, dir, lc, context);
    }

    this.createFile("utils/fetch.js", `${dir}/utils/fetch.js`, context, false);
    this.createEntrypoint(api.entrypoint, `${dir}/config/_entrypoint.js`);
  }
}
