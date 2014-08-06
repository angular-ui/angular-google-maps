'use strict';

describe('Service: github', function () {

  var fakeModule = angular.module('fake.module', ['angularGoogleMapsApp']);
  
  fakeModule.config(function ($githubProvider) {
  	$githubProvider.username('angular-ui').repository('angular-google-maps').branch('master');
  });
  
  // load the service's module
  beforeEach(module('angularGoogleMapsApp', 'fake.module'));

  // instantiate service
  var github, $httpBackend, $timeout;
  
  var apiURL = 'https://api.github.com/repos/angular-ui/angular-google-maps',
  	  apiDefaultOpts = {
		callback: 'JSON_CALLBACK',
		sha: 'master'  	  
  	  },
  	  defaultResponse = {
  	  	data: []
  	  };
  
  beforeEach(inject(function ($github, _$httpBackend_, _$timeout_) {
    github = $github;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
  }));

  it('should do something', function () {
    expect(!!github).toBe(true);
  });

  describe('commits', function () {
	  it('should call commits API endpoint', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/commits?callback=JSON_CALLBACK&sha=master&per_page=10')
	  		.respond(200, defaultResponse);
	  	
	  	github.getCommits();

		$httpBackend.flush();  	  	
	  });
	  
	  it('should fail it GitHub API throws error', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/commits?callback=JSON_CALLBACK&sha=master&per_page=10')
	  		.respond(500, defaultResponse);
	  	
	  	var failed = false;
	  	
	  	github.getCommits().then(function () {
	  		failed = false;
	  	}, function () {
	  		failed = true;
	  	});

		$httpBackend.flush();  	  	
		
		expect(failed).toBe(true);				
	  });	  
	  
	  it('should return an array of commits', function () {
	  	
	  	$httpBackend.expectJSONP(apiURL + '/commits?callback=JSON_CALLBACK&sha=master&per_page=10')
	  		.respond(200, defaultResponse);
	  	
	  	var commits = null;
	  	
	  	github.getCommits().then(function (data) {
	  		commits = data;
	  	}); 	
	  
	  	$httpBackend.flush();
	 	
	  	expect(commits).not.toBeNull();
	  	expect(commits.length).toBe(0);
	  });  
  });
  
  describe('contributors', function () {
	  it('should call contributors API endpoint', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/contributors?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(200, defaultResponse);
	  	
	  	github.getContributors();

		$httpBackend.flush();  	  	
	  });
	  
	  it('should fail it GitHub API throws error', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/contributors?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(500, defaultResponse);
	  	
	  	var failed = false;
	  	
	  	github.getContributors().then(function () {
	  		failed = false;
	  	}, function () {
	  		failed = true;
	  	});

		$httpBackend.flush();  	  	
		
		expect(failed).toBe(true);				
	  });	  
	  
	  it('should return an array of contributors', function () {
	  
		$httpBackend.expectJSONP(apiURL + '/contributors?callback=JSON_CALLBACK&sha=master&per_page=1000')
			.respond(200, defaultResponse);
	  	
	  	var contributors = null;
	  	
	  	github.getContributors().then(function (data) {
	  		contributors = data;
	  	}); 	
	  
	  	$httpBackend.flush();
	 	
	  	expect(contributors).not.toBeNull();
	  	expect(contributors.length).toBe(0);
	  });  
  });
  
  describe('collaborators', function () {
	  it('should call collaborators API endpoint', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/collaborators?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(200, defaultResponse);
	  	
	  	github.getCollaborators();

		$httpBackend.flush();  	  	
	  });
	  
	  it('should fail it GitHub API throws error', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/collaborators?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(500, defaultResponse);
	  	
	  	var failed = false;
	  	
	  	github.getCollaborators().then(function () {
	  		failed = false;
	  	}, function () {
	  		failed = true;
	  	});

		$httpBackend.flush();  	  	
		
		expect(failed).toBe(true);				
	  });	  
	  
	  it('should return an array of collaborators', function () {
	  
		$httpBackend.expectJSONP(apiURL + '/collaborators?callback=JSON_CALLBACK&sha=master&per_page=1000')
			.respond(200, defaultResponse);
	  	
	  	var collaborators = null;
	  	
	  	github.getCollaborators().then(function (data) {
	  		collaborators = data;
	  	}); 	
	  
	  	$httpBackend.flush();
	 	
	  	expect(collaborators).not.toBeNull();
	  	expect(collaborators.length).toBe(0);
	  });  
  });
  
  describe('issues', function () {
	  it('should call issues API endpoint', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/issues?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(200, defaultResponse);
	  	
	  	github.getIssues();

		$httpBackend.flush();  	  	
	  });
	  
	  it('should fail it GitHub API throws error', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/issues?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(500, defaultResponse);
	  	
	  	var failed = false;
	  	
	  	github.getIssues().then(function () {
	  		failed = false;
	  	}, function () {
	  		failed = true;
	  	});

		$httpBackend.flush();  	  	
		
		expect(failed).toBe(true);				
	  });
	  
	  it('should return an array of issues', function () {
	  
		$httpBackend.expectJSONP(apiURL + '/issues?callback=JSON_CALLBACK&sha=master&per_page=1000')
			.respond(200, defaultResponse);
	  	
	  	var issues = null;
	  	
	  	github.getIssues().then(function (data) {
	  		issues = data;
	  	}); 	
	  
	  	$httpBackend.flush();
	 	
	  	expect(issues).not.toBeNull();
	  	expect(issues.length).toBe(0);
	  });    
  });
  
  describe('events', function () {
	  it('should call events API endpoint', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/events?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(200, defaultResponse);
	  	
	  	github.getEvents();

		$httpBackend.flush();  	  	
	  });
	  
	  it('should fail it GitHub API throws error', function () {
	  
	  	$httpBackend.expectJSONP(apiURL + '/events?callback=JSON_CALLBACK&sha=master&per_page=1000')
	  		.respond(500, defaultResponse);
	  	
	  	var failed = false;
	  	
	  	github.getEvents().then(function () {
	  		failed = false;
	  	}, function () {
	  		failed = true;
	  	});

		$httpBackend.flush();  	  	
		
		expect(failed).toBe(true);				
	  });
	  
	  it('should return an array of events', function () {
	  
		$httpBackend.expectJSONP(apiURL + '/events?callback=JSON_CALLBACK&sha=master&per_page=1000')
			.respond(200, defaultResponse);
	  	
	  	var events = null;
	  	
	  	github.getEvents().then(function (data) {
	  		events = data;
	  	}); 	
	  
	  	$httpBackend.flush();
	 	
	  	expect(events).not.toBeNull();
	  	expect(events.length).toBe(0);
	  });      
  });  
});

