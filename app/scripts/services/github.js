'use strict';

angular.module('angularGoogleMapsApp')
  .provider('$github', function () {

    // Private variables
    var username = null;
    var repository = null;
    var branch = null;

    // Private constructor
    function GithubService($log, $http, $q) {

    	var api = 'https://api.github.com/repos/' + username + '/' + repository;

    	this.getRepository = function () {
    		return repository;
    	};

    	this.getCollaborators = function () {
			var deferred = $q.defer();

    		$http({
    			method: 'GET',
    			url: api + '/collaborators' + (branch ? '?sha=' + branch : '')
    		}).then(function (res) {
    			deferred.resolve(res.data);
    		}, function (res) {
    			deferred.reject(res);
    		});

    		return deferred.promise;
    	};

    	this.getContributors = function () {
			var deferred = $q.defer();

    		$http({
    			method: 'GET',
    			url: api + '/contributors' + (branch ? '?sha=' + branch : '')
    		}).then(function (res) {
    			deferred.resolve(res.data);
    		}, function (res) {
    			deferred.reject(res);
    		});

    		return deferred.promise;
    	};

    	this.getCommits = function () {

    		var deferred = $q.defer();

    		$http({
    			method: 'GET',
    			url: api + '/commits' + (branch ? '?sha=' + branch : '')
    		}).then(function (res) {
    			deferred.resolve(res.data);
    		}, function (res) {
    			deferred.reject(res);
    		});

    		return deferred.promise;
    	};

    }

    // Public API for configuration
    this.repository = function (name) {
      if (name) {
      	repository = name;
      	return this;
      }

      return repository;
    };

    this.username = function (name) {
    	if (name) {
    		username = name;
    		return this;
    	}

    	return username;
    };

    this.branch = function (name) {
    	if (name) {
    		branch = name;
    		return this;
    	}

    	return branch;
    };

    // Method for instantiating
    this.$get = function ($log, $http, $q) {
      return new GithubService($log, $http, $q);
    };
  });
