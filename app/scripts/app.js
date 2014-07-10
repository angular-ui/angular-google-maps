'use strict';

angular.module('angularGoogleMapsApp')
  .value('headlinesFetchInterval', 300000)
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, $githubProvider, analyticsProvider, $sceDelegateProvider, hljsServiceProvider) {
  	
  	$locationProvider.html5Mode(false).hashPrefix('!');
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
  	
  	hljsServiceProvider.setOptions({
  		tabReplace: '    '
  	});

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('use', {
        url: '/use',
      	templateUrl: 'views/use.html',
      	controller: 'UseCtrl'
      })
      .state('api', {
        url: '/api',
      	templateUrl: 'views/api.html',
      	controller: 'ApiCtrl',
      	reloadOnSearch: false
      })
      .state('demo', {
        url: '/demo',
      	templateUrl: 'views/demo.html',
      	controller: 'DemoCtrl'
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'views/faq.html',
        controller: 'FAQCtrl'
      })
      .state('changelog', {
            url: '/changelog',
      		templateUrl: 'views/changelog.html',
      		controller: 'ChangeLogCtrl',
      		reloadOnSearch: false,
      		resolve: {
      			changelog: ['$http', '$q', '$log', function ($http, $q, $log) {
      				var deferred = $q.defer();
      				
      				$http({
      					method: 'GET',
      					url: 'changelog.json'
      				}).then(function (res) {
      					deferred.resolve(res.data);
      				}, function (error) {
      					$log.error('could not get /changelog.json', error);
      					deferred.reject(error);
      				});
      				
      				return deferred.promise;
      			}]
      		}
      })      
      .state('not-found', {
            url: '/not-found',
		    templateUrl: 'views/404.html',
		    controller: 'NotFoundCtrl'
      });

      $urlRouterProvider.otherwise('/');
  })
  .run(function ($rootScope, $log, $location) {
  
  	$rootScope.$location = $location;
	
    $rootScope.$on('$routeChangeError', function (e, current, previous, rejection) {
		  $log.error('could not change route', rejection);
    });
	
  });
