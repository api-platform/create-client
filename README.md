# API Platform Client Generator

[![Build Status](https://travis-ci.org/api-platform/client-generator.svg?branch=master)](https://travis-ci.org/api-platform/client-generator)
[![npm version](https://badge.fury.io/js/%40api-platform%2Fclient-generator.svg)](https://badge.fury.io/js/%40api-platform%2Fclient-generator)

API Platform Client Generator is a generator to scaffold app with Create-Retrieve-Update-Delete features for any API exposing a [Hydra](http://www.hydra-cg.com/spec/latest/core/) or [OpenAPI](https://www.openapis.org/) documentation for:

* Next.js
* Nuxt
* Quasar
* React
* React Native
* TypeScript Interfaces
* Vue.js
* Vuetify.js

Works especially well with APIs built with the [API Platform](https://api-platform.com) framework.

## Documentation

The documentation of API Platform's Client Generator can be browsed [on the official website](https://api-platform.com/docs/client-generator).

## Features

* Generate high-quality TypeScript or ES6 components:
  * List view
  * Creation form
  * Editing form
  * Deletion button
* Use the Hydra or OpenAPI documentations to generate the code
* Generate the suitable HTML5 input type (`number`, `date`...) according to the type of the API property
* Display of the server-side validation errors under the related input (if using API Platform Core)
* Client-side validation (`required` attributes)
* The generated HTML is compatible with [Bootstrap](https://getbootstrap.com/) and includes mandatory classes
* The generated HTML code is accessible to people with disabilities ([ARIA](https://www.w3.org/WAI/intro/aria) support)

## Usage

### Hydra

    npx @api-platform/client-generator https://demo.api-platform.com/ output/ --resource Book

### OpenAPI 3

    npx @api-platform/client-generator https://demo.api-platform.com/docs.json output/ --resource Book --format openapi3

## Credits

Created by [Kévin Dunglas](https://dunglas.fr).

Sponsored by [Les-Tilleuls.coop](https://les-tilleuls.coop).

Commercial support available upon request.
