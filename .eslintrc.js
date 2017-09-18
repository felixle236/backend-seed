module.exports = {
    extends: 'google',
    parser: 'typescript-eslint-parser',
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true,
        node: true,
        mocha: true
    },
    rules: {
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'require-jsdoc': 'off',
        'valid-jsdoc': 'off',
        'max-len': 'off',
        'curly': 'off',
        'arrow-parens': 'off',
        'comma-dangle': 'off',
        'linebreak-style': 'off',
        'keyword-spacing': ['error', {'before': true, 'after': true}],
        'arrow-spacing': ['error', {'before': true, 'after': true}],
        'brace-style': ['error', 'stroustrup'],
        'object-curly-spacing': ['error', 'never', {'objectsInObjects': false, 'arraysInObjects': false}],
        'space-before-function-paren': ['error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }]
        // 'quotes': ['error', 'double']
    },
    parserOptions: {
        sourceType: 'module'
    }
};