import chalk from "chalk";
import handlebars from "handlebars";
import BaseGenerator from "./BaseGenerator.js";
import hbhComparison from "handlebars-helpers/lib/comparison.js";

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    handlebars.registerHelper("ifNotResource", function (item, options) {
      if (item === null) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    this.registerTemplates(`react-native-v2/`, [
      "app/(tabs)/foos.tsx",
      "app/_layout.tsx.dist",
      "lib/hooks/data.ts",
      "lib/hooks/mercure.ts",
      "lib/hooks/modal.ts",
      "lib/hooks/notifications.ts",
      "lib/types/ApiResource.ts",
      "lib/types/HydraView.ts",
      "lib/types/HydraResponse.ts",
      "lib/types/foo.ts",
      "lib/utils/Logs.ts",
      "lib/utils/mercure.ts",
      "lib/utils/icons.tsx",
      "lib/api/fooApi.ts",
      "components/Main.tsx",
      "components/Navigation.tsx",
      "components/ConfirmModal.tsx",
      "components/foo/CreateEditModal.tsx",
      "components/foo/Form.tsx",
      "components/foo/LogsRenderer.tsx",
      "components/foo/Context.ts",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
  }

  help(resource) {
    const titleLc = resource.title.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );

    console.log(
      "You should replace app/_layout.tsx by the generated one and add the following route:"
    );
    console.log(
      chalk.green(`
            <Tabs.Screen
                name="(tabs)/${titleLc}s"
                options={options.tabs.${titleLc}}
            />

            tabs: {
                ...
                ${titleLc}: {
                    title: '${titleLc}',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                },
            }
            `)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst =
      resource.title.charAt(0).toUpperCase() + resource.title.slice(1);
    const fields = this.parseFields(resource);

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields,
      formFields: this.buildFields(fields),
      hydraPrefix: this.hydraPrefix,
      ucf: titleUcFirst,
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/app/(tabs)`,
      `${dir}/config`,
      `${dir}/components`,
      `${dir}/components/${lc}`,
      `${dir}/lib`,
      `${dir}/lib/api`,
      `${dir}/lib/types`,
      `${dir}/lib/hooks`,
      `${dir}/lib/utils`,
    ].forEach((dir) => this.createDir(dir, false));

    // static files
    [
      "lib/types/ApiResource.ts",
      "lib/types/HydraView.ts",
      "lib/types/HydraResponse.ts",
      "lib/hooks/data.ts",
      "lib/hooks/mercure.ts",
      "lib/hooks/modal.ts",
      "lib/hooks/notifications.ts",
      "lib/utils/Logs.ts",
      "lib/utils/mercure.ts",
      "lib/utils/icons.tsx",
      "components/Main.tsx",
      "components/Navigation.tsx",
      "components/ConfirmModal.tsx",
    ].forEach((file) => this.createFile(file, `${dir}/${file}`));

    // templated files ucFirst
    ["lib/types/%s.ts"].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, [titleUcFirst], context)
    );

    // templated files lc
    [
      "app/(tabs)/%ss.tsx",
      "app/_layout.tsx.dist",
      "lib/api/%sApi.ts",
      "components/%s/Context.ts",
      "components/%s/CreateEditModal.tsx",
      "components/%s/Form.tsx",
      "components/%s/LogsRenderer.tsx",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, dir, [lc], context)
    );

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

      const isReferences = Boolean(
        field.reference && field.maxCardinality !== 1
      );
      const isEmbeddeds = Boolean(field.embedded && field.maxCardinality !== 1);

      return {
        ...list,
        [field.name]: {
          ...field,
          type: this.getType(field),
          description: this.getDescription(field),
          readonly: false,
          isReferences,
          isEmbeddeds,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    return Object.values(fields);
  }
}
