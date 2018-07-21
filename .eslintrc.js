module.exports = {
    extends: 'standard',
    parser: 'typescript-eslint-parser',
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true
    },
    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
        ecmaFeatures: {}
    },
    rules: {
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'require-jsdoc': 'error',
        'curly': ['error', 'multi-or-nest'],
        'eqeqeq': ['error', 'always', {'null': 'ignore'}],
        'no-return-await': 'off',
        'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
        'space-before-function-paren': ['error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }]
    },
    overrides: {
        files: ['**/*.ts'],
        parser: 'typescript-eslint-parser',
        rules: {
            'no-undef': 'off'
        }
    }
};