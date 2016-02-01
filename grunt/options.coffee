_ = require 'lodash'
_pkg = require './pkg'
requireDirectory = require 'require-directory'
allOptions = requireDirectory module, './options/'

module.exports = (grunt) ->
  options =
    pkg: _pkg
    pkgFn: ->
      grunt.file.readJSON("package.json") #always get latest!

  for key, val of allOptions
    _.extend options, val

  options
