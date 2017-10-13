module.exports = {
    extends: 'google',
    parser: 'typescript-eslint-parser',
    env: {
        commonjs: true,
        es6: true,
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
        'yoda': 'error',
        'space-infix-ops': 'error',
        'switch-colon-spacing': ['error', {'before': false, 'after': true}],
        'key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],
        'eqeqeq': ['error', 'always', {'null': 'ignore'}],
        'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
        'keyword-spacing': ['error', {'before': true, 'after': true}],
        'arrow-spacing': ['error', {'before': true, 'after': true}],
        'brace-style': ['error', 'stroustrup'],
        'object-curly-spacing': ['error', 'never', {'objectsInObjects': false, 'arraysInObjects': false}],
        'space-before-function-paren': ['error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }]
    },
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
        ecmaFeatures: {}
    }
};