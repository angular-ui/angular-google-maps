'use strict';

angular.module('angularGoogleMapsApp')
  .value('headlinesFetchInterval', 300000)
  .config(function ($routeProvider, $locationProvider, $logProvider, $githubProvider, analyticsProvider, $sceDelegateProvider) {
  	
  	$locationProvider.html5Mode(true).hashPrefix('!');
  	$logProvider.debugEnabled(false);  	

  	$githubProvider.username('nlaplante')
  		.repository('angular-google-maps')
  		.branch('master');
  		
  	analyticsProvider.trackingCode('UA-34163232-1').trackViewChange(true);
  	
  	$sceDelegateProvider.resourceUrlWhitelist([
  		'self'
  	]);
  	
  	$sceDelegateProvider.resourceUrlBlacklist([
  		'https://rawgithub.com/**'
  	]);  	

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
      	reloadOnSearch: false
      })
      .when('/demo', {
      	templateUrl: 'views/demo.html',
      	controller: 'DemoCtrl'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'FAQCtrl'
      })
      .when('/not-found', {
		    templateUrl: 'views/404.html',
		    controller: 'NotFoundCtrl'
      })
      .otherwise({
        redirectTo: function (params, path, search) {
        	return '/not-found?url=' + path;
        }
      });
  })
  .run(function ($rootScope, $log, $location) {
  
  	$rootScope.$location = $location;

    $rootScope.$on('$viewContentLoaded', function (e, current, previous) {
		  // refresh add this if needed
		  addthis.toolbox('.addthis_toolbox');
		  addthis.update('.addthis_toolbox');
    });
	
    $rootScope.$on('$routeChangeError', function (e, current, previous, rejection) {
		  $log.error('could not change route', rejection);
    });
	
  });
