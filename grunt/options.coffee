_ = require 'lodash'
yeomanConfig = require './yeoman_options'

LIVERELOAD_PORT = 35729
lrSnippet = require('connect-livereload')(port: LIVERELOAD_PORT)

mountFolder = (connect, dir) ->
  connect.static require('path').resolve(dir)

module.exports =
  yeoman: yeomanConfig
  watch:
    coffee:
      files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee']
      tasks: ['coffee:dist']

    coffeeTest:
      files: ['test/spec/{,*/}*.coffee']
      tasks: ['coffee:test']

    styles:
      files: ['<%= yeoman.app %>/styles/{,*/}*.css']
      tasks: [
        'copy:styles'
        'autoprefixer'
      ]

    livereload:
      options:
        livereload: LIVERELOAD_PORT

      files: [
        '<%= yeoman.app %>/{,*/}*.html'
        '<%= yeoman.app %>/{,*/}*.json'
        '.tmp/styles/{,*/}*.css'
        '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'
        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
      ]

  autoprefixer:
    options: ['last 1 version']
    dist:
      files: [
        expand: true
        cwd: '.tmp/styles/'
        src: '{,*/}*.css'
        dest: '.tmp/styles/'
      ]

  connect:
    options:
      port: 9013
      hostname: '0.0.0.0'

    livereload:
      options:
        middleware: (connect) ->
          [
            lrSnippet
            mountFolder(connect, '.tmp')
            mountFolder(connect, yeomanConfig.app)
          ]

    test:
      options:
        middleware: (connect) ->
          [
            mountFolder(connect, '.tmp')
            mountFolder(connect, 'test')
          ]

    dist:
      options:
        middleware: (connect) ->
          [mountFolder(connect, yeomanConfig.dist)]

  open:
    server:
      url: 'http://localhost:<%= connect.options.port %>'

  clean:
    dist:
      files: [
        dot: true
        src: [
          'app/scripts/vendor.js'
          'app/styles/vendor.css'
          '.tmp'
          '<%= yeoman.dist %>/*'
          '!<%= yeoman.dist %>/.git*'
        ]
      ]

    server: '.tmp'

  jshint:
    options:
      jshintrc: '.jshintrc'

    all: [
      'Gruntfile.js'
      '<%= yeoman.app %>/scripts/{,*/}*.js'
    ]

  coffee:
    options:
      sourceMap: true
      sourceRoot: ''

    dist:
      files: [
        expand: true
        cwd: '<%= yeoman.app %>/scripts'
        src: '{,*/}*.coffee'
        dest: '.tmp/scripts'
        ext: '.js'
      ]

    test:
      files: [
        expand: true
        cwd: 'test/spec'
        src: '{,*/}*.coffee'
        dest: '.tmp/spec'
        ext: '.js'
      ]

  concat: require './concat'

  rev:
    dist:
      files:
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js'
          '<%= yeoman.dist %>/styles/{,*/}*.css'
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}' #,
#            '<%= yeoman.dist %>/styles/fonts/*'
        ]

  useminPrepare:
    html: '<%= yeoman.app %>/index.html'
    options:
      dest: '<%= yeoman.dist %>'

  usemin:
    html: [
      '<%= yeoman.dist %>/{,*/}*.html'
      '<%= yeoman.dist %>/views/*.html'
      '<%= yeoman.dist %>/views/**/**/*.html'
    ]
    css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
    options:
      dirs: ['<%= yeoman.dist %>']

  imagemin:
    dist:
      files: [
        expand: true
        cwd: '<%= yeoman.app %>/images'
        src: '{,*/}*.{png,jpg,jpeg}'
        dest: '<%= yeoman.dist %>/images'
      ]

  svgmin:
    dist:
      files: [
        expand: true
        cwd: '<%= yeoman.app %>/images'
        src: '{,*/}*.svg'
        dest: '<%= yeoman.dist %>/images'
      ]

  htmlmin:
    dist:
      options: {}

    #removeCommentsFromCDATA: true,
    #          // https://github.com/yeoman/grunt-usemin/issues/44
    #          //collapseWhitespace: true,
    #          collapseBooleanAttributes: true,
    #          removeAttributeQuotes: true,
    #          removeRedundantAttributes: true,
    #          useShortDoctype: true,
    #          removeEmptyAttributes: true,
    #          removeOptionalTags: true
      files: [
        expand: true
        cwd: '<%= yeoman.app %>'
        src: [
          '*.html'
          'views/*.html'
          'views/**/**/*.html'
        ]
        dest: '<%= yeoman.dist %>'
      ]


# Put files not handled in other tasks here
  copy:
    dist:
      files: [
        {
          expand: true
          dot: true
          cwd: '<%= yeoman.app %>'
          dest: '<%= yeoman.dist %>'
          src: [
            '*.{ico,png,txt,json}'
            '.htaccess'
            'CNAME'
            'sitemap.xml'
            'images/{,*/}*.{gif,webp}'
            'styles/fonts/*'
            'views/examples/{,*/}*.*'
          ]
        }
        {
          expand: true
          cwd: '.tmp/images'
          dest: '<%= yeoman.dist %>/images'
          src: ['generated/*']
        }
      ]

    styles:
      expand: true
      cwd: '<%= yeoman.app %>/styles'
      dest: '.tmp/styles/'
      src: '{,*/}*.css'

    vendor_fonts:
      expand: true
      cwd: '<%= yeoman.dist %>/vendor/fonts'
      dest: '<%= yeoman.dist %>/styles/fonts'
      src: '*'

  concurrent:
    server: [
      'coffee:dist'
      'copy:styles'
    ]
    test: [
      'coffee'
      'copy:styles'
    ]
    dist: [
      'coffee'
      'copy:styles'
      'imagemin'
      'svgmin'
      'htmlmin'
    ]

  karma:
    unit:
      configFile: 'karma.conf.coffee'
      singleRun: true

#  cdnify:
#    dist:
#      html: [
#        '<%= yeoman.dist %>/*.html'
#        '<%= yeoman.dist %>/views/*.html'
#        '<%= yeoman.dist %>/views/**/**/*.html'
#      ]

  ngmin:
    dist:
      files: [
        expand: true
        cwd: '<%= yeoman.dist %>/scripts'
        src: '*.js'
        dest: '<%= yeoman.dist %>/scripts'
      ]

  uglify:
    dist:
      files:
        '<%= yeoman.dist %>/scripts/scripts.js': ['<%= yeoman.dist %>/scripts/scripts.js']
        '<%= yeoman.dist %>/scripts/vendor.js': ['<%= yeoman.dist %>/scripts/vendor.js']

  git_log_json:
    options:
      shortHash: true
      dest: '<%= yeoman.app %>/changelog.json'

  'gh-pages':
    options:
      base: 'dist'

    src: ['**']

  bower:
    dev:
      _.merge(require('./bower_options'),
        options:
          ignorePackages: ['angular-mocks','es5-shim','json3']
      )

    test:
      _.merge(require('./bower_options'),
        options:
          ignorePackages: ['angular-scenario','es5-shim','json3']
      )
