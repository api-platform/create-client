import ReactCrudGenerator from './generators/ReactCrudGenerator';
import TypescriptInterfaceGenerator from './generators/TypescriptInterfaceGenerator';

function wrap (cl) {
  return ({hydraPrefix, templateDirectory}) => new cl({hydraPrefix, templateDirectory})
}

function generators (generator = 'react') {
  switch (generator) {
    case 'react':
      return wrap(ReactCrudGenerator);
    case 'typescript':
      return wrap(TypescriptInterfaceGenerator);
  }
}

export default generators
