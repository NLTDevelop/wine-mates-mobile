module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['babel-plugin-transform-remove-console'],
    },
  },
  plugins: [
    [
      "@babel/plugin-proposal-decorators", {
        "legacy": true
      }
    ],
    'react-native-worklets/plugin',
  ],
};
