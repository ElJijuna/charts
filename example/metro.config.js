const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const { name, peerDependencies } = require('../package.json');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];

const escapeForRegExp = (value) => value.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&');
const singletons = Object.keys(peerDependencies);

config.resolver.blockList = [
  ...[config.resolver.blockList].flat().filter(Boolean),
  ...singletons.map(
    (dependency) =>
      new RegExp(`^${escapeForRegExp(path.join(root, 'node_modules', dependency))}\\/.*$`),
  ),
];

config.resolver.extraNodeModules = {
  [name]: root,
  ...Object.fromEntries(
    singletons.map((dependency) => [dependency, path.join(__dirname, 'node_modules', dependency)]),
  ),
};

module.exports = config;
