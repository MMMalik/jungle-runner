const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  bail: true,
  setupFiles: ['jest-canvas-mock'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
};
