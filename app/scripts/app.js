'use strict';

angular.module('angularGoogleMapsApp')
  .value('headlinesFetchInterval', 300000)
  .config(function ($routeProvider, $locationProvider, $githubProvider) {
  	
  	$locationProvider.html5Mode(false).hashPrefix('!');

  	$githubProvider.username('nlaplante').repository('angular-google-maps').branch('master');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/use', {
      	templateUrl: 'views/use.html',
      	controller: 'UseCtrl'
      })
      .when('/api', {
      	templateUrl: 'views/api.html',
      	controller: 'ApiCtrl',
      })
      .when('/demo', {
      	templateUrl: 'views/demo.html',
      	controller: 'DemoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, $log, $location, $q, $github) {
  	$rootScope.$location = $location;
  	
  	$rootScope.$on('$viewContentLoaded', function () {
  		$log.info('calling plusone()');
  		gapi.plusone.go();
  	});
  });
