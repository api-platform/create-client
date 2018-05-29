module.exports = {
    'env': {
        'es6': true,
        'jest': true,
        'node': true,
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaVersion': 7,
        'sourceType': 'module'
    },
    'plugins': ['import'],
    'extends': [
        'plugin:prettier/recommended',
        'eslint:recommended',
    ],
    'rules': {
        'prettier/prettier': 'error',
        'no-console': 0,
    }
};
