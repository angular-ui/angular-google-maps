log = require('util').log
_ = require 'lodash'
_pkg = require '../package.json'

_pkg.nextVersion = do ->
  # note this will fail on new minor or major releases.. oh well manually fix it
  # for now as this is mainly for changelog
  last = _.last _pkg.version.split('.')
  next = Number(last) + 1
  _pkg.version.replace(last, String(next))

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

# configs for concat main distribution & dev mapping
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
    "tmp/wrapped_gmaps_sdk_util_v3.js"
    "tmp/webpack.dataStructures.js"
    "tmp/wrapped_marker_spiderfier.js"
    "src/js/**/*.js" #this all will only work if the dependency orders do not matter
    "src/js/**/**/*.js"
    "src/js/**/**/**/*.js"
    "!src/js/wrapped/webpack/*.js"
    "!src/js/wrapped/*.js"
  ]
  dest: "dist/<%= pkg.name %>.js"

concatDistMapped = _.cloneDeep concatDist
concatDistMapped.options.sourceMap = true
concatDistMapped.options.sourceMap = "dist/<%= pkg.name %>_dev_mapped.js.map"
concatDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.js"

# configs for concat street view directive & dev mapping
concatStreetView = _.cloneDeep concatDist
concatStreetView.src = [
  "src/coffee/module"
  "wrapped_uuid"
  "src/coffee/providers/map-loader"
  "src/coffee/directives/api/utils/logger"
  "src/coffee/directives/api/utils/gmap-util"
  "src/coffee/directives/api/utils/events-helper"
  "src/coffee/directives/street-view-panorama"
].map( (f) -> "tmp/#{f}.js" )
concatStreetView.dest = "dist/<%= pkg.name %>-street-view.js"
concatStreetViewMapped = _.cloneDeep concatStreetView
concatStreetViewMapped.options.sourceMap = true
concatStreetViewMapped.options.sourceMapName = "dist/<%= pkg.name %>-street-view_dev_mapped.js.map"
concatStreetViewMapped.dest = "dist/<%= pkg.name %>-street-view_dev_mapped.js"


# configs for uglify main distribution & dev mapping
uglifyDist=
  options:
    banner: "/*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"
    compress: true
    report: "gzip"
  src: "dist/<%= pkg.name %>.js"
  dest: "dist/<%= pkg.name %>.min.js"

uglifyDistMapped = _.cloneDeep uglifyDist
uglifyDistMapped.options.sourceMap = true
uglifyDistMapped.options.sourceMap = "dist/<%= pkg.name %>_dev_mapped.min.js.map"
uglifyDistMapped.src =  "dist/<%= pkg.name %>_dev_mapped.js"
uglifyDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.min.js"

# configs for uglify street view directive & dev mapping
uglifyStreetView = _.cloneDeep uglifyDist
uglifyStreetView.src = "dist/<%= pkg.name %>-street-view.js"
uglifyStreetView.dest = "dist/<%= pkg.name %>-street-view.min.js"
uglifyStreetViewMapped = _.cloneDeep uglifyStreetView
uglifyStreetViewMapped.options.sourceMap = true
uglifyStreetViewMapped.options.sourceMapName = "dist/<%= pkg.name %>-street-view_dev_mapped.min.js.map"
uglifyStreetViewMapped.src =  "dist/<%= pkg.name %>-street-view_dev_mapped.js"
uglifyStreetViewMapped.dest = "dist/<%= pkg.name %>-street-view_dev_mapped.min.js"


module.exports = (grunt) ->
  options =
  # Project configuration.
    bump:
      options:
        files: ['package.json', 'bower.json']
        updateConfigs: []
        commit: true
        commitMessage: "Release %VERSION%"
        commitFiles: ['package.json', 'bower.json', 'CHANGELOG.md',
          'Gruntfile.coffee', 'dist/angular-google-maps*','dist/architecture/*']
        createTag: true
        tagName: "%VERSION%"
        tagMessage: "Version %VERSION%"
        push: false
        pushTo: "origin"
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d"
        prereleaseName: 'X'

    pkg: _pkg
    pkgFn: ->
      grunt.file.readJSON("package.json") #always get latest!
    clean:
      coffee: ["tmp/output_coffee.js", "tmp"]
      dist: ["dist/*", "tmp"]
      example: ["example/<%= pkg.name %>.js"]
      spec: ["_Spec*"]
      streetview: ["dist/*street-view*"]

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

    concat:
      dist: concatDist
      distMapped: concatDistMapped
      libs:
        src: ["curl_components/**/*.js"]
        dest: "tmp/gmaps_sdk_util_v3.js"
      streetview: concatStreetView
      streetviewMapped: concatStreetViewMapped
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
      streetview: uglifyStreetView
      streetviewMapped: uglifyStreetViewMapped

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
          "src/js/*.js", "src/js/**/*.js", "src/js/**/**/*.js", "spec/**/*.spec.coffee",
          "spec/coffee/helpers/**", "spec/coffee/bootstrap.coffee"
          #"example/**"
        ]
        tasks: ["fast"]
      spec:
        options:
          livereload: true

        files: ["src/coffee/**/*.coffee"]
        tasks: ["karma"]

    open:
    #examples replaced by lookup via allExamplesOpen see below
      version:
        path: "http://localhost:3100/package.json"

      coverage:
        path: "http://localhost:8069/dist/coverage/dist/index.html"

    connect:
      server:
        options:
          hostname: "0.0.0.0"
          port: 3100
          base: ""

      coverage:
        options:
          hostname: "0.0.0.0"
          port: 8069
          base: ""

    replace:
      utils:
        options:
          patterns: [
            match: 'REPLACE_W_LIBS', replacement: '<%= grunt.file.read("tmp/gmaps_sdk_util_v3.js") %>'
          ]
        src: 'src/js/wrapped/google-maps-util-v3.js'
        dest: 'tmp/wrapped_gmaps_sdk_util_v3.js'
      uuid:
        options:
          patterns: [
            match: 'REPLACE_W_LIBS',
            replacement: '<%= grunt.file.read("bower_components/uuid/dist/uuid.core.js") %>'
          ]
        src: 'src/js/wrapped/uuid.core.js'
        dest: 'tmp/wrapped_uuid.js'
      markerSpiderfier:
        options:
          patterns: [
            match: 'REPLACE_W_LIBS',
            replacement: '<%= grunt.file.read("bower_components/OverlappingMarkerSpiderfier/dist/oms.js") %>'
          ]
        src: 'src/js/wrapped/marker_spiderfier.js'
        dest: 'tmp/wrapped_marker_spiderfier.js'

    curl: require './curl-deps'
    verbosity:
      quiet:
        options: mode: 'normal'
        tasks: ['coffee', 'clean', 'clean:dist', 'copy', 'concat', 'mkdir:all', 'jshint', 'uglify', 'replace', 'concat:dist', 'concat:libs']

    # for  commonjs libraries that need to be rolled in
    webpack:
      commonjsDeps:
        entry:
          dataStructures: "./src/js/wrapped/webpack/data-structures.js",
        output:
          #Make sure to use [name] or [id] in output.filename
          path: "tmp/"
          filename: "webpack.[name].js",

    changelog:
      options:
        version: _pkg.nextVersion

    angular_architecture_graph:
      diagram:
        files:
          "dist/architecture": ["dist/angular-google-maps.js"]

  return options
