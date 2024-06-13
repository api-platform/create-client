import pc from "picocolors";

import handlebars from "handlebars";
import { BaseGenerator } from "./BaseGenerator";
import type { Api, Field, Resource } from "@api-platform/api-doc-parser";
import type { GeneratorParams } from "../types";

export class ReactNativeGenerator extends BaseGenerator {
  constructor(params: GeneratorParams) {
    super(params);

    handlebars.registerHelper("ifNotResource", function (item, options) {
      if (item === null) {
        // @ts-expect-error Handlebars helper
        return options.fn(this);
      }
      // @ts-expect-error Handlebars helper
      return options.inverse(this);
    });

    this.registerTemplates("common/", [
      // utils
      "utils/mercure.js",
    ]);

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

  help(resource: Resource) {
    const titleLc = resource.title?.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );
    console.log(
      "Paste the following definitions in your application configuration (`client/src/index.js` by default):"
    );
    console.log(
      pc.green(`
// import reducers
import ${titleLc} from './reducers/${titleLc}/';

// Add the reducer
combineReducers({ ${titleLc}, /* ... */ }),
`)
    );
  }

  buildFields(fields: Field[]) {
    return fields.map((field) => ({
      ...field,
      ...this.getHtmlInputTypeFromField(field),
      description: this.getDescription(field),
    }));
  }

  async generate(api: Api, resource: Resource, dir: string) {
    if (!resource.title) {
      console.error(`No title found for resource ${resource.name}`);
      return undefined;
    }

    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields: resource.readableFields ?? [],
      formFields: this.buildFields(resource.writableFields ?? []),
      hydraPrefix: this.hydraPrefix,
      titleUcFirst,
    };

    await Promise.all(
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
      ].map((pattern) =>
        this.createFileFromPattern(pattern, dir, [lc], context)
      )
    );

    await Promise.all(
      [
        "utils/dataAccess.js",
        "utils/mercure.js",
        "utils/helpers.js",
        "components/Spinner.js",
        "components/Confirm.js",
      ].map((file) => this.createFile(file, `${dir}/${file}`))
    );

    return this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.js`);
  }
}
