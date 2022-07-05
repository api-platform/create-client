import chalk from "chalk";
import handlebars from "handlebars";
import BaseGenerator from "./BaseGenerator.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    handlebars.registerHelper("ifNotResource", function (item, options) {
      if (item === null) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    this.registerTemplates(`react-common/`, [
      // actions
      "actions/foo/create.js",
      "actions/foo/delete.js",
      "actions/foo/list.js",
      "actions/foo/update.js",
      "actions/foo/show.js",

      // utils
      "utils/dataAccess.js",

      // reducers
      "reducers/foo/create.js",
      "reducers/foo/delete.js",
      "reducers/foo/index.js",
      "reducers/foo/list.js",
      "reducers/foo/update.js",
      "reducers/foo/show.js",
    ]);

    this.registerTemplates(`react-native/`, [
      // components
      "components/foo/Create.js",
      "components/foo/Form.js",
      "components/foo/index.js",
      "components/foo/List.js",
      "components/foo/Update.js",
      "components/foo/Show.js",
      "components/Spinner.js",
      "components/Confirm.js",

      // routes
      "routes/foo.js",

      // helpers
      "utils/helpers.js",
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
combineReducers({ ${titleLc}, /* ... */ }),
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
    [`${dir}/utils`, `${dir}/config`, `${dir}/routes`].forEach((dir) =>
      this.createDir(dir, false)
    );

    [
      `${dir}/actions/${lc}`,
      `${dir}/components/${lc}`,
      `${dir}/reducers/${lc}`,
    ].forEach((dir) => this.createDir(dir));

    [
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
      "reducers/%s/show.js",

      // routes
      "routes/%s.js",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, lc, context)
    );

    [
      "utils/dataAccess.js",
      "utils/helpers.js",
      "components/Spinner.js",
      "components/Confirm.js",
    ].forEach((file) => this.createFile(file, `${dir}/${file}`));

    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.js`);
  }
}
