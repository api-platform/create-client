import ReactCrudGenerator from './generators/ReactCrudGenerator';

function wrap (cl) {
  return (prefix) => new cl(prefix)
}

function generators (generator = 'react') {
  switch (generator) {
    case 'react':
      return wrap(ReactCrudGenerator)
  }
}

export default generators
