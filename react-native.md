# React Native generator

Create a React Native application using ???? [Facebook's Create React App](https://github.com/facebookincubator/create-react-app):

    $ create-react-app my-app ??????
    $ cd my-app
    
Install React Native Elements, React Native Router Flux , Redux, React Redux, Redux Form and Redux Thunk (to handle AJAX requests):

    $ yarn add react-native-elements react-native-router-flux react-native-elements redux react-redux redux-thunk redux-form react-router-dom react-router-redux prop-types
    
Install the generator globally:

    $ yarn global add @api-platform/client-generator

In the app directory, generate the files for the resource you want:

    $ generate-api-platform-client https://demo.api-platform.com src/ -g react-native --resource foo
    # Replace the URL by the entrypoint of your Hydra-enabled API
    # Omit the resource flag to generate files for all resource types exposed by the API


Previous chapter: [Introduction](react.md)

Next chapter: [Vue.js generator](vuejs.md)
