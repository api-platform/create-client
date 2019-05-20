import chalk from "chalk";
import fs from "fs";
import BaseGenerator from "./BaseGenerator";

export default class NextGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`next/`, [
      // components
      "components/common/ReferenceLinks.tsx",
      "components/foo/List.tsx",
      "components/foo/ListItem.tsx",
      "components/foo/Show.tsx",

      // interfaces
      "error/SubmissionError.ts",

      // interfaces
      "interfaces/Collection.ts",
      "interfaces/foo.ts",

      // pages
      "pages/foo.tsx",
      "pages/foos.tsx",

      // utils
      "utils/dataAccess.ts"
    ]);
  }

  checkDependencies(dir) {
    const dependencies = this.getTargetDependencies(dir);

    if (dependencies.length) {
      if (!dependencies.includes("@zeit/next-typescript")) {
        console.log(
          chalk.yellow(
            "It seems next-typescript is not installed but generator needs typescript to work efficiently."
          )
        );
      }

      if (!dependencies.includes("express")) {
        console.log(
          chalk.yellow(
            "It seems express is not installed but generator needs a custom express server to work efficiently."
          )
        );
      }
    }
  }

  checkImports(directory, imports, extension = ".ts") {
    imports.forEach(({ file }) => {
      if (!fs.existsSync(directory + file + extension)) {
        console.log(
          chalk.yellow(
            'An import for the file  "%s" has been generated but the file doesn\'t exists.'
          ),
          file
        );
      }
    });
  }

  help(resource, dir) {
    console.log(
      chalk.green('Code for the "%s" resource type has been generated!'),
      resource.title
    );

    // missing import
    const { imports } = this.parseFields(resource);
    this.checkImports(`${dir}/interfaces/`, imports);

    // server route configuration
    const lc = resource.title.toLowerCase();
    console.log("Paste the following route to your server configuration file:");
    console.log(
      chalk.green(`
server.get('/${lc}/:hash', (req, res) => {
  return app.render(req, res, '/${lc}', { hash: req.params.hash })
});
`)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);
    const { fields, imports } = this.parseFields(resource);

    const context = {
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf,
      fields,
      formFields: this.buildFields(resource.writableFields),
      imports,
      hydraPrefix: this.hydraPrefix,
      title: resource.title
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/components/common`,
      `${dir}/config`,
      `${dir}/error`,
      `${dir}/interfaces`,
      `${dir}/pages`,
      `${dir}/utils`
    ].forEach(dir => this.createDir(dir, false));

    // copy with patterned name
    this.createDir(`${dir}/components/${context.lc}`);
    [
      // components
      "components/%s/List.tsx",
      "components/%s/ListItem.tsx",
      "components/%s/Show.tsx",

      // pages
      "pages/%s.tsx",
      "pages/%ss.tsx"
    ].forEach(pattern =>
      this.createFileFromPattern(pattern, dir, context.lc, context)
    );

    // interface pattern should be camel cased
    this.createFile(
      "interfaces/foo.ts",
      `${dir}/interfaces/${context.ucf}.ts`,
      context
    );

    // copy with regular name
    [
      // components
      "components/common/ReferenceLinks.tsx",

      // error
      "error/SubmissionError.ts",

      // interfaces
      "interfaces/Collection.ts",

      // utils
      "utils/dataAccess.ts"
    ].forEach(file => this.createFile(file, `${dir}/${file}`, context, false));

    // API config
    this.createEntrypoint(api.entrypoint, `${dir}/config/entrypoint.ts`);
  }

  getType(field) {
    if (field.reference) {
      return field.reference.title;
    }

    switch (field.range) {
      case "http://www.w3.org/2001/XMLSchema#integer":
      case "http://www.w3.org/2001/XMLSchema#decimal":
        return "number";
      case "http://www.w3.org/2001/XMLSchema#boolean":
        return "boolean";
      case "http://www.w3.org/2001/XMLSchema#date":
      case "http://www.w3.org/2001/XMLSchema#dateTime":
      case "http://www.w3.org/2001/XMLSchema#time":
        return "Date";
      case "http://www.w3.org/2001/XMLSchema#string":
        return "string";
    }

    return "any";
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : "";
  }

  parseFields(resource) {
    const fields = {};

    for (let field of resource.writableFields) {
      fields[field.name] = {
        notrequired: !field.required,
        name: field.name,
        type: this.getType(field),
        description: this.getDescription(field),
        readonly: false,
        reference: field.reference
      };
    }

    for (let field of resource.readableFields) {
      if (fields[field.name] !== undefined) {
        continue;
      }

      fields[field.name] = {
        notrequired: !field.required,
        name: field.name,
        type: this.getType(field),
        description: this.getDescription(field),
        readonly: true,
        reference: field.reference
      };
    }

    // Parse fields to add relevant imports, required for Typescript
    const fieldsArray = Object.values(fields);
    const imports = {};

    for (const field of fieldsArray) {
      if (field.reference) {
        imports[field.type] = {
          type: field.type,
          file: "./" + field.type
        };
      }
    }

    return { fields: fieldsArray, imports: Object.values(imports) };
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
