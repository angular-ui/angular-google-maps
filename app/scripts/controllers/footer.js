'use strict';

angular.module('angularGoogleMapsApp').controller('FooterCtrl', function ($scope, $log, $q, $github) {

	var githubCalled = false;

	if (!githubCalled) {
		// GitHub api calls
	  	$q.all([$github.getCommits(), $github.getContributors(), $github.getIssues(), $github.getEvents()])
	  		.then(function (results) {
	  		
		  		var commits = results[0],
		  			contributors = results[1],
		  			issues = results[2],
		  			events = results[3];

		  		angular.extend($scope, {
		  			github: {
		  				commits: {
		  					latest: commits.length ? commits[0] : {},
		  					all: commits
		  				},
		  				issuesCount: issues.length,
		  				issues: issues,
		  				contributors: contributors,
		  				events: events
		  			}
		  		});
			
		  	}, function (err) {
		  		$log.error(err);
		  		$scope.github = null;
		  	});
		  	
		githubCalled = true;
	}
	  	
	function actorLink (actor) {
		return '<a href="' + actor.url + '" rel="external">' + actor.login + '</a>';
	}
	
	$scope.eventLabel = function (event) {
	
		var pl = event.payload;
		
		switch (event.type) {
		case 'WatchEvent':
			return 'starred this repository';
			
		case 'CreateEvent':
			return 'created ' + pl.ref_type + ' ' + pl.ref;
			
		case 'ForkEvent':
			return 'forked this repository';
			
		case 'PushEvent':
			return 'pushed ' + pl.size + ' commit(s) to ' + pl.ref.replace('refs/heads/', '');
			
		case 'IssueCommentEvent':
			return 'commented on issue ' + pl.issue.number;
			
		case 'DeleteEvent':
			return 'deleted ' + pl.ref_type + ' ' + pl.ref;
			
		case 'PullRequestEvent':
			return pl.action + ' pull request ' + pl.pull_request.number;
			
		case 'IssuesEvent':
			return pl.action + ' issue ' + pl.issue.number;
			
		}
		
		return "TODO (" + event.type + ")";
	};
  });
