import BaseGenerator from './BaseGenerator';

export default class TypescriptInterfaceGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`typescript/`, ['interface.ts']);
  }

  help(resource) {
    console.log('Interface for the "%s" resource type has been generated!', resource.title);
  }

  generate(api, resource, dir) {
    const dest = `${dir}/interfaces`;

    this.createDir(dest, false);
    this.createFile('interface.ts', `${dest}/${resource.title.toLowerCase()}.ts`, {
      fields: this.parseFields(resource),
      name: resource.title
    });
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
        return 'boolean';
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
}
