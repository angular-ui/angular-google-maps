_ = require 'lodash'

vendor_js =
  src: [
    '<%= yeoman.dist %>/vendor/scripts/jquery.js'
    '<%= yeoman.dist %>/vendor/scripts/lodash*'
    '<%= yeoman.dist %>/vendor/scripts/angular.js'
    '<%= yeoman.dist %>/vendor/scripts/bluebird.js'
    '<%= yeoman.dist %>/vendor/scripts/*.js'
    ]
  dest:
    '<%= yeoman.dist %>/scripts/vendor.js'

vendor_css =
  src: ['<%= yeoman.dist %>/vendor/styles/*']
  dest: '<%= yeoman.dist %>/styles/vendor.css'


module.exports =
  vendor_js: vendor_js
  vendor_app_js:
    _.merge _.cloneDeep(vendor_js),
      dest: '<%= yeoman.app %>/scripts/vendor.js'

  vendor_css: vendor_css
  vendor_app_css:
    _.merge _.cloneDeep(vendor_css),
      dest: '<%= yeoman.app %>/styles/vendor.css'
