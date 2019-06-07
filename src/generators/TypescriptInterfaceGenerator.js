import BaseGenerator from "./BaseGenerator";

export default class TypescriptInterfaceGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`typescript/`, ["interface.ts"]);
  }

  help(resource) {
    console.log(
      'Interface for the "%s" resource type has been generated!',
      resource.title
    );
  }

  generate(api, resource, dir) {
    const dest = `${dir}/interfaces`;
    const { fields, imports } = this.parseFields(resource);

    this.createDir(dest, false);
    this.createFile(
      "interface.ts",
      `${dest}/${resource.title.toLowerCase()}.ts`,
      {
        fields,
        imports,
        name: resource.title
      }
    );
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

    // If id is not present, add it manually with default values
    if (!("id" in fields)) {
      fields["id"] = {
        notrequired: true,
        name: "id",
        type: "string",
        description: null,
        readonly: false
      };
    }

    // Parse fields to add relevant imports, required for Typescript
    const fieldsArray = Object.keys(fields).map(e => fields[e]);
    const imports = {};

    for (const field of fieldsArray) {
      if (field.reference) {
        imports[field.type] = {
          type: field.type,
          file: "./" + field.type.toLowerCase()
        };
      }
    }

    const importsArray = Object.keys(imports).map(e => imports[e]);

    return { fields: fieldsArray, imports: importsArray };
  }
}
