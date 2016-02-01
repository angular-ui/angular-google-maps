module.exports =
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
