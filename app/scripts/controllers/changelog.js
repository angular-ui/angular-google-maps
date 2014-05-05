'use strict';

angular.module('angularGoogleMapsApp')
  .controller('ChangeLogCtrl', ['$scope', '$log', 'changelog', function ($scope, $log, changelog) {
  
  	// We need to manipulate the raw changelog json a bit to order by tag number and group commits
  	// by author.
  	
  	var cl = [];
  	
  	for (var tag in changelog) {
  		var commits = changelog[tag];
  		
  		cl.push({
  			tag: tag,
  			commits: _.groupBy(commits, function (value) {
  				return value.author;
	  		})
  		});
  	}
  	
  	// Sort by tag number in reverse order
  	cl = _.sortBy(cl, function (value, key) {
  		var tag = value.tag,
  			replaced = value.tag.replace(/\./g, '');  		
  			
  		return parseInt(replaced);
  	}).reverse();
  	
  	// Everything's set!
  	$scope.changelog = cl;
  }]);
