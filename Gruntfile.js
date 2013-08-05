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
  
  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    clean: {
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
    
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/module.js',
              'src/utils/LatLngArraySync.js',
              'src/utils/MapEvents.js',
              'src/directives/map.js', 
              'src/directives/marker.js', 
              'src/directives/polyline.js',
              'src/directives/window.js',
              'src/directives/trafficlayer.js'],
        dest: 'tmp/output.js'
      },
      example: {
        src: ['src/module.js',
              'src/utils/LatLngArraySync.js',
              'src/utils/MapEvents.js',
              'src/directives/map.js', 
              'src/directives/marker.js', 
              'src/directives/polyline.js',
              'src/directives/window.js',
              'src/directives/trafficlayer.js'],
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
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    
    test: {
      
    },
    
    watch: {
      all: {
        options: { livereload: true },
        files: ['src/**/*.js'],
        tasks: ['clean:example', 'concat:example']
      }
    },
    
    open: {
      example: {
        path: 'http://localhost:3000/example.html'
      }
    },
    
    connect: {
      server: {
        options: {
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
