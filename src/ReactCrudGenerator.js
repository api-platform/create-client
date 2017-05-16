import mkdirp from 'mkdirp';
import handlebars from 'handlebars';
import fs from 'fs';

export default class ReactCrudGenerator {
  templates = {};

  constructor(hydraPrefix) {
    const templatePath = `${__dirname}/../templates/react/`;

    this.hydraPrefix = hydraPrefix;

    // actions
    this.registerTemplate(templatePath, 'actions/foo/create.js');
    this.registerTemplate(templatePath, 'actions/foo/delete.js');
    this.registerTemplate(templatePath, 'actions/foo/list.js');
    this.registerTemplate(templatePath, 'actions/foo/update.js');

    // api
    this.registerTemplate(templatePath, 'api/fooFetch.js');

    // components
    this.registerTemplate(templatePath, 'components/foo/Create.js');
    this.registerTemplate(templatePath, 'components/foo/Form.js');
    this.registerTemplate(templatePath, 'components/foo/index.js');
    this.registerTemplate(templatePath, 'components/foo/List.js');
    this.registerTemplate(templatePath, 'components/foo/Update.js');

    // reducers
    this.registerTemplate(templatePath, 'reducers/foo/create.js');
    this.registerTemplate(templatePath, 'reducers//foo/delete.js');
    this.registerTemplate(templatePath, 'reducers/foo/index.js');
    this.registerTemplate(templatePath, 'reducers/foo/list.js');
    this.registerTemplate(templatePath, 'reducers/foo/update.js');

    // routes
    this.registerTemplate(templatePath, 'routes/foo.js');

    // entrypoint
    this.registerTemplate(templatePath, 'api/_entrypoint.js');
  }

  registerTemplate(templatePath, path) {
    this.templates[path] = handlebars.compile(fs.readFileSync(templatePath+path).toString());
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst = resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

    const context = {
      title: resource.title,
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      fields: resource.readableFields,
      formFields: this.buildFields(resource.writableFields),
      hydraPrefix: this.hydraPrefix,
      titleUcFirst
    };

    // Create directories
    mkdirp.sync(`${dir}/api`); // This directory may already exist
    mkdirp.sync(`${dir}/routes`); // This directory may already exist
    this.createDir(`${dir}/actions/${lc}`);
    this.createDir(`${dir}/components/${lc}`);
    this.createDir(`${dir}/reducers/${lc}`);

    // actions
    this.createFile('actions/foo/create.js', `${dir}/actions/${lc}/create.js`, context);
    this.createFile('actions/foo/delete.js', `${dir}/actions/${lc}/delete.js`, context);
    this.createFile('actions/foo/list.js', `${dir}/actions/${lc}/list.js`, context);
    this.createFile('actions/foo/update.js', `${dir}/actions/${lc}/update.js`, context);

    // api
    this.createFile('api/fooFetch.js', `${dir}/api/${lc}Fetch.js`, context);

    // components
    this.createFile('components/foo/Create.js', `${dir}/components/${lc}/Create.js`, context);
    this.createFile('components/foo/Form.js', `${dir}/components/${lc}/Form.js`, context);
    this.createFile('components/foo/index.js', `${dir}/components/${lc}/index.js`, context);
    this.createFile('components/foo/List.js', `${dir}/components/${lc}/List.js`, context);
    this.createFile('components/foo/Update.js', `${dir}/components/${lc}/Update.js`, context);

    // reducers
    this.createFile('reducers/foo/create.js', `${dir}/reducers/${lc}/create.js`, context);
    this.createFile('reducers//foo/delete.js', `${dir}/reducers/${lc}/delete.js`, context);
    this.createFile('reducers/foo/index.js', `${dir}/reducers/${lc}/index.js`, context);
    this.createFile('reducers/foo/list.js', `${dir}/reducers/${lc}/list.js`, context);
    this.createFile('reducers/foo/update.js', `${dir}/reducers/${lc}/update.js`, context);

    // routes
    this.createFile('routes/foo.js', `${dir}/routes/${lc}.js`, context)
  }

  entrypoint(dir) {
      this.createFile('api/_entrypoint.js', `${dir}/api/_entrypoint.js`, null);
  }

  getInputTypeFromField(field) {
    switch (field.id) {
      case 'http://schema.org/email':
        return {type: 'email'};

      case 'http://schema.org/url':
        return {type: 'url'};
    }

    switch (field.range) {
      case 'http://www.w3.org/2001/XMLSchema#integer':
        return {type: 'number'};

      case 'http://www.w3.org/2001/XMLSchema#decimal':
        return {type: 'number', step: '0.1'};

      case 'http://www.w3.org/2001/XMLSchema#boolean':
        return {type: 'checkbox'};

      case 'http://www.w3.org/2001/XMLSchema#date':
        return {type: 'date'};

      case 'http://www.w3.org/2001/XMLSchema#time':
        return {type: 'time'};

      default:
        return {type: 'text'};
    }
  }

  buildFields(apiFields) {
    let fields = [];
    for (let apiField of apiFields) {
      let field = this.getInputTypeFromField(apiField);
      field.required = apiField.required;
      field.name = apiField.name;
      field.description = apiField.description.replace(/"/g, "'"); // fix for Form placeholder description

      fields.push(field)
    }

    return fields;
  }

  createDir(dir) {
    if (fs.existsSync(dir)) throw new Error(`The directory "${dir}" already exists`);
    mkdirp.sync(dir);
  }

  createFile(template, dest, context) {
    fs.writeFileSync(dest, this.templates[template](context));
  }
}
