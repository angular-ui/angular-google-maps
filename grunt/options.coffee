_ = require 'lodash'
_pkg = require './pkg'
requireDirectory = require 'require-directory'
allOptions = requireDirectory module, './options/'

#BEGIN append ./node_modules to our path for this process
#shamelessly copied from gulp-shell
#https://github.com/sun-zheng-an/gulp-shell/blob/825a24c214ce91027d535ca767df2cfe8745f1a3/index.js#L33-L36
path = require 'path'
pathToBin = path.join(process.cwd(), 'node_modules', '.bin')
pathName = if /^win/.test(process.platform) then 'Path' else 'PATH'
newPath = pathToBin + path.delimiter + process.env[pathName]
_.extend(process.env, _.fromPairs([[pathName, newPath]]))
#END adding node_modules to path

module.exports = (grunt) ->
  options =
    pkg: _pkg
    pkgFn: ->
      grunt.file.readJSON("package.json") #always get latest!

  # coffeelint: disable=check_scope
  for key, val of allOptions
  # coffeelint: enable=check_scope
    _.extend options, val

  options
