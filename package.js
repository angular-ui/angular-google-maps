// package metadata file for Meteor.js
var packageName = 'angularui:angular-google-maps'; // https://atmospherejs.com/angularui/angular-google-maps
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '2.0.12';

Package.describe({
  name: packageName,
  version: version,
  summary: 'angular-google-maps (official)',
  git: 'git@github.com:angular-ui/angular-google-maps.git',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);

  api.use([
    'angularjs:angular@1.2.0',
    'stevezhu:lodash@1.0.2'
  ], where);

  api.addFiles('dist/angular-google-maps.js', where);
});