'use strict';

angular.module('angularGoogleMapsApp')
  .config(function ($routeProvider, $locationProvider, $githubProvider) {
  	
  	$locationProvider.html5Mode(false).hashPrefix('!');

  	$githubProvider.username('nlaplante').repository('angular-google-maps').branch('r1-dev');

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

  	// GitHub api calls
  	$q.all([$github.getCommits(), $github.getCollaborators(), $github.getContributors(), $github.getIssues()])
  		.then(function (results) {
  		
	  		var commits = results[0],
	  			collaborators = results[1],
	  			contributors = results[2],
	  			issues = results[3];

	  		angular.extend($rootScope, {
	  			github: {
	  				commits: {
	  					latest: _.first(commits),
	  					all: commits
	  				},
	  				issuesCount: issues.length,
	  				issues: issues,
	  				collaborators: collaborators,
	  				contributors: contributors
	  			}
	  		});
	  	}, function (err) {
	  		$log.error(err);
	  		$rootScope.github = null;
	  	});
  });
