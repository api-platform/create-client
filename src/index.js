#!/usr/bin/env node

import program from 'commander';
import parseHydraDocumentation from 'api-doc-parser/lib/hydra/parseHydraDocumentation';
import 'isomorphic-fetch';
import {version} from '../package.json';
import ReactCrudGenerator from './ReactCrudGenerator';

program
  .version(version)
  .description('Generate a CRUD application built with React, Redux and React Router from an Hydra-enabled API')
  .usage('apiEntrypoint outputDirectory')
  .option('-e, --resource [resourceName]', 'Generate CRUD for the given resource')
  .option('-e, --hydra-prefix [hydraPrefix]', 'The hydra prefix used by the API', 'hydra:')
  .parse(process.argv);

if (2 !== program.args.length) {
  program.help();
}

const generator = new ReactCrudGenerator(program.hydraPrefix);
const resourceToGenerate = program.resource ? program.resource.toLowerCase() : null;

parseHydraDocumentation(program.args[0]).then(api => {
    for (let resource of api.resources) {
      if (null === resourceToGenerate || resource.name.toLowerCase() === resourceToGenerate || resource.title.toLowerCase() === resourceToGenerate) {
        generator.generate(api, resource, program.args[1]);
      }
    }
}).catch((e) => {
  console.log(e);
});
