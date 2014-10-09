module.exports =
  dest :'dist/vendor/'
  fonts_dest: 'dist/vendor/fonts'
  js_dest: 'dist/vendor/scripts'
  css_dest: 'dist/vendor/styles'
  options:
    keepExpandedHierarchy: false
    packageSpecific:
      bootstrap:
        keepExpandedHierarchy: false
        files: [
          'dist/css/bootstrap.min.css'
          'dist/js/bootstrap.min.js'
          'dist/fonts/*'
        ]
      highlightjs:
        keepExpandedHierarchy: false
        files: [
          'highlight.pack.js'
          'styles/monokai_sublime.css'
        ]
