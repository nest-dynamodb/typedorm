module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  coverageThreshold: {
    global: {
        lines: 90,
    },
},
  rootDir: 'lib',
  testRegex: '/lib/.*\\.spec\\.(ts|js)$',
  preset: 'ts-jest',
};