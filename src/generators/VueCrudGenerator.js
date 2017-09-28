import mkdirp from 'mkdirp';
import handlebars from 'handlebars';
import fs from 'fs';
import urlapi from 'url';
import chalk from 'chalk';

export default class VueCrudGenerator {
  templates = {};

  constructor({hydraPrefix, templateDirectory}) {
    const templatePath = `${templateDirectory}/vue/`;

    this.hydraPrefix = hydraPrefix;

    // modules
    this.registerTemplate(templatePath, 'store/modules/foo/index.js');
    this.registerTemplate(templatePath, 'store/modules/foo/create.js');
    this.registerTemplate(templatePath, 'store/modules/foo/delete.js');
    this.registerTemplate(templatePath, 'store/modules/foo/list.js');
    this.registerTemplate(templatePath, 'store/modules/foo/update.js');
    this.registerTemplate(templatePath, 'store/modules/foo/show.js');
    this.registerTemplate(templatePath, 'store/modules/foo/mutation-types.js');

    // components
    this.registerTemplate(templatePath, 'components/foo/Create.vue');
    this.registerTemplate(templatePath, 'components/foo/Form.vue');
    this.registerTemplate(templatePath, 'components/foo/List.vue');
    this.registerTemplate(templatePath, 'components/foo/Update.vue');
    this.registerTemplate(templatePath, 'components/foo/Show.vue');

    // routes
    this.registerTemplate(templatePath, 'routes/foo.js');

    // entrypoint
    this.registerTemplate(templatePath, 'config/_entrypoint.js');

    // error
    this.registerTemplate(templatePath, 'error/SubmissionError.js');

    // utils
    this.registerTemplate(templatePath, 'utils/fetch.js');
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

// Add routes to VueRouter
const router = new VueRouter({
  // ...
  routes: [
      ...${titleLc}Routes,
  ]
});

// Add the modules in the store
import { ${titleLc} } from './store/modules/${titleLc}/';

export const store = new Vuex.Store({
  // ...
  modules: {
    ${titleLc}
  }
});
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
    mkdirp.sync(`${dir}/config`);
    mkdirp.sync(`${dir}/error`);
    mkdirp.sync(`${dir}/routes`);
    mkdirp.sync(`${dir}/utils`);

    this.createDir(`${dir}/store/modules/${lc}`);
    this.createDir(`${dir}/components/${lc}`);

    // modules
    this.createFile('store/modules/foo/index.js', `${dir}/store/modules/${lc}/index.js`, context);
    this.createFile('store/modules/foo/create.js', `${dir}/store/modules/${lc}/create.js`, context);
    this.createFile('store/modules/foo/delete.js', `${dir}/store/modules/${lc}/delete.js`, context);
    this.createFile('store/modules/foo/list.js', `${dir}/store/modules/${lc}/list.js`, context);
    this.createFile('store/modules/foo/update.js', `${dir}/store/modules/${lc}/update.js`, context);
    this.createFile('store/modules/foo/show.js', `${dir}/store/modules/${lc}/show.js`, context);
    this.createFile('store/modules/foo/mutation-types.js', `${dir}/store/modules/${lc}/mutation-types.js`, context);

    // components
    this.createFile('components/foo/Create.vue', `${dir}/components/${lc}/Create.vue`, context);
    this.createFile('components/foo/Form.vue', `${dir}/components/${lc}/Form.vue`, context);
    this.createFile('components/foo/List.vue', `${dir}/components/${lc}/List.vue`, context);
    this.createFile('components/foo/Update.vue', `${dir}/components/${lc}/Update.vue`, context);
    this.createFile('components/foo/Show.vue', `${dir}/components/${lc}/Show.vue`, context);

    // config
    this.createFile('config/_entrypoint.js', `${dir}/config/_entrypoint.js`, context);

    // error
    this.createFile('error/SubmissionError.js', `${dir}/error/SubmissionError.js`, context);

    // routes
    this.createFile('routes/foo.js', `${dir}/routes/${lc}.js`, context);
  }

  entrypoint(apiEntry, dir) {
    const url = urlapi.parse(apiEntry);
    const {protocol, host, port, pathname} = url;
    const hostUrl = `${protocol}//${host}${port ? `:${port}` : ''}`;

    const context = {
      host: hostUrl,
      path: pathname
    }

    this.createFile('config/_entrypoint.js', `${dir}/config/_entrypoint.js`, context);
  }

  utils(dir) {
    const context = {
      hydraPrefix: this.hydraPrefix
    }

    this.createFile('utils/fetch.js', `${dir}/utils/fetch.js`, context);
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
