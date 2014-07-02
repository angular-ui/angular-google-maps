'use strict';

describe('Controller: ChangeLogCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var ChangelogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChangelogCtrl = $controller('ChangeLogCtrl', {
      $scope: scope,
      changelog: {
      	"1.1.0": [{      			
      			sha: "095722",
      			author: 'Nicolas Laplante <nicolas.laplante@gmail.com>',
      			date: 'Sat May 17 13:13:20 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 1'
      		}, {      			
      			sha: "095723",
      			author: 'Nicolas Laplante <nicolas.laplante@gmail.com>',
      			date: 'Sat May 17 13:17:48 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 2'
      		}, {
	      		sha: "095724",
      			author: 'John Doe <jdoe@hotmail.com>',
      			date: 'Sat May 17 13:17:48 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 2'
      		}
      	],
      	'1.0.18': [{      			
      			sha: "095722",
      			author: 'Nicolas Laplante <nicolas.laplante@gmail.com>',
      			date: 'Sat May 17 13:13:20 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 1'
      		}, {      			
      			sha: "095723",
      			author: 'Nicolas Laplante <nicolas.laplante@gmail.com>',
      			date: 'Sat May 17 13:17:48 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 2'
      		}, {
	      		sha: "095724",
      			author: 'John Doe <jdoe@hotmail.com>',
      			date: 'Sat May 17 13:17:48 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 2'
      		}     	
      	],
      	'1.0.19': [{      			
      			sha: "095722",
      			author: 'Nicolas Laplante <nicolas.laplante@gmail.com>',
      			date: 'Sat May 17 13:13:20 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 1'
      		}, {      			
      			sha: "095723",
      			author: 'Nicolas Laplante <nicolas.laplante@gmail.com>',
      			date: 'Sat May 17 13:17:48 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 2'
      		}, {
	      		sha: "095724",
      			author: 'John Doe <jdoe@hotmail.com>',
      			date: 'Sat May 17 13:17:48 2014 -0400',
      			message: 'Test commit for ChangelogCtrl spec 2'
      		}      	
      	]
      }
    });
  }));

  it('should attach the changelog to the scope', function () {
    expect(scope.changelog.length).not.toBe(0);
  });
  
  it('should convert changelog data to suitable format for template', function () {
  	expect(scope.changelog[0].tag).not.toBe(null);
  	expect(scope.changelog[0].commits).not.toBe(null);
  });
  
  it('should group commits by author', function () {
	expect(scope.changelog[0].commits['Nicolas Laplante <nicolas.laplante@gmail.com>']).not.toBe(null);
  	expect(scope.changelog[0].commits['Nicolas Laplante <nicolas.laplante@gmail.com>'].length).toBe(2);
  	
  	expect(scope.changelog[0].commits['John Doe <jdoe@hotmail.com>']).not.toBe(null);
  	expect(scope.changelog[0].commits['John Doe <jdoe@hotmail.com>'].length).toBe(1);
  });
});
