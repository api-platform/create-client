import fs from 'fs';
import BaseGenerator from './BaseGenerator';
import handlebars from 'handlebars';
import hbh_comparison from 'handlebars-helpers/lib/comparison';

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`admin-on-rest/`, [
      'components/foo.js',
      'config/foo.js',
      'resources/foo.js',
      'resource-import.js',
    ]);

    handlebars.registerHelper('compare', hbh_comparison.compare);
  }

  help(resource) {
    console.log('Code for the "%s" resource type has been generated!', resource.title);
  }

  appendFile(template, dest, context = {}) {
      fs.appendFileSync(dest, this.templates[template](context));
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
      titleUcFirst,
    };

    // Create directories
    // These directories may already exist
    for (let dir of [`${dir}/config`, `${dir}/resources`, `${dir}/components/`]) {
      this.createDir(dir, false);
    }

    // for (let dir of [`${dir}/components/${lc}`]) {
    //   this.createDir(dir);
    // }

    for (let pattern of [
      'components/%s.js',
      'config/%s.js',
      'resources/%s.js',
    ]) {
      this.createFileFromPattern(pattern, dir, lc, context)
    }

    this.appendFile('resource-import.js', `${dir}/resource-import.js`, context);

    this.createEntrypoint(api.entrypoint, `${dir}/config/_entrypoint.js`)
  }
}
