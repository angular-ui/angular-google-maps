module.exports = (grunt) ->
    # Load the required plugins
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-contrib-jshint"
    grunt.loadNpmTasks "grunt-contrib-concat"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-contrib-connect"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-open"
    grunt.loadNpmTasks "grunt-mkdir"
    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-jasmine"
    grunt.loadNpmTasks "grunt-template-jasmine-requirejs"
    grunt.loadNpmTasks "grunt-template-jasmine-istanbul"

    # Project configuration.
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        clean:
            coffee: ["tmp/output_coffee.js", "tmp"]
            dist: ["dist/*", "tmp"]
            example: ["example/<%= pkg.name %>.js"]

        mkdir:
            all:
                options:
                    mode: 0o0700
                    create: ["tmp"]

        coffee:
            compile:
                files:
                    "tmp/output_coffee.js": ["src/coffee/module.coffee", "src/coffee/ng-gmap-module.coffee",
                                             "src/coffee/controllers/polyline-display.js",
                                             "src/coffee/utils/LatLngArraySync.coffee", "src/coffee/utils/MapEvents.coffee",
                                             "src/coffee/oo/base-object.coffee", "src/coffee/directives/api/managers/*.coffee",
                                             "src/coffee/directives/api/utils/*.coffee", "src/coffee/directives/api/models/child/*.coffee",
                                             "src/coffee/directives/api/models/parent/*.coffee", "src/coffee/directives/api/*.coffee",
                                             "src/coffee/directives/map.coffee", "src/coffee/directives/marker.coffee",
                                             "src/coffee/directives/markers.coffee", "src/coffee/directives/label.coffee",
                                             "src/coffee/directives/polygon.coffee", "src/coffee/directives/polyline.coffee",
                                             "src/coffee/directives/window.coffee", "src/coffee/directives/windows.coffee",
                                             "src/coffee/directives/layer.coffee"]

                #specs
                    "tmp/spec/js/helpers/helpers.js": "spec/coffee/helpers/*.coffee"
                    "tmp/spec/js/ng-gmap-module.spec.spec.js": "spec/coffee/ng-gmap-module.spec.coffee"
                    "tmp/spec/js/oo/oo.spec.js": "spec/coffee/oo/*.spec.coffee"
                    "tmp/spec/js/directives/api/apis.spec.js": "spec/coffee/directives/api//*.spec.coffee"
                    "tmp/spec/js/directives/api/models/child/children.spec.js": "spec/coffee/directives/api/models/child/*.spec.coffee"
                    "tmp/spec/js/directives/api/models/parent/parents.spec.js": "spec/coffee/directives/api/models/parent/*.spec.coffee"
                    "tmp/spec/js/directives/api/utils/async-processor.spec.js": "spec/coffee/directives/api/utils/async-processor.spec.coffee"

        concat:
            options:
                separator: ";"

            dist:
                src: ["tmp/output_coffee.js", "lib/markerclusterer.js", "lib/markerwithlabel.js"]
                dest: "tmp/output.js"

            example:
                src: ["dist/angular-google-maps.js"]
                #src: ['dist/angular-google-maps.min.js'], //use min for release, otherwise other for testing
                dest: "example/<%= pkg.name %>.js"

        copy:
            options:
                banner: "/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"

            dist:
                files: [
                    src: "tmp/output.js"
                    dest: "dist/<%= pkg.name %>.js"
                ]

        uglify:
            options:
                banner: "/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"
                compress: true
                report: "gzip"

            dist:
                src: "tmp/output.js"
                dest: "dist/<%= pkg.name %>.min.js"

        jshint:
            all: ["Gruntfile.js", "src/js/**/*.js", "spec/js/**/*.js", "temp/spec/js/*.js", "temp/spec/js/**/*.js", "temp/spec/js/**/**/*.js"]
            options:
                ignores: ["src/js/utils/markerclusterer-2.0.16.js", "src/js/utils/markerwithlabel-1.1.9.js"]

        test: {}
        watch:
            all:
                options:
                    livereload: true

                files: ["src/js/**/*.js", "src/coffee/**/*.coffee", "src/coffee/*.coffee",
                        "tmp/spec/**/*.js", "tmp/spec/*.js", "tmp/spec/**/***/.js"]
                tasks: ["clean:example", "coffee", "concat:example", "jasmine:pivotal:build"]

        open:
            example:
                path: "http://localhost:3000/example/example.html"

            version:
                path: "http://localhost:3000/package.json"

            jasmine:
                path: "http://localhost:8080/_SpecRunner.html"

        connect:
            server:
                options:
                    hostname: "0.0.0.0"
                    port: 3000
                    base: ""

            jasmineServer:
                options:
                    hostname: "0.0.0.0"
                    port: 8080
                    base: ""

        jasmine:
            taskName:
                src: ["dist/angular-google-maps.js"]
                options:
                    keepRunner: true
                    vendor: ["http://maps.googleapis.com/maps/api/js?sensor=false&language=en", "lib/jquery.js",
                             "lib/angular.js", "lib/angular-mock.js", "lib/underscore.js", "dist/angular-google-maps.js"]
                    specs: ["spec/*.spec.js", "spec/**/*.spec.js", "spec/**/**/*-spec.js", "spec/**/**/**/*.spec.js",
                            "tmp/spec/js/*/spec.js", "tmp/spec/**/*.spec.js", "tmp/spec/**/**/*-spec.js",
                            "tmp/spec/**/**/**/*.spec.js"]
                    helpers: ["tmp/spec/js/helpers/helpers.js"]
                    template: require("grunt-template-jasmine-istanbul", "grunt-template-jasmine-requirejs")
                    templateOptions:
                        coverage: "spec/coverage/coverage.json"
                        report: "spec/coverage"
                        thresholds:
                            lines: 25
                            statements: 25
                            branches: 5
                            functions: 25


    # Default task: build a release in dist/
    grunt.registerTask "spec", ["clean:dist", "jshint", "mkdir", "coffee", "concat:dist", "copy:dist",
                                "connect:jasmineServer", "uglify", "open:jasmine", "watch", "jasmine"]

    # Default task: build a release in dist/
    grunt.registerTask "default", ["clean:dist", "jshint", "mkdir", "coffee", "concat:dist", "copy:dist",
                                   "uglify", "jasmine"]

    # Run the example page by creating a local copy of angular-google-maps.js
    # and running a webserver on port 3000 with livereload. Web page is opened
    # automatically in the default browser.
    grunt.registerTask "example", ["clean:example", "concat:example", "connect:server", "open:example", "watch"]