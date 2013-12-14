'use strict';

angular.module('angularGoogleMapsApp').controller('FooterCtrl', function ($scope, $log, $q, $github) {

    // GitHub api calls
  	$q.all([$github.getCommits(), $github.getContributors(), $github.getIssues()])
  		.then(function (results) {
  		
	  		var commits = results[0],
	  			contributors = results[1],
	  			issues = results[2];

	  		angular.extend($scope, {
	  			github: {
	  				commits: {
	  					latest: commits.length ? commits[0] : {},
	  					all: commits
	  				},
	  				issuesCount: issues.length,
	  				issues: issues,
	  				contributors: contributors,
	  				actors: (function () {
	  					
	  				}())
	  			}
	  		});
	  		
			$log.info('GitHub data', $scope.github);
			
	  	}, function (err) {
	  		$log.error(err);
	  		$scope.github = null;
	  	});  
  });
