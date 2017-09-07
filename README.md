# API Platform CRUD Generator

A generator to scaffold a React/Redux app with Create-Retrieve-Update-Delete features for any API exposing a Hydra documentation.
Works especially well with APIs built with the [API Platform](https://api-platform.com) framework.

[![Build Status](https://travis-ci.org/api-platform/generate-crud.svg?branch=master)](https://travis-ci.org/api-platform/generate-crud)
[![npm version](https://badge.fury.io/js/api-platform-generate-crud.svg)](https://badge.fury.io/js/api-platform-generate-crud)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM](https://nodei.co/npm/api-platform-generate-crud.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/api-platform-generate-crud/)

## Features

* Generate high-quality ES6 components and files built with [React](https://facebook.github.io/react/), [Redux](http://redux.js.org), [React Router](https://reacttraining.com/react-router/) and [Redux Form](http://redux-form.com/) including:
  * A list view
  * A creation form
  * An edition form
  * A deletion button
* Use the Hydra API documentation to generate the code
* Generate the suitable HTML5 input type (`number`, `date`...) according to the type of the API property
* Display of the server-side validation errors under the related input (if using API Platform Core)
* Client-side validation (`required` attributes)
* The generated HTML is compatible with [Bootstrap](https://getbootstrap.com/) and include mandatory classes
* The generated HTML code is accessible to people with disabilities ([ARIA](https://www.w3.org/WAI/intro/aria) support)
* The Redux and the React Router configuration is also generated

## Documentation

The documentation of API Platform CRUD Generator can be browsed [on the docs repository](https://github.com/api-platform/docs/blob/master/index.md#api-platform-crud-generator-scaffold-a-reactredux-app-with-crud-features).

## Credits

Created by [Kévin Dunglas](https://dunglas.fr). Sponsored by [Les-Tilleuls.coop](https://les-tilleuls.coop).
Commercial support available upon request.
