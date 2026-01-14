module.exports = {
    root: true,
    extends: [
        '@react-native',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    plugins: ['react', 'react-hooks', 'import', 'unused-imports'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    settings: {
        react: {
            version: 'detect',
            jsxRuntime: 'automatic',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                paths: ['src'],
            },
            alias: {
                map: [['@', './src']],
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            },
        },
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-unresolved': 'off',
    },
};
