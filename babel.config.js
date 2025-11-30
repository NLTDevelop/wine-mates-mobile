module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@assets': './assets',
        },
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    'react-native-worklets/plugin',
  ],
  env: {
    production: {
      plugins: ['babel-plugin-transform-remove-console'],
    },
  },
};
