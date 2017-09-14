import mkdirp from 'mkdirp';
import handlebars from 'handlebars';
import fs from 'fs';

export default class TypescriptInterfaceGenerator {
  templates = {};

  constructor() {
    const templatePath = `${__dirname}/../../templates/typescript`;
    this.template = handlebars.compile(fs.readFileSync(`${templatePath}/interface.ts`).toString())
  }

  help() {
  }

  generate(api, resource, dir) {
    const fields = this.parseFields(resource)
    const name = resource.title
    let dest = `${dir}/interfaces`

    try {
      mkdirp.sync(dest);
    } catch(e) {
      // nothing
    }

    dest += `/${name.toLowerCase()}.ts`;

    fs.writeFileSync(dest, this.template({fields, name}));
  }

  getType(field) {
    if (field.reference) {
      return field.reference.title;
    }

    switch (field.range) {
      case 'http://www.w3.org/2001/XMLSchema#integer':
      case 'http://www.w3.org/2001/XMLSchema#decimal':
        return 'number';
      case 'http://www.w3.org/2001/XMLSchema#boolean':
        return 'bool';
      case 'http://www.w3.org/2001/XMLSchema#date':
      case 'http://www.w3.org/2001/XMLSchema#dateTime':
      case 'http://www.w3.org/2001/XMLSchema#time':
        return 'Date';
      case 'http://www.w3.org/2001/XMLSchema#string':
        return 'string';
    }

    return 'any';
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : ''
  }

  parseFields(resource) {
    const fields = {}

    for (let field of resource.writableFields) {
      fields[field.name] = {
        notrequired: !field.required,
        name: field.name,
        type: this.getType(field),
        description: this.getDescription(field),
        readonly: false
      }
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
        readonly: true
      }
    }

    return Object.keys(fields).map((e) => fields[e]);
  }

  // createFile(template, dest, context) {
  // }
}
