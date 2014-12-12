log = require('util').log
jasmineSettings = require './jasmine'
_ = require 'lodash'

pipeline = [
  "src/coffee/module"
  "src/coffee/providers/*"
  "src/coffee/extensions/*"
  "src/coffee/directives/api/utils/*"
  "src/coffee/directives/api/managers/*"

  "src/coffee/controllers/polyline-display"
  "src/coffee/utils/*"

  "src/coffee/directives/api/options/**/*"
  "src/coffee/directives/api/models/child/*"
  "src/coffee/directives/api/models/parent/*"
  "src/coffee/directives/api/*"
  "src/coffee/directives/map"
  "src/coffee/directives/marker"
  "src/coffee/directives/markers"
  "src/coffee/directives/label"
  "src/coffee/directives/polygon"
  "src/coffee/directives/circle"
  "src/coffee/directives/polyline*"
  "src/coffee/directives/rectangle"
  "src/coffee/directives/window"
  "src/coffee/directives/windows"
  "src/coffee/directives/layer"
  "src/coffee/directives/control"
  "src/coffee/directives/*"
]

concatDist =
  options:
    banner: """
    /*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>
     *  <%= pkg.description %>
     *  <%= pkg.repository.type %>: <%= pkg.repository.url %>
     */
    ;
    (function( window, angular, undefined ){
      'use strict';
    """
    separator: ";"
    footer: "}( window,angular));"
  src: pipeline.map( (f) -> "tmp/#{f}.js").concat [
    "tmp/wrapped_uuid.js"
    "tmp/wrapped_libs.js"
    "tmp/webpack.dataStructures.js"
    "src/js/**/*.js" #this all will only work if the dependency orders do not matter
    "src/js/**/**/*.js"
    "src/js/**/**/**/*.js"
    "!src/js/wrapped/webpack/*.js"
    "!src/js/wrapped/*.js"
  ]
  dest: "dist/<%= pkg.name %>.js"

clone = (obj) ->
  _.extend {}, obj

concatDistMapped = clone concatDist
concatDistMapped.options = _.extend clone(concatDist.options),
  sourceMap: true
  sourceMapName: "dist/<%= pkg.name %>_dev_mapped.js.map"
concatDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.js"

uglifyDist=
  options:
    banner: "/*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"
    compress: true
    report: "gzip"
  src: "dist/<%= pkg.name %>.js"
  dest: "dist/<%= pkg.name %>.min.js"

uglifyDistMapped = clone uglifyDist
uglifyDistMapped.options = _.extend clone(uglifyDistMapped.options),
  sourceMap: true
  sourceMapName: "dist/<%= pkg.name %>_dev_mapped.min.js.map"
uglifyDistMapped.src =  "dist/<%= pkg.name %>_dev_mapped.js"
uglifyDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.min.js"

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
        expand: true,
        flatten: false,
        src: pipeline.map (f) -> f + '.coffee'
        dest: 'tmp/'
        ext: '.js'

      specs:
        expand: true,
        flatten: false,
        src: [
        #specs
          "spec/coffee/bootstrap.coffee"
          "spec/coffee/helpers/*.coffee"
          "spec/coffee/usage/*.coffee"
          "spec/coffee/directives/api/*.coffee"
          "spec/coffee/providers/*.coffee"
          "spec/coffee/directives/api/models/child/*.coffee"
          "spec/coffee/directives/api/models/parent/*.coffee"
          "spec/coffee/directives/api/options/**/*.coffee"
          "spec/coffee/directives/api/utils/*.coffee"
        ]
        dest: "tmp/"
        ext: '.spec.js'

    concat:
      dist: concatDist
      distMapped: concatDistMapped
      libs:
        src: ["curl_components/**/*.js"]
        dest: "tmp/libs.js"
    copy:
      dist:
        files: [
        ]
    # libraries that are not versioned well, not really on bower, not on a cdn yet
      poorly_managed_dev__dep_bower_libs:
        files: [
          src: ["bower_components/bootstrap-without-jquery/bootstrap3/bootstrap-without-jquery.js"]
          dest: "website_libs/dev_deps.js"
        ]

    uglify:
      dist: uglifyDist
      distMapped: uglifyDistMapped

    jshint:
      all: ["Gruntfile.js", "temp/spec/js/*.js", "temp/spec/js/**/*.js", "temp/spec/js/**/**/*.js",
        "src/js/**/*.js", "src/js/**/**/*.js", "src/js/**/**/**/*.js", "!src/js/wrapped/*.js"
      ]

    test: {}
    watch:
      offline:
        options:
          livereload: true

        files: [
          "src/coffee/*.coffee", "src/coffee/**/*.coffee", "src/coffee/**/**/*.coffee",
          "src/js/*.js", "src/js/**/*.js", "src/js/**/**/*.js", "spec/**/*.spec.coffee", "spec/coffee/helpers/**"#,
          #"example/**"
        ]
        tasks: ['default-no-specs']
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
      consoleSpec: jasmineSettings.consoleSpec

    replace:
      utils:
        options:
          patterns: [
            match: 'REPLACE_W_LIBS', replacement: '<%= grunt.file.read("tmp/libs.js") %>'
          ]
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

    curl: require './curl-deps'
    verbosity:
      quiet:
        options: mode: 'dot'
        tasks: ['coffee', 'clean', 'cleam:dist', 'copy', 'concat', 'jasmineSettings',
          'mkdir:all', 'jshint', 'uglify', 'replace', 'concat:dist', 'concat:libs']

    # for  commonjs libraries that need to be rolled in
    webpack:
      commonjsDeps:
        entry:
          dataStructures: "./src/js/wrapped/webpack/data-structures.js",
        output:
          #Make sure to use [name] or [id] in output.filename
          path: "tmp/"
          filename: "webpack.[name].js",

  options.jasmine.coverage = jasmineSettings.coverage if jasmineSettings.coverage
  return options
