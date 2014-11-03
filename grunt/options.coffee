log = require('util').log
jasmineSettings = require './jasmine'
_ = require 'lodash'

module.exports = (grunt) ->
  options =
    # Project configuration.
    bump:
      options:
        files: ['package.json', 'bower.json']
        updateConfigs: []
        commit: true
        commitMessage: "Release %VERSION%"
        commitFiles: ['package.json', 'bower.json', 'Gruntfile.coffee', 'dist/*']
        createTag: true
        tagName: "%VERSION%"
        tagMessage: "Version %VERSION%"
        push: false
        pushTo: "origin"
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d"
    pkg: grunt.file.readJSON("package.json")
    pkgFn: ->
      grunt.file.readJSON("package.json") #always get latest!
    clean:
      coffee: ["tmp/output_coffee.js", "tmp"]
      dist: ["dist/*", "tmp"]
      example: ["example/<%= pkg.name %>.js"]
      spec: ["_Spec*"]

    mkdir:
      all:
        options:
          mode: 0o0700
          create: ["tmp"]

    coffee:
      compile:
        files:
          "tmp/output_coffee.js": [
            "src/coffee/extensions/string.coffee"
            "src/coffee/extensions/lodash.coffee"
            "src/coffee/module.coffee"
            "src/coffee/providers/*.coffee"
            "src/coffee/extensions/google.maps.coffee"
            "src/coffee/directives/api/utils/*.coffee"
            "src/coffee/directives/api/managers/*.coffee"

            "src/coffee/controllers/polyline-display.js"
            "src/coffee/utils/*.coffee"

            "src/coffee/directives/api/options/**/*.coffee"
            "src/coffee/directives/api/models/child/*.coffee"
            "src/coffee/directives/api/models/parent/*.coffee"
            "src/coffee/directives/api/*.coffee"
            "src/coffee/directives/map.coffee"
            "src/coffee/directives/marker.coffee"
            "src/coffee/directives/markers.coffee"
            "src/coffee/directives/label.coffee"
            "src/coffee/directives/polygon.coffee"
            "src/coffee/directives/circle.coffee"
            "src/coffee/directives/polyline*.coffee"
            "src/coffee/directives/rectangle.coffee"
            "src/coffee/directives/window.coffee"
            "src/coffee/directives/windows.coffee"
            "src/coffee/directives/layer.coffee"
            "src/coffee/directives/control.coffee"
            "src/coffee/directives/*.coffee"
          ]

        #specs
          "tmp/string.js":"src/coffee/extensions/string.coffee"#to load as a vendor prior to specs to not have ns changes in two spots
          "tmp/spec/js/bootstrap.js": "spec/coffee/bootstrap.coffee"
          "tmp/spec/js/helpers/helpers.js": "spec/coffee/helpers/*.coffee"
          "tmp/spec/js/ng-gmap-module.spec.js": "spec/coffee/ng-gmap-module.spec.coffee"
          "tmp/spec/js/usage/usage.spec.js": "spec/coffee/usage/*.spec.coffee"
          "tmp/spec/js/directives/api/apis.spec.js": "spec/coffee/directives/api/*.spec.coffee"
          "tmp/spec/js/providers/providers.spec.js": "spec/coffee/providers/*.spec.coffee"
          "tmp/spec/js/directives/api/models/child/children.spec.js": "spec/coffee/directives/api/models/child/*.spec.coffee"
          "tmp/spec/js/directives/api/models/parent/parents.spec.js": "spec/coffee/directives/api/models/parent/*.spec.coffee"
          "tmp/spec/js/directives/api/options/options.spec.js": "spec/coffee/directives/api/options/**/*.spec.coffee"
          "tmp/spec/js/directives/api/utils/utils.spec.js": "spec/coffee/directives/api/utils/*.spec.coffee"

    concat:
      options:
        banner: "/*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"
        separator: ";"

      dist:
        src: [
          "tmp/output_coffee.js"
          "tmp/wrapped_uuid.js"
          "tmp/wrapped_libs.js"
          "src/js/**/*.js" #this all will only work if the dependency orders do not matter
          "src/js/**/**/*.js"
          "src/js/**/**/**/*.js"
          "!src/js/wrapped/*.js"
        ]
        dest: "tmp/output.js"
      libs:
        src  : ["lib/*.js"]
        dest : "tmp/libs.js"

    copy:
      dist:
        files: [
          src: "tmp/output.js"
          dest: "dist/<%= pkg.name %>.js"
        ]
      # libraries that are not versioned well, not really on bower, not on a cdn yet
      poorly_managed_dev__dep_bower_libs:
        files: [
          src: ["bower_components/bootstrap-without-jquery/bootstrap3/bootstrap-without-jquery.js"]
          dest: "website_libs/dev_deps.js"
        ]

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"
        compress: true
        report: "gzip"

      dist:
        src: "tmp/output.js"
        dest: "dist/<%= pkg.name %>.min.js"

    jshint:
      all: ["Gruntfile.js", "temp/spec/js/*.js", "temp/spec/js/**/*.js", "temp/spec/js/**/**/*.js",
            "src/js/**/*.js", "src/js/**/**/*.js", "src/js/**/**/**/*.js", "!src/js/wrapped/*.js"
      ]

    test: {}
    watch:
      all:
        options:
          livereload: true

        files: [
          "src/coffee/*.coffee", "src/coffee/**/*.coffee", "src/coffee/**/**/*.coffee",
          "src/js/*.js", "src/js/**/*.js", "src/js/**/**/*.js", "spec/**/*.spec.coffee", "spec/coffee/helpers/**"#,
          #"example/**"
        ]
        tasks: ["fast"]
      spec:
        options:
          livereload: true

        files: ["src/coffee/**/*.coffee", "src/coffee/*.coffee", "src/coffee/**/**/*.coffee", "spec/**/*.spec.coffee",
                "spec/coffee/helpers/**"]
        tasks: ["fast"]

    open:
    #examples replaced by lookup via allExamplesOpen see below
      version:
        path: "http://localhost:3100/package.json"

      jasmine:
        path: "http://localhost:8069/_SpecRunner.html"

    connect:
      server:
        options:
          hostname: "0.0.0.0"
          port: 3100
          base: ""

      jasmineServer:
        options:
          hostname: "0.0.0.0"
          port: 8069
          base: ""
    changelog:
      options:
        dest: "CHANGELOG.md"

    jasmine:
      spec: jasmineSettings.spec

    replace:
      utils:
        options:
          patterns: [ match: 'REPLACE_W_LIBS', replacement: '<%= grunt.file.read("tmp/libs.js") %>']
        src: 'src/js/wrapped/google-maps-util-v3.js'
        dest: 'tmp/wrapped_libs.js'
      uuid:
        options:
          patterns: [
            match: 'REPLACE_W_LIBS',
            replacement: '<%= grunt.file.read("bower_components/uuid/dist/uuid.core.js") %>'
          ]
        src: 'src/js/wrapped/uuid.core.js'
        dest: 'tmp/wrapped_uuid.js'

    subgrunt:
      bluebird:
        projects: {}
#          'bower_components/bluebird': ["build","--features='core'"]

  options.jasmine.coverage = jasmineSettings.coverage if jasmineSettings.coverage
  return options
