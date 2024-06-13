import type { Field, Parameter, Resource } from "@api-platform/api-doc-parser";
import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import type { TemplateDelegate } from "handlebars";
import handlebars from "handlebars";
import pc from "picocolors";
import { format } from "prettier";
import { vsprintf } from "sprintf-js";
import type { Context, GeneratorParams } from "../types";
import { outputFile, pathExists } from "../utils";
import { normalize } from "node:path";

export class BaseGenerator {
  templates: Record<string, TemplateDelegate> = {};
  hydraPrefix?: string;
  templateDirectory: string;

  constructor({ hydraPrefix, templateDirectory }: GeneratorParams) {
    this.hydraPrefix = hydraPrefix;
    this.templateDirectory = templateDirectory;

    this.registerTemplates("", ["entrypoint.js"]);
  }

  registerTemplates(basePath: string, paths: string[]) {
    for (const path of paths) {
      const fullPath = normalize(
        `${this.templateDirectory}/${basePath}${path}`
      );
      this.templates[path] = handlebars.compile(
        fs.readFileSync(fullPath).toString()
      );
    }
  }

  async createDir(dir: string, warn = true) {
    if (await pathExists(dir)) {
      if (warn) {
        console.log(
          pc.bgBlue(pc.bold(" INFO ")),
          pc.white(`The directory "${dir}" already exists`)
        );
      }
      return;
    }

    return mkdir(dir, { recursive: true });
  }

  createDirs(dirs: string[], warn = true) {
    return Promise.all(dirs.map((dir) => this.createDir(dir, warn)));
  }

  createFileFromPattern(
    pattern: string,
    dir: string,
    values: string[],
    context: Context,
    templateValues = ["foo", "Foo"]
  ) {
    return this.createFile(
      vsprintf(pattern, templateValues),
      vsprintf(`${dir}/${pattern}`, values),
      context
    );
  }

  async createFile(
    template: string,
    dest: string,
    context: Partial<Context> = {},
    warn = true
  ) {
    if (this.templates[template] === undefined) {
      console.log(
        `The template ${template} does not exists in the registered templates.`
      );

      return;
    }

    if (await pathExists(dest)) {
      if (warn) {
        console.log(
          pc.bgYellow(pc.bold(" WARN ")),
          pc.white(`The file "${dest}" already exists. Skipping creation.`)
        );
      }
      return;
    }

    const content = this.templates[template](context);

    const formattedFile = await this.formatFile(content, template);

    return outputFile(dest, formattedFile);
  }

  // Format the generated code using Prettier
  async formatFile(content: string, filepath: string) {
    return format(content, { filepath }).catch((error) => {
      console.error(error);
      return content;
    });
  }

  createEntrypoint(entrypoint: string, dest: string) {
    return this.createFile("entrypoint.js", dest, { entrypoint }, false);
  }

  createConfigFile(dest: string, context?: Partial<Context>) {
    return this.createFile("utils/config.ts", dest, context, false);
  }

  getHtmlInputTypeFromField(field: Field | Parameter): {
    htmlInputType: string;
    step?: string;
  } {
    if ("id" in field) {
      switch (field.id) {
        case "http://schema.org/email":
          return { htmlInputType: "email" };

        case "http://schema.org/url":
          return { htmlInputType: "url" };
      }
    }

    switch (field.range) {
      case "http://www.w3.org/2001/XMLSchema#integer":
        return { htmlInputType: "number" };
      case "http://www.w3.org/2001/XMLSchema#decimal":
        return { htmlInputType: "number", step: "0.1" };
      case "http://www.w3.org/2001/XMLSchema#boolean":
        return { htmlInputType: "checkbox" };
      case "http://www.w3.org/2001/XMLSchema#date":
        return { htmlInputType: "date" };
      case "http://www.w3.org/2001/XMLSchema#time":
        return { htmlInputType: "time" };
      case "http://www.w3.org/2001/XMLSchema#dateTime":
        return { htmlInputType: "dateTime" };

      default:
        return { htmlInputType: "text" };
    }
  }

  getTSType(field: Field) {
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
      case "http://www.w3.org/2001/XMLSchema#string":
        return "string";
    }

    return "any";
  }

  getDescription(field: Field) {
    return field.description?.replace(/"/g, "'") ?? "";
  }

  ucFirst(target: string) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }

  parseField(field: Field, readonly = false) {
    const isReference = !!field.reference && field.maxCardinality === 1;
    const isReferences = !!field.reference && field.maxCardinality !== 1;

    const isEmbedded = !!field.embedded && field.maxCardinality === 1;
    const isEmbeddeds = !!field.embedded && field.maxCardinality !== 1;

    return {
      ...field,
      isReference,
      isReferences,
      isEmbedded,
      isEmbeddeds,
      isRelation: isReference || isEmbedded,
      isRelations: isEmbeddeds || isReferences,
      tsType: this.getTSType(field),
      ...this.getHtmlInputTypeFromField(field),
      description: this.getDescription(field),
      readonly,
      sortable: false,
    };
  }

  parseFields(resource: Resource) {
    const parsedFields: { [name: string]: boolean } = {};

    const writableFields =
      resource.writableFields?.flatMap((field) => {
        if (parsedFields[field.name]) return [];
        parsedFields[field.name] = true;

        return this.parseField(field);
      }) ?? [];

    const readableFields =
      resource.readableFields?.flatMap((field) => {
        if (parsedFields[field.name]) return [];

        parsedFields[field.name] = true;

        return this.parseField(field, true);
      }) ?? [];

    return [...writableFields, ...readableFields];
  }

  help(resource: Resource) {
    console.log(
      pc.bgGreen(pc.bold(" DONE ")),
      pc.green(
        `Code for the "${resource.title}" resource type has been generated!`
      )
    );
  }
}
