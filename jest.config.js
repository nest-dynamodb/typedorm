jest.config.jsrequire('ts-node/register');

module.exports = {
  'moduleFileExtensions': [
    'js',
    'json',
    'ts',
  ],
  'rootDir': 'lib',
  'testRegex': '/lib/.*\\.spec\\.(ts|js)$',
  'preset': 'ts-jest',
};