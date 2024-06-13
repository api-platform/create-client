#!/usr/bin/env node

import {
  Command,
  Option,
  InvalidArgumentError,
} from "@commander-js/extra-typings";
import { resolve } from "node:path";
import { version } from "../package.json";
import { getGeneratorClass } from "./index";

import {
  canParseURL,
  filterDeprecated,
  formatError,
  parseDocumentation,
} from "./utils";

async function main() {
  const program = new Command()
    .name("@api-platform/client")

    .usage("<entrypoint> <outputDirectory> [options]")

    .description(
      "Generates applications using frameworks such as Next.js, Nuxt, Quasar, React, React Native, Vue, or Vuetify, for APIs documented with Hydra or OpenAPI."
    )

    .argument(
      "[entrypoint]",
      "The URL of the API entrypoint",
      (entrypoint) => {
        if (!canParseURL(entrypoint)) {
          throw new InvalidArgumentError("Invalid entrypoint URL");
        }
        return entrypoint.endsWith("/") ? entrypoint : `${entrypoint}/`;
      },
      process.env.API_PLATFORM_CREATE_CLIENT_ENTRYPOINT
    )

    .argument(
      "[output directory]",
      "Directory to store the generated application files",
      process.env.API_PLATFORM_CREATE_CLIENT_OUTPUT
    )

    .addOption(
      new Option(
        "-g, --generator <generator>",
        "The generator to use or a path to a custom generator (choices: next, nuxt, quasar, react, react-native, typescript, vue, vuetify or custom path)"
      ).default("next")
    )

    .option(
      "-r, --resource <resourceName>",
      "Generates CRUD operations for a specified resource",
      (resource) => resource.toLowerCase()
    )

    .addOption(
      new Option("-f, --format <format>", "The API documentation format")
        .default("hydra" as const)
        .choices(["hydra", "openapi3", "openapi2"] as const)
    )

    .option(
      "-p, --hydra-prefix <hydraPrefix>",
      "The hydra prefix used by the API",
      "hydra:"
    )
    // TODO: Fix path to templates
    .option(
      "-t, --template-directory <templateDirectory>",
      "The templates directory base to use. Final directory will be ${templateDirectory}/${generator}",
      `${resolve(__dirname, "..")}/templates/`
    )

    .addOption(
      new Option(
        "--username <username>",
        "Username for basic authentication (Hydra only)"
      ).implies({ format: "hydra" })
    )

    .addOption(
      new Option(
        "--password <password>",
        "Password for basic authentication (Hydra only)"
      ).implies({ format: "hydra" })
    )

    .addOption(
      new Option(
        "--bearer <bearer>",
        "Bearer token for authentication (Hydra only)"
      ).implies({ format: "hydra" })
    )

    .version(version)

    .showHelpAfterError()

    .configureOutput({
      outputError: (string, write) => write(formatError(string)),
    })

    .parse(process.argv);

  try {
    const [entrypoint, outputDirectory] = program.processedArgs;

    if (!entrypoint && !outputDirectory) {
      return program.error(
        "Missing required arguments <entrypoint> and <output directory>"
      );
    }

    if (!entrypoint) {
      return program.error("Missing required argument <entrypoint>");
    }
    if (!outputDirectory) {
      return program.error("Missing required argument <output directory>");
    }

    const options = program.opts();

    const Generator = await getGeneratorClass(options.generator);

    const generator = new Generator({
      hydraPrefix: options.hydraPrefix,
      templateDirectory: options.templateDirectory,
    });

    const parsedDoc = await parseDocumentation(entrypoint, options);

    const ressources = parsedDoc?.api?.resources?.flatMap((resource) => {
      if (resource.deprecated) return [];

      const nameLc = resource.name.toLowerCase();
      const titleLc = resource.title?.toLowerCase();

      if (
        options.resource &&
        nameLc !== options.resource &&
        titleLc !== options.resource
      ) {
        return [];
      }

      resource.fields = filterDeprecated(resource.fields);
      resource.readableFields = filterDeprecated(resource.readableFields);
      resource.writableFields = filterDeprecated(resource.writableFields);

      return resource;
    });

    if (!ressources?.length) {
      console.error("No resources found");
      return;
    }

    await Promise.all(
      ressources.map((resource) =>
        generator.generate(parsedDoc.api, resource, outputDirectory)
      )
    );

    // display helps after all resources have been generated to check relation dependency for example
    ressources.forEach((resource) => generator.help(resource, outputDirectory));
  } catch (error) {
    console.error(error);
    console.error((error as Error).message);
    program.showHelpAfterError(false).error((error as Error).message);
  }
}

main();
