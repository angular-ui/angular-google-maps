# configurable paths
yeomanConfig =
  app: 'app'
  dist: 'dist'

try
  yeomanConfig.app = require('../bower.json').appPath or yeomanConfig.app

module.exports = yeomanConfig
