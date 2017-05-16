# API Platform CRUD Generator

A generator to scaffold a React/Redux app with Create-Retrieve-Update-Delete features for any API exposing a Hydra documentation.
Works especially well with APIs built with the [API Platform](https://api-platform.com) framework.

[![Build Status](https://travis-ci.org/api-platform/generate-crud.svg?branch=master)](https://travis-ci.org/api-platform/generate-crud)

## Features

* Generate high-quality ES6 components and files built with [React](https://facebook.github.io/react/), [Redux](http://redux.js.org), [React Router](https://reacttraining.com/react-router/) and [Redux Form](http://redux-form.com/) including:
  * A list view
  * A creation form
  * An edition form
  * A deletion button
* Use the Hydra API documentation to generate the code
* Generate the appropriate HTML5 input type (`number`, `date`...) according to the type of the API property
* Display server-side validation errors under the related input (if using API Platform Core)
* Client-side validation (`required` attributes)
* The generated HTML is compatible with [Bootstrap](https://getbootstrap.com/) and include mandatory classes
* The generated HTML code is accessible to people with disabilities ([ARIA](https://www.w3.org/WAI/intro/aria) support)
* The Redux and the React Router configuration is also generated

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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux'

// Replace "foo" by the name of the resource type
import fooReducers from './reducers/foo/';
import fooRoutes from './routes/foo';

const store = createStore(
  combineReducers({routing, form, fooReducers}), // Don't forget to register the reducers here
  applyMiddleware(thunk),
);

const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        {fooRoutes}
        <Route render={() => <h1>Not Found</h1>}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
```

## TODO

* Add support for pagination
* Automatically normalize numbers
* Generate E2E tests
* Add a React Native generator

## Run tests

    $ yarn test
    $ yarn lint

## Credits

Created by [Kévin Dunglas](https://dunglas.fr). Sponsored by [Les-Tilleuls.coop](https://les-tilleuls.coop).
