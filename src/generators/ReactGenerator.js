import chalk from "chalk";
import BaseGenerator from "./BaseGenerator.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("common/", [
      // utils
      "utils/mercure.js",
    ]);

    this.registerTemplates("react-common/", [
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

    this.registerTemplates(`react/`, [
      // components
      "components/foo/Create.js",
      "components/foo/Form.js",
      "components/foo/index.js",
      "components/foo/List.js",
      "components/foo/Update.js",
      "components/foo/Show.js",

      // routes
      "routes/foo.js",
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

//import routes
import ${titleLc}Routes from './routes/${titleLc}';

// Add the reducer
combineReducers({ ${titleLc},/* ... */ }),

// Add routes to <Switch>
{ ${titleLc}Routes }
`)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf,
      fields: this.parseFields(resource),
      formFields: this.buildFields(resource.writableFields),
      hydraPrefix: this.hydraPrefix,
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

    // utils
    this.createFile(
      "utils/dataAccess.js",
      `${dir}/utils/dataAccess.js`,
      context,
      false
    );
    this.createFile("utils/mercure.js", `${dir}/utils/mercure.js`);

    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.js`);
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : "";
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
          description: this.getDescription(field),
          readonly: false,
          isReferences,
          isEmbeddeds,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    return fields;
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
