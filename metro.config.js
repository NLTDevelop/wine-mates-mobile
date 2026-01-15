const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    ...defaultConfig.resolver,
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return middleware(req, res, next);
      };
    },
  },
  watcher: {
    watchman: {
      deferStates: ['hg.update'],
    },
    healthCheck: {
      enabled: true,
    },
  },
  watchFolders: [__dirname],
  maxWorkers: 2,
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);
