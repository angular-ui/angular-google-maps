_ = require 'lodash'
pkg = require '../package.json'
pkg.nextVersion = do ->
  # note this will fail on new minor or major releases.. oh well manually fix it
  # for now as this is mainly for changelog
  last = _.last pkg.version.split('.')
  next = Number(last) + 1
  pkg.version.replace(last, String(next))

module.exports = pkg
