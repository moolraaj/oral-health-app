const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const config = {
  resolver: {
    extraNodeModules: {
 
      '@babel/runtime': path.resolve(__dirname, 'node_modules', '@babel/runtime'),
    },
  },
  watchFolders: [
    path.resolve(__dirname, 'node_modules'),  
    path.resolve(__dirname, '../../..'),  
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
