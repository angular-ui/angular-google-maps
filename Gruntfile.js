module.exports = function(grunt) {

  // Load the required plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-coffee');


  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      coffee: ['tmp/output_coffee.js'],
      dist: ['dist/*', 'tmp'],
      example: ['example/<%= pkg.name %>.js']
    },

    mkdir: {
      all: {
        options: {
          mode: 0700,
          create: ['tmp']
        }
      }
    },

    coffee: {
      compile: {
        files: {
          'tmp/output_coffee.js':
          ['src/coffee/*.coffee',
          'src/coffee/oo/ng-gmap-module.coffee',
          'src/coffee/oo/base-object.coffee',
          'src/coffee/directives/api/managers/*.coffee',
          'src/coffee/directives/api/utils/*.coffee',
          'src/coffee/directives/api/models/child/*.coffee',
          'src/coffee/directives/api/models/parent/*.coffee',
          'src/coffee/directives/api/*.coffee',
          'src/coffee/directives/*.coffee'] // concat then compile into single file
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/js/module.js',
              'tmp/output_coffee.js',
              'src/js/utils/markerclusterer-r438.js',
              'src/js/utils/LatLngArraySync.js', 
              'src/js/utils/MapEvents.js', 
              'src/js/controllers/polyline-display.js',
              'src/js/directives/map.js',
              'src/js/directives/marker.js',
              'src/js/directives/markers.js',
              'src/js/directives/polygon.js',
              'src/js/directives/polyline.js',
              'src/js/directives/window.js',
              'src/js/directives/windows.js',
              'src/js/directives/trafficlayer.js'],
        dest: 'tmp/output.js'
      },
      example: {
        src: ['dist/angular-google-maps.min.js'],
        dest: 'example/<%= pkg.name %>.js'
      }
    },

    copy: {
      dist: {
        files: [{
          src: 'tmp/output.js',
          dest: 'dist/<%= pkg.name %>.js'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n',
        compress: true,
        report: 'gzip'
      },
      dist: {
        src: 'tmp/output.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/js/**/*.js', 'test/js/**/*.js'],
      options: {ignores: ['src/js/utils/markerclusterer-r438.js']}
    },

    test: {

    },

    watch: {
      all: {
        options: { livereload: true },
        files: ['src/js/**/*.js','src/coffee/**/*.coffee','src/coffee/*.coffee'],
        tasks: ['clean:example','coffee','concat:example'],
      },
    },

    open: {
      example: {
        path: 'http://localhost:3000/example.html'
      }
    },

    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          port: 3000,
          base: 'example'
        }
      }
    }
  });

  grunt.registerTask('test', 'Execute unit tests', function () {
    grunt.log.writeln('TODO task not implemented yet');
  });

  // Default task: build a release in dist/
  grunt.registerTask('default', ['clean:dist',
                                 'test',
                                 'jshint',
                                 'mkdir',
                                 'coffee',
                                 'concat:dist',
                                 'copy:dist',
                                 'uglify']);

  // Run the example page by creating a local copy of angular-google-maps.js
  // and running a webserver on port 3000 with livereload. Web page is opened
  // automatically in the default browser.
  grunt.registerTask('example', ['clean:example',
                                 'concat:example',
                                 'connect:server',
                                 'open:example',
                                 'watch']);

};
