# API Platform CRUD Generator

A generator to scaffold a React/Redux app with Create-Retrieve-Update-Delete features for any API exposing a Hydra documentation.
Works especially well with APIs built with the [API Platform](https://api-platform.com) framework.

[![Build Status](https://travis-ci.org/api-platform/generate-crud.svg?branch=master)](https://travis-ci.org/api-platform/generate-crud)

## Features

* Generate a working ES6 application built with [React](https://facebook.github.io/react/), [Redux](http://redux.js.org), [React Router](https://reacttraining.com/react-router/) and [Redux Form](http://redux-form.com/)
* List
* Create form with appropriate form inputs depending of the documented type and client-side validation (required fields)
* Update form
* Errors handling
* Deletion
* [Bootstrap](https://getbootstrap.com/) support

## Installation and Usage

Create a React application using [Facebook's Create React App](https://github.com/facebookincubator/create-react-app):

    $ create-react-app my-app
    $ cd my-app

Install React Router, Redux, React Redux, React Router Redux, Redux Form and Redux Thunk (to handle AJAX requests):

    $ yarn add redux react-redux redux-thunk redux-form react-router-dom react-router-redux

Install the generator globally:

    $ yarn global add api-platform-generate-crud

Reference the Bootstrap CSS stylesheet in `public/index.html` (optional):

```html
  <!-- ... -->
    <title>React App</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  </head>
  <!-- ... -->
```

In the app directory, generate the files for the resource you want:

    $ api-platform-generate-crud http://localhost src/ --resource foo
    # Replace the URL by the entrypoint of your Hydra-enabled API
    # Omit the resource flag to generate files for all resource types exposed by the API

The code is ready to be executed! Register the generated reducers and components in the `index.js` file, here is an example:

```javascript
import React from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux'

// Replace "foo" by the name of your resource
import foo from './reducers/foo/';
import FooList from './components/foo/List';
import FooCreate from './components/foo/Create';
import FooUpdate from './components/foo/Update';

const store = createStore(
  combineReducers({routing, form, foo}),
  applyMiddleware(thunk),
);

const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        {/*Replace URLs and components accordingly*/}
        <Route exact={true} path='/foos/' component={FooList}/>
        <Route exact={true} path='/foos/create' component={FooCreate}/>
        <Route exact={true} path='/foos/edit/:id' component={FooUpdate}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
```

## TODO

* Add support for pagination
* Automatically normalize numbers
* Support the (proprietary) API Platform mechanism for field errors
* Generate E2E tests
* Add a React Native generator
* Add support for relations?

## Run tests

    $ yarn test
    $ yarn lint

## Credits

Created by [Kévin Dunglas](https://dunglas.fr). Sponsored by [Les-Tilleuls.coop](https://les-tilleuls.coop).
