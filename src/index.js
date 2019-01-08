#!/usr/bin/env node

import "isomorphic-fetch";
import program from "commander";
import parseHydraDocumentation from "@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation";
import parseSwaggerDocumentation from "@api-platform/api-doc-parser/lib/swagger/parseSwaggerDocumentation";
import { version } from "../package.json";
import generators from "./generators";

program
  .version(version)
  .description(
    "Generate a CRUD application built with React, Redux and React Router from an Hydra-enabled API"
  )
  .usage("entrypoint outputDirectory")
  .option(
    "-r, --resource [resourceName]",
    "Generate CRUD for the given resource"
  )
  .option(
    "-p, --hydra-prefix [hydraPrefix]",
    "The hydra prefix used by the API",
    "hydra:"
  )
  .option(
    "-g, --generator [generator]",
    'The generator to use, one of "react", "react-native", "vue", "admin-on-rest"',
    "react"
  )
  .option(
    "-t, --template-directory [templateDirectory]",
    "The templates directory base to use. Final directory will be ${templateDirectory}/${generator}",
    `${__dirname}/../templates/`
  )
  .option("-f, --format [hydra|swagger]", '"hydra" or "swagger', "hydra")
  .parse(process.argv);

if (
  2 !== program.args.length &&
  (!process.env.API_PLATFORM_CLIENT_GENERATOR_ENTRYPOINT ||
    !process.env.API_PLATFORM_CLIENT_GENERATOR_OUTPUT)
) {
  program.help();
}

let entrypoint =
  program.args[0] || process.env.API_PLATFORM_CLIENT_GENERATOR_ENTRYPOINT;
const outputDirectory =
  program.args[1] || process.env.API_PLATFORM_CLIENT_GENERATOR_OUTPUT;

entrypoint = entrypoint.replace(/\/?$/, '/');

const generator = generators(program.generator)({
  hydraPrefix: program.hydraPrefix,
  templateDirectory: program.templateDirectory
});
const resourceToGenerate = program.resource
  ? program.resource.toLowerCase()
  : null;

const parser = entrypoint => {
  const parseDocumentation =
    "swagger" === program.format
      ? parseSwaggerDocumentation
      : parseHydraDocumentation;

  return parseDocumentation(entrypoint);
};

parser(entrypoint)
  .then(ret => {
    ret.api.resources
      .filter(({ deprecated }) => !deprecated)
      .forEach(resource => {
        const nameLc = resource.name.toLowerCase();
        const titleLc = resource.title.toLowerCase();

        if (
          null === resourceToGenerate ||
          nameLc === resourceToGenerate ||
          titleLc === resourceToGenerate
        ) {
          resource.fields = resource.fields.filter(
            ({ deprecated }) => !deprecated
          );
          resource.readableFields = resource.readableFields.filter(
            ({ deprecated }) => !deprecated
          );
          resource.writableFields = resource.writableFields.filter(
            ({ deprecated }) => !deprecated
          );

          generator.generate(ret.api, resource, outputDirectory);
          generator.help(resource);
        }
      });
  })
  .catch(e => {
    console.log(e);
  });
