import fs from "fs";
import handlebars from "handlebars";
import mkdirp from "mkdirp";
import { sprintf } from "sprintf-js";

export default class {
  templates = {};

  constructor({ hydraPrefix, templateDirectory }) {
    this.hydraPrefix = hydraPrefix;
    this.templateDirectory = templateDirectory;

    this.registerTemplates("", ["_entrypoint.js"]);
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

    if (warn) console.log(`The directory "${dir}" already exists`);
  }

  createFileFromPattern(pattern, dir, lc, context) {
    this.createFile(
      sprintf(pattern, "foo"),
      sprintf(`${dir}/${pattern}`, lc),
      context
    );
  }

  createFile(template, dest, context = {}, warn = true) {
    if (!fs.existsSync(dest)) {
      fs.writeFileSync(dest, this.templates[template](context));

      return;
    }

    if (warn) console.log(`The file "${dest}" already exists`);
  }

  createEntrypoint(entrypoint, dest) {
    this.createFile("_entrypoint.js", dest, { entrypoint }, false);
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
        return { type: "number" };

      case "http://www.w3.org/2001/XMLSchema#decimal":
        return { type: "number", step: "0.1" };

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

  buildFields(apiFields) {
    let fields = [];
    for (let apiField of apiFields) {
      let field = this.getHtmlInputTypeFromField(apiField);
      field.required = apiField.required;
      field.name = apiField.name;
      field.description = apiField.description.replace(/"/g, "'"); // fix for Form placeholder description

      fields.push(field);
    }

    return fields;
  }
}
