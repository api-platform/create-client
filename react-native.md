React Native generator
======================

Create a React Native application using
[React Community's Create React Native App ](https://github.com/react-community/create-react-native-app)

```bash
$ create-react-native-app my-app
$ cd my-app
```

Install Redux, React Redux, Redux Thunk, Redux Form, React Native
Elements and React Native Router Flux

```bash
$ yarn add redux react-redux redux-thunk redux-form react-native-elements react-native-router-flux
```

Install the generator globally:

```bash
$ yarn global add @api-platform/client-generator
```

In the app directory, generate the files for the resource you want:

```
    $ generate-api-platform-client https://demo.api-platform.com src/ -g react-native --resource foo
    # Replace the URL by the entrypoint of your Hydra-enabled API
    # Omit the resource flag to generate files for all resource types exposed by the API
```


Create **Router.js** file to import all routes

```javascript
import React from 'react';
import {Router, Stack} from 'react-native-router-flux';

import bookRoutes from './routes/book'


const RouterComponent = () => {
  return (
    <Router>
      <Stack key="root" hideNavBar>
        {bookRoutes}
        ...
      </Stack>
    </Router>
  );
};

export default RouterComponent;
```
Change generated **App.js** content to:

```javascript
import React, {Component} from 'react';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk'
import {reducer as form} from 'redux-form';

import book from './src/reducers/book/';
import Router from './src/Router';

export default class App extends Component {
    render() {
        const store = createStore(
            combineReducers({
                form,
                book,
            }),
            compose(applyMiddleware(thunk)),
        );
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}

```



Previous chapter: [React](react.md)

Next chapter: [Vue.js generator](vuejs.md)
