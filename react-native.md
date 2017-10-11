# React Native generator

Create a React Native application using  [Create React Native App](https://github.com/react-community/create-react-native-app):

    $ create-react-native-app my-app
    $ cd my-app
    
Install React Native Elements, React Native Router Flux , Redux, React Redux, Redux Form and Redux Thunk (to handle AJAX requests):

    $ yarn add react-native-elements react-native-router-flux react-native-elements redux react-redux redux-thunk redux-form prop-types
    
Install the generator globally:

    $ yarn global add @api-platform/client-generator

In the app directory, generate the files for the resource you want:

    $ generate-api-platform-client https://demo.api-platform.com src/ -g react-native --resource foo
    # Replace the URL by the entrypoint of your Hydra-enabled API
    # Omit the resource flag to generate files for all resource types exposed by the API

The code is ready to be executed! Register the generated reducers and components in the `App.js` file, here is an example:

```javascript

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

```


Previous chapter: [React](react.md)

Next chapter: [Vue.js generator](vuejs.md)
