import chalk from 'chalk';
import BaseGenerator from './BaseGenerator';

export default class extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates(`vue/`, [
      // modules
      'store/modules/foo/index.js',
      'store/modules/foo/create.js',
      'store/modules/foo/delete.js',
      'store/modules/foo/list.js',
      'store/modules/foo/update.js',
      'store/modules/foo/show.js',
      'store/modules/foo/mutation-types.js',

      // components
      'components/foo/Create.vue',
      'components/foo/Form.vue',
      'components/foo/List.vue',
      'components/foo/Update.vue',
      'components/foo/Show.vue',

      // routes
      'routes/foo.js',

      // error
      'error/SubmissionError.js',

      // utils
      'utils/fetch.js',
    ]);
  }

  help(resource) {
    const titleLc = resource.title.toLowerCase();

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
    for (let dir of [`${dir}/config`, `${dir}/error`, `${dir}/routes`, `${dir}/utils`]) {
      this.createDir(dir, false);
    }

    for (let dir of [`${dir}/store/modules/${lc}`, `${dir}/components/${lc}`]) {
      this.createDir(dir);
    }

    for (let pattern of [
      // modules
      'store/modules/%s/index.js',
      'store/modules/%s/create.js',
      'store/modules/%s/delete.js',
      'store/modules/%s/list.js',
      'store/modules/%s/update.js',
      'store/modules/%s/show.js',
      'store/modules/%s/mutation-types.js',

      // components
      'components/%s/Create.vue',
      'components/%s/Form.vue',
      'components/%s/List.vue',
      'components/%s/Update.vue',
      'components/%s/Show.vue',

      // routes
      'routes/%s.js',
    ]) {
      this.createFileFromPattern(pattern, dir, lc, context);
    }

    // error
    this.createFile('error/SubmissionError.js', `${dir}/error/SubmissionError.js`, context, false);

    this.createEntrypoint(api.entrypoint, `${dir}/config/_entrypoint.js`);
    this.createFile('utils/fetch.js', `${dir}/utils/fetch.js`, {hydraPrefix: this.hydraPrefix}, false);
  }
}
