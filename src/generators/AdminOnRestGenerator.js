import BaseGenerator from './BaseGenerator';

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`admin-on-rest/`, [
      // components
      'components/foo/index.js',
    ]);
  }

  help(resource) {
    console.log('Code for the "%s" resource type has been generated!', resource.title);
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
    for (let dir of [`${dir}/config`]) {
      this.createDir(dir, false);
    }

    for (let dir of [`${dir}/components/${lc}`]) {
      this.createDir(dir);
    }

    for (let pattern of [
      // components
      'components/%s/index.js',
    ]) {
      this.createFileFromPattern(pattern, dir, lc, context)
    }

    this.createEntrypoint(api.entrypoint, `${dir}/config/_entrypoint.js`)
  }
}
