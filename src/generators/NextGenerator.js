import chalk from "chalk";
import fs from "fs";
import BaseGenerator from "./BaseGenerator";
import { parse, print, types } from "recast";

export default class NextGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.routeAddedtoServer = false;
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

  checkDependencies(dir, serverPath) {
    const dependencies = this.getTargetDependencies(dir);

    if (!dependencies.length) {
      return;
    }

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

    if (serverPath) {
      if (!fs.existsSync(serverPath)) {
        console.log(chalk.red("Express server file doesn't exists."));
        return;
      }

      const { mode } = fs.statSync(serverPath);
      if ("200" !== (mode & parseInt("200", 8)).toString(8)) {
        console.log(chalk.red("Express server file is not writable."));
      }
    }
  }

  checkImports(directory, imports, extension = ".ts") {
    imports.forEach(({ file }) => {
      if (fs.existsSync(directory + file + extension)) {
        return;
      }

      console.log(
        chalk.yellow(
          'An import for the file  "%s" has been generated but the file doesn\'t exists.'
        ),
        file
      );
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
    if (!this.routeAddedtoServer) {
      const lc = resource.title.toLowerCase();
      console.log(
        "Paste the following route to your server configuration file:"
      );
      console.log(chalk.green(this.getShowRoute(lc)));
    }
  }

  generate(api, resource, dir, serverPath) {
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

    if (serverPath) {
      this.createExpressRoute(serverPath, lc, this.getShowRoute(lc));
    }
  }

  getShowRoute(name) {
    return `server.get('/${name}/:id', (req, res) => {
  return app.render(req, res, '/${name}', { id: req.params.id })
});`;
  }

  createExpressRoute(path, resourceName, toInsert) {
    const content = fs.readFileSync(path, "utf-8");
    const code = parse(content);
    const { namedTypes } = types;

    types.visit(code, {
      visitExpressionStatement: function(path) {
        const args = path.value.expression.arguments;
        if (
          2 === args.length &&
          namedTypes.Literal.check(args[0]) &&
          "*" === args[0].value &&
          namedTypes.ArrowFunctionExpression.check(args[1])
        ) {
          // insert route before "*" route
          path.parent.value.body.splice(path.name, 0, toInsert);

          return false;
        }

        this.traverse(path);
      }
    });

    fs.writeFileSync(path, print(code).code);
    console.log(
      chalk.green("'Show' route for %s has been added to your server"),
      resourceName
    );
    this.routeAddedtoServer = true;
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : "";
  }

  parseFields(resource) {
    const fields = [
      ...resource.writableFields,
      ...resource.readableFields
    ].reduce((list, field) => {
      if (list[field.name]) {
        return list;
      }

      return {
        ...list,
        [field.name]: {
          notrequired: !field.required,
          name: field.name,
          type: this.getType(field),
          description: this.getDescription(field),
          readonly: false,
          reference: field.reference
        }
      };
    }, {});

    // Parse fields to add relevant imports, required for Typescript
    const fieldsArray = Object.values(fields);
    const imports = Object.values(fields).reduce(
      (list, { reference, type }) => {
        if (!reference) {
          return list;
        }

        return {
          ...list,
          [type]: {
            type,
            file: `./${type}`
          }
        };
      },
      {}
    );

    return { fields: fieldsArray, imports: Object.values(imports) };
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
