import mkdirp from 'mkdirp';
import handlebars from 'handlebars';
import fs from 'fs';
import urlapi from 'url';
import chalk from 'chalk';

export default class VueCrudGenerator {
  templates = {};

  constructor(hydraPrefix) {
    const templatePath = `${__dirname}/../../templates/vue/`;

    this.hydraPrefix = hydraPrefix;

    // modules
    this.registerTemplate(templatePath, 'modules/foo/index.js');
    this.registerTemplate(templatePath, 'modules/foo/create.js');
    this.registerTemplate(templatePath, 'modules/foo/delete.js');
    this.registerTemplate(templatePath, 'modules/foo/list.js');
    this.registerTemplate(templatePath, 'modules/foo/update.js');
    this.registerTemplate(templatePath, 'modules/foo/show.js');

    // api
    this.registerTemplate(templatePath, 'api/fooFetch.js');

    // components
    this.registerTemplate(templatePath, 'components/foo/Create.js');
    this.registerTemplate(templatePath, 'components/foo/Form.js');
    this.registerTemplate(templatePath, 'components/foo/index.js');
    this.registerTemplate(templatePath, 'components/foo/List.js');
    this.registerTemplate(templatePath, 'components/foo/Update.js');
    this.registerTemplate(templatePath, 'components/foo/Show.js');

    // routes
    this.registerTemplate(templatePath, 'routes/foo.js');

    // entrypoint
    this.registerTemplate(templatePath, 'api/_entrypoint.js');

    // utils
    this.registerTemplate(templatePath, 'utils/helpers.js');
  }

  registerTemplate(templatePath, path) {
    this.templates[path] = handlebars.compile(fs.readFileSync(templatePath+path).toString());
  }

  help(resource) {
    const titleLc = resource.title.toLowerCase()

    console.log('Code for the "%s" resource type has been generated!', resource.title);
    console.log('Paste the following definitions in your application configuration:');
    console.log(chalk.green(`
//import routes
import ${titleLc}Routes from './routes/${titleLc}';

// Add the modules in the store
import foo from './modules/foo';

export const store = new Vuex.Store({
    // ...
    modules: {
        foo
    }
});


// Add routes to <Switch>
{ ${titleLc}Routes }
`));
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
    // These directories may already exist
    mkdirp.sync(`${dir}/api`);
    mkdirp.sync(`${dir}/routes`);
    mkdirp.sync(`${dir}/utils`);

    this.createDir(`${dir}/modules/${lc}`);
    this.createDir(`${dir}/components/${lc}`);

    // modules
    this.createFile('modules/foo/index.js', `${dir}/modules/${lc}/index.js`, context);
    this.createFile('modules/foo/create.js', `${dir}/modules/${lc}/create.js`, context);
    this.createFile('modules/foo/delete.js', `${dir}/modules/${lc}/delete.js`, context);
    this.createFile('modules/foo/list.js', `${dir}/modules/${lc}/list.js`, context);
    this.createFile('modules/foo/update.js', `${dir}/modules/${lc}/update.js`, context);
    this.createFile('modules/foo/show.js', `${dir}/modules/${lc}/show.js`, context);

    // api
    this.createFile('api/fooFetch.js', `${dir}/api/${lc}Fetch.js`, context);

    // components
    this.createFile('components/foo/Create.js', `${dir}/components/${lc}/Create.js`, context);
    this.createFile('components/foo/Form.js', `${dir}/components/${lc}/Form.js`, context);
    this.createFile('components/foo/index.js', `${dir}/components/${lc}/index.js`, context);
    this.createFile('components/foo/List.js', `${dir}/components/${lc}/List.js`, context);
    this.createFile('components/foo/Update.js', `${dir}/components/${lc}/Update.js`, context);
    this.createFile('components/foo/Show.js', `${dir}/components/${lc}/Show.js`, context);

    // routes
    this.createFile('routes/foo.js', `${dir}/routes/${lc}.js`, context)
  }

  entrypoint(apiEntry, dir) {
    const url = urlapi.parse(apiEntry);
    const {protocol, host, port, pathname} = url;
    const hostUrl = `${protocol}//${host}${port ? `:${port}` : ''}`;

    const context = {
      host: hostUrl,
      path: pathname
    }

    this.createFile('api/_entrypoint.js', `${dir}/api/_entrypoint.js`, context);
  }

  utils(dir) {
    this.createFile('utils/helpers.js', `${dir}/utils/helpers.js`, null);
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
