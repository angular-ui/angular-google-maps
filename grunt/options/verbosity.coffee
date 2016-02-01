module.exports =
  verbosity:
    quiet:
      options: mode: 'normal'
      tasks: [
        'coffee', 'clean', 'clean:dist', 'copy', 'concat',
        'mkdir:all', 'jshint', 'uglify',
        'replace', 'concat:dist', 'concat:libs'
      ]
