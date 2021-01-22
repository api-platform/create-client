import chalk from "chalk";
import fs from "fs";
import handlebars from "handlebars";
import mkdirp from "mkdirp";
import { sprintf } from "sprintf-js";
import prettier from "prettier";

export default class {
  templates = {};

  constructor({ hydraPrefix, templateDirectory }) {
    this.hydraPrefix = hydraPrefix;
    this.templateDirectory = templateDirectory;

    this.registerTemplates("", ["entrypoint.js"]);
  }

  registerTemplates(basePath, paths) {
    for (let path of paths) {
      this.templates[path] = handlebars.compile(
        fs
          .readFileSync(`${this.templateDirectory}/${basePath}${path}`)
          .toString()
      );
    }
  }

  createDir(dir, warn = true) {
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);

      return;
    }

    if (warn) {
      console.log(chalk.yellow(`The directory "${dir}" already exists`));
    }
  }

  createFileFromPattern(pattern, dir, lc, context) {
    this.createFile(
      sprintf(pattern, "foo"),
      sprintf(`${dir}/${pattern}`, lc),
      context
    );
  }

  createFile(template, dest, context = {}, warn = true) {
    if (undefined === this.templates[template]) {
      console.log(
        `The template ${template} does not exists in the registered templates.`
      );

      return;
    }

    // Format the generated code using Prettier
    let content = this.templates[template](context);
    if (template.endsWith(".js")) {
      content = prettier.format(content, { parser: "babel" });
    } else if (template.endsWith(".ts") || template.endsWith(".tsx")) {
      content = prettier.format(content, { parser: "babel-ts" });
    }

    if (!fs.existsSync(dest)) {
      fs.writeFileSync(dest, content);

      return;
    }

    if (warn) console.log(`The file "${dest}" already exists`);
  }

  createEntrypoint(entrypoint, dest) {
    this.createFile("entrypoint.js", dest, { entrypoint }, false);
  }

  // eslint-disable-next-line no-unused-vars
  checkDependencies(dir) {}

  getTargetDependencies(dir) {
    const packageFilePath = `${dir}/package.json`;
    let packageFile;
    let dependencies = [];
    try {
      if (!fs.existsSync(packageFilePath)) {
        throw new Error();
      }
      packageFile = fs.readFileSync(packageFilePath);
      const configuration = JSON.parse(packageFile.toString());
      dependencies = Object.keys({
        ...configuration.dependencies,
        ...configuration.devDependencies,
      });
    } catch (e) {
      console.log(
        chalk.yellow(
          "There's no readable package file in the target directory. Generator can't check dependencies."
        )
      );
    }

    return dependencies;
  }

  getHtmlInputTypeFromField(field) {
    switch (field.id) {
      case "http://schema.org/email":
        return { type: "email" };

      case "http://schema.org/url":
        return { type: "url" };
    }

    switch (field.range) {
      case "http://www.w3.org/2001/XMLSchema#integer":
        return { type: "number", number: true };

      case "http://www.w3.org/2001/XMLSchema#decimal":
        return { type: "number", step: "0.1", number: true };

      case "http://www.w3.org/2001/XMLSchema#boolean":
        return { type: "checkbox" };

      case "http://www.w3.org/2001/XMLSchema#date":
        return { type: "date" };

      case "http://www.w3.org/2001/XMLSchema#time":
        return { type: "time" };

      case "http://www.w3.org/2001/XMLSchema#dateTime":
        return { type: "dateTime" };

      default:
        return { type: "text" };
    }
  }

  getType(field) {
    if (field.reference) {
      if (field.maxCardinality !== 1) {
        return "string[]";
      }

      return "string";
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

  buildFields(fields) {
    return fields.map((field) => ({
      ...field,
      ...this.getHtmlInputTypeFromField(field),
      description: field.description.replace(/"/g, "'"), // fix for Form placeholder description
    }));
  }
}
