import ReactCrudGenerator from './generators/ReactCrudGenerator';
import ReactNativeCrudGenerator from './generators/ReactNativeCrudGenerator';
import TypescriptInterfaceGenerator from './generators/TypescriptInterfaceGenerator';

function wrap (cl) {
  return ({hydraPrefix, templateDirectory}) => new cl({hydraPrefix, templateDirectory})
}

function generators (generator = 'react') {
  switch (generator) {
    case 'react':
      return wrap(ReactCrudGenerator);
    case 'react-native':
      return wrap(ReactNativeCrudGenerator);
    case 'typescript':
      return wrap(TypescriptInterfaceGenerator);
  }
}

export default generators
