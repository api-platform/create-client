module.exports = {
  'env': {
    'es6': true,
    'jest': true,
    'node': true,
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    ecmaVersion: 7,
    sourceType: 'module'
  },
  'plugins': ['import'],
  'extends': 'eslint:recommended',
  'rules':{
    'no-console': 0,
  }
};
