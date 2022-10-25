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
const resourcesList = [];
const dirname = path.dirname(fileURLToPath(import.meta.url)); // jshint ignore:line

const packageJson = JSON.parse(
  fs.readFileSync(`${dirname}/../package.json`, "utf-8")
);

async function main() {
  program
    .version(packageJson.version)
    .description(
      "Generate apps built with Next, Nuxt, Quasar, React, React Native, Vue or Vuetify for any API documented using Hydra or OpenAPI"
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
          resourcesList.push({ name: resource.name, title: resource.title });
          return resource;
        })
        // display helps after all resources have been generated to check relation dependency for example
        .forEach((resource) => generator.help(resource, outputDirectory));
    })
    .then(() => {
      const currProjectPackage = JSON.parse(
        fs.readFileSync(`${outputDirectory}/../package.json`, "utf-8")
      );
      currProjectPackage.dependencies["vue-i18n"] = "^8.27.2";
      const packageFilePath = `${outputDirectory}/../package.json`;
      fs.writeFileSync(
        packageFilePath,
        JSON.stringify(currProjectPackage, null, 2)
      );
    })
    .then(() => {
      // Register every route list of each resource
      const routesPath = "router/index.js";

      // resource routes import template
      const importRoutesContent = resourcesList.reduce(
        (_prevRes, _currRes) =>
          _prevRes +
          `import ${_currRes.title.toLowerCase()}Routes from "./${_currRes.title.toLowerCase()}"\n`,
        ""
      );
      // resource routes add in routes list
      const routesSpreadContent = resourcesList.reduce(
        (_prevRes, _currRes) =>
          _prevRes + `...${_currRes.title.toLowerCase()}Routes,\n`,
        ""
      );
      generator.overwriteFile(routesPath, `${outputDirectory}/${routesPath}`, {
        importRoutes: importRoutesContent,
        routesSpread: routesSpreadContent,
      });

      // Register every store module of each resource
      const storePath = "store/index.js";

      // resource modules import template
      const importModulesContent = resourcesList.reduce(
        (_prevMod, _currMod) =>
          _prevMod +
          `import ${_currMod.title.toLowerCase()} from "./modules/${_currMod.title.toLowerCase()}/"\n`,
        ""
      );

      // resource modules add in modules list
      const modulesSpreadContent = resourcesList.reduce(
        (_prevMod, _currMod) => _prevMod + `${_currMod.title.toLowerCase()},\n`,
        ""
      );
      generator.overwriteFile(storePath, `${outputDirectory}/${storePath}`, {
        importModules: importModulesContent,
        modulesSpread: modulesSpreadContent,
      });

      // vue
      for (const file of ["views/Home.vue", "App.vue"]) {
        generator.overwriteFile(file, `${outputDirectory}/${file}`);
      }

      // Main
      const libsContent = 'import i18n from "@/libs/i18n"\n';
      const addLibsContent = "i18n,\n";
      generator.overwriteFile("resourceMain.js", `${outputDirectory}/main.js`, {
        importLibs: libsContent,
        addLibs: addLibsContent,
      });

      // add sidebar with resource as items
      const sideBarPath = "components/Sidebar.vue"; //menu items from resources list
      const menuContent = resourcesList.reduce(
        (prevRes, currRes) =>
          prevRes +
          `<li class="nav-item">
          <router-link to="/${currRes.name}/" class="nav-link align-middle px-0">
            <i class="fs-4 bi-house"></i>
            <span class="ms-1 d-none d-sm-inline">${currRes.title}</span>
          </router-link>
        </li>\n`,
        ""
      );
      generator.createFile(sideBarPath, `${outputDirectory}/${sideBarPath}`, {
        menu: menuContent,
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

main();
