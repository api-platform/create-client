#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "isomorphic-fetch";
import { program } from "commander";
import {
  parseHydraDocumentation,
  parseOpenApi3Documentation,
  parseSwaggerDocumentation,
} from "@api-platform/api-doc-parser";
import generators from "./generators.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
  fs.readFileSync(`${dirname}/../package.json`, "utf-8")
);

async function main() {
  program
    .version(packageJson.version)
    .description(
      "Generate apps built with Next, Nuxt, Quasar, React, React Native, Vue, Vuetify or Angular for any API documented using Hydra or OpenAPI"
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
    .option("--username [username]", "Username for basic auth (Hydra only)")
    .option("--password [password]", "Password for basic auth (Hydra only)")
    .option("--bearer [bearer]", "Token for bearer auth (Hydra only)")
    .option(
      "-g, --generator [generator]",
      'The generator to use, one of "next", "nuxt", "quasar", "react", "react-native", "typescript", "vue", "vuetify" or a path to a custom generator of your choice',
      "next"
    )
    .option(
      "-t, --template-directory [templateDirectory]",
      "The templates directory base to use. Final directory will be ${templateDirectory}/${generator}",
      `${dirname}/../templates/`
    )
    .option(
      "-f, --format [hydra|openapi3|openapi2]",
      '"hydra", "openapi3" or "openapi2"',
      "hydra"
    )
    .option(
      "-s, --server-path [serverPath]",
      "Path to express server file to allow route dynamic addition (Next.js generator only)"
    )
    .parse(process.argv);

  if (
    2 !== program.args.length &&
    (!process.env.API_PLATFORM_CREATE_CLIENT_ENTRYPOINT ||
      !process.env.API_PLATFORM_CREATE_CLIENT_OUTPUT)
  ) {
    program.help();
  }

  const options = program.opts();

  const entrypoint =
    program.args[0] || process.env.API_PLATFORM_CREATE_CLIENT_ENTRYPOINT;
  const outputDirectory =
    program.args[1] || process.env.API_PLATFORM_CREATE_CLIENT_OUTPUT;

  const entrypointWithSlash = entrypoint.endsWith("/")
    ? entrypoint
    : entrypoint + "/";

  const generator = (await generators(options.generator))({
    hydraPrefix: options.hydraPrefix,
    templateDirectory: options.templateDirectory,
  });
  const resourceToGenerate = options.resource
    ? options.resource.toLowerCase()
    : null;
  const serverPath = options.serverPath
    ? options.serverPath.toLowerCase()
    : null;

  const parser = (entrypointWithSlash) => {
    // parserOptions are used to set headers on the hydra-requests
    const parserOptions = {};
    // options refers to the opts set via the CLI
    if (options.username && options.password) {
      const encoded = Buffer.from(
        `${options.username}:${options.password}`
      ).toString("base64");
      parserOptions.headers = new Headers();
      parserOptions.headers.set("Authorization", `Basic ${encoded}`);
    }
    if (options.bearer) {
      parserOptions.headers = new Headers();
      parserOptions.headers.set("Authorization", `Bearer ${options.bearer}`);
    }
    switch (options.format) {
      case "swagger": // deprecated
      case "openapi2":
        return parseSwaggerDocumentation(entrypointWithSlash);
      case "openapi3":
        return parseOpenApi3Documentation(entrypointWithSlash);
      default:
        return parseHydraDocumentation(entrypointWithSlash, parserOptions);
    }
  };

  // check generator dependencies
  generator.checkDependencies(outputDirectory, serverPath);

  parser(entrypointWithSlash)
    .then((ret) => {
      ret.api.resources
        .filter(({ deprecated }) => !deprecated)
        .filter((resource) => {
          const nameLc = resource.name.toLowerCase();
          const titleLc = resource.title.toLowerCase();

          return (
            null === resourceToGenerate ||
            nameLc === resourceToGenerate ||
            titleLc === resourceToGenerate
          );
        })
        .map((resource) => {
          const filterDeprecated = (list) =>
            list.filter(({ deprecated }) => !deprecated);

          resource.fields = filterDeprecated(resource.fields);
          resource.readableFields = filterDeprecated(resource.readableFields);
          resource.writableFields = filterDeprecated(resource.writableFields);

          generator.generate(ret.api, resource, outputDirectory, serverPath);

          return resource;
        })
        // display helps after all resources have been generated to check relation dependency for example
        .forEach((resource) => generator.help(resource, outputDirectory));
    })
    .catch((e) => {
      console.log(e);
    });
}

main();
