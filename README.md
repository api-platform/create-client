# API Platform Client Generator

[![Build Status](https://travis-ci.org/api-platform/client-generator.svg?branch=master)](https://travis-ci.org/api-platform/client-generator)
[![npm version](https://badge.fury.io/js/%40api-platform%2Fclient-generator.svg)](https://badge.fury.io/js/%40api-platform%2Fclient-generator)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

API Platform Client Generator is a generator to scaffold app with Create-Retrieve-Update-Delete features for any API exposing a Hydra or Swagger documentation for:
 * React/Redux
 * Vue.js

Works especially well with APIs built with the [API Platform](https://api-platform.com) framework.

## Installation

    yarn global add @api-platform/client-generator

## Usage

**Hydra**
```sh
generate-api-platform-client https://demo.api-platform.com/ output/ --resource Book
```

**Swagger**
```sh
generate-api-platform-client https://demo.api-platform.com/ output/ --resource Book --format swagger
```

## Features

* Generate high-quality ES6 components and files built with [React](https://facebook.github.io/react/), [Redux](http://redux.js.org), [React Router](https://reacttraining.com/react-router/) and [Redux Form](http://redux-form.com/) including:
  * A list view
  * A creation form
  * An edition form
  * A deletion button
* Use the Hydra or Swagger API documentation to generate the code
* Generate the suitable HTML5 input type (`number`, `date`...) according to the type of the API property
* Display of the server-side validation errors under the related input (if using API Platform Core)
* Client-side validation (`required` attributes)
* The generated HTML is compatible with [Bootstrap](https://getbootstrap.com/) and include mandatory classes
* The generated HTML code is accessible to people with disabilities ([ARIA](https://www.w3.org/WAI/intro/aria) support)
* The Redux and the React Router configuration is also generated

## Documentation

The documentation of API Platform's Client Generator can be browsed [on the official website](https://api-platform.com/docs/client-generator).

## Credits

Created by [Kévin Dunglas](https://dunglas.fr). Sponsored by [Les-Tilleuls.coop](https://les-tilleuls.coop).
Commercial support available upon request.
