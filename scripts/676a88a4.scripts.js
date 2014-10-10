'use strict';
angular.module('angularGoogleMapsApp', [
  'ngAnimate',
  'ngSanitize',
  'google-maps'.ns(),
  'hljs',
  'semverSort',
  'ui.router'
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('MainCtrl', [
  '$scope',
  '$github',
  '$log',
  'analytics',
  function ($scope, $github, $log, analytics) {
    var DOWNLOAD_URL_TEMPLATE = 'https://rawgit.com/angular-ui/angular-google-maps/%REF%/dist/angular-google-maps.min.js', FALLBACK_BRANCH = 'master';
    $scope.map = {
      center: {
        latitude: 40.7081,
        longitude: -74.0041
      },
      zoom: 13,
      options: {
        disableDefaultUI: true,
        mapTypeControl: false,
        tilt: 45
      }
    };
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 40.47,
        longitude: -74.5
      }
    };
    $scope.dlClick = function () {
      analytics.trackEvent('click', 'download');
    };
    $github.getTags().then(function (data) {
      $scope.latestTag = {};
      if (data && data.length) {
        $scope.latestTag = _.filter(data, function (d) {
          return 0 >= d.name.indexOf('SNAPSHOT');
        })[0];
      }
      $scope.downloadUrl = DOWNLOAD_URL_TEMPLATE.replace('%REF%', $scope.latestTag.name);
    }, function (e) {
      $log.error('could not fetch latest tag; falling back to ' + FALLBACK_BRANCH, e);
      $scope.latestTag = { name: FALLBACK_BRANCH };
      $scope.downloadUrl = DOWNLOAD_URL_TEMPLATE.replace('%REF%', FALLBACK_BRANCH);
    });
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('UseCtrl', [
  '$scope',
  function ($scope) {
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('FAQCtrl', [
  '$scope',
  function ($scope) {
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').constant('directiveList', [
  'google-map',
  'drawing-manager',
  'free-draw-polygons',
  'circle',
  'layer',
  'map-control',
  'marker',
  'marker-label',
  'markers',
  'polygon',
  'polyline',
  'polylines',
  'rectangle',
  'search-box',
  'window',
  'windows'
]).constant('providerList', ['GoogleMapApi']).constant('serviceList', [
  'Logger',
  'IsReady'
]).constant('globalList', [
  'String',
  'Lodash'
]).config([
  '$stateProvider',
  'directiveList',
  'providerList',
  'serviceList',
  'globalList',
  function ($stateProvider, directiveList, providerList, serviceList, globalList) {
    [
      {
        modules: directiveList,
        loc: 'directive/'
      },
      {
        modules: providerList,
        loc: 'provider/'
      },
      {
        modules: serviceList,
        loc: 'service/'
      },
      {
        modules: globalList,
        loc: 'global/'
      }
    ].forEach(function (modsToLoc) {
      modsToLoc.modules.forEach(function (cur) {
        (function (cur) {
          $stateProvider.state('api.' + cur, { templateUrl: 'views/' + modsToLoc.loc + cur + '.html' });
        }(cur));
      });
    });
  }
]).controller('ApiCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  '$state',
  'directiveList',
  'providerList',
  'serviceList',
  'globalList',
  function ($scope, $rootScope, $location, $state, directiveList, providerList, serviceList, globalList) {
    if ($state.current.name === 'api') {
      $state.go('api.' + providerList[0]);
    }
    $scope.providers = providerList;
    $scope.services = serviceList;
    $scope.directives = directiveList;
    $scope.globals = globalList;
    $scope.current = providerList[0];
    $scope.current = $state.$current.name;
    $rootScope.$on('$stateChangeSuccess', function (event, to) {
      $scope.current = $state.$current.name.substring(4);
    });
    //    $scope.viewUrl = function (directive) {
    //      return 'views/directive/' + directive + '.html';
    //    };
    $scope.query = null;
    $scope.$watch(function () {
      return $location.hash();
    }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $('#content' + newValue).collapse('show');
      }
    });
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('DemoCtrl', [
  '$scope',
  '$timeout',
  function ($scope, $timeout) {
    $scope.tab = 'status';
    $scope.map = {
      center: {
        latitude: 40.47,
        longitude: -73.85
      },
      zoom: 8,
      markers: [
        {
          id: 0,
          coords: {
            latitude: 41,
            longitude: -75
          },
          title: 'Marker 1'
        },
        {
          id: 1,
          coords: {
            latitude: 40,
            longitude: -74.5
          },
          title: 'Marker 2'
        }
      ],
      polyline: {
        path: [
          {
            latitude: 41,
            longitude: -75
          },
          {
            latitude: 40,
            longitude: -74.5
          },
          {
            latitude: 40.47,
            longitude: -73.85
          },
          {
            latitude: 41.2,
            longitude: -74.2
          }
        ],
        clickable: true,
        editable: true,
        geodesic: true,
        draggable: true
      }
    };
    $timeout(function () {
      $scope.map.markers.push({
        id: 3,
        coords: {
          latitude: 40.2,
          longitude: -74.3
        },
        title: 'Marker 3'
      });
    }, 4000);
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('HeadlinesCtrl', [
  '$scope',
  '$http',
  '$log',
  '$interval',
  'headlinesFetchInterval',
  function ($scope, $http, $log, $interval, headlinesFetchInterval) {
    var showAtMost = 3, loadMoreCount = 3;
    function fetchHeadlines() {
      $http({
        method: 'GET',
        url: 'headlines.json'
      }).then(function (res) {
        $scope.headlines = res.data.items;
        $scope.count = res.data.items.length;
        $log.debug('headlines: fetched', res.data.items.length, 'headlines');
      }, function (res) {
        $log.error('could not fetch headlines', res.status);
      });
    }
    $log.debug('headlines: fetch updates every ' + headlinesFetchInterval / 1000 / 60 + ' minute(s)');
    $interval(fetchHeadlines, headlinesFetchInterval).then(function () {
    }, function (e) {
      $log.error('an error has occured in interval', e);
    }, function (headlines) {
      $log.info('fetched headlines');
    });
    $scope.displayed = function () {
      return _.first($scope.headlines, showAtMost);
    };
    $scope.loadMore = function () {
      showAtMost += loadMoreCount;
    };
    // 1st execution
    fetchHeadlines.apply(this, []);
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('FooterCtrl', [
  '$scope',
  '$log',
  '$q',
  '$github',
  function ($scope, $log, $q, $github) {
    var githubCalled = false;
    if (!githubCalled) {
      // GitHub api calls
      $q.all([
        $github.getAllCommits(),
        $github.getContributors(),
        $github.getIssues(),
        $github.getEvents()
      ]).then(function (results) {
        var commits = results[0], contributors = results[1], issues = results[2], events = results[3];
        angular.extend($scope, {
          github: {
            branch: $github.getBranch(),
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
    function actorLink(actor) {
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
      case 'PullRequestReviewCommentEvent':
        return 'commented on a <a href="' + pl.comment.html_url + '" rel="external">pull request</a>';
      case 'GollumEvent':
        var page = pl.pages && pl.pages.length ? pl.pages[0] : null;
        if (page) {
          return page.action + ' page <a href="' + page.html_url + '" rel="external">' + page.title + '</a> on the wiki';
        }
        return '[api data error]';
      case 'CommitCommentEvent':
        return 'commented on commit ' + pl.comment.commit_id.substring(0, 8);
      }
      return 'TODO (' + event.type + ')';
    };
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller([
  '$scope',
  '$log',
  '$location',
  'NotFoundCtrl',
  function ($scope, $log, $location) {
    $scope.requestedUrl = $location.search().url;
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').controller('ChangeLogCtrl', [
  '$scope',
  '$log',
  'changelog',
  function ($scope, $log, changelog) {
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
    // Everything's set!
    $scope.changelog = cl;
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').provider('$github', function () {
  // Private variables
  var username = null;
  var repository = null;
  var branch = null;
  // Private constructor
  function GithubService($log, $http, $q) {
    var api = 'https://api.github.com/repos/' + username + '/' + repository;
    /**
       * @param type
       * @param options
       * @return string
     */
    function apiURL(type, options) {
      var url = api + '/' + type + '?callback=JSON_CALLBACK';
      if (options) {
        angular.forEach(options, function (value, key) {
          if (value != null) {
            url += '&' + key + '=' + value;
          }
        });
      }
      $log.debug('github: api url', url);
      return url;
    }
    function apiCall(type, options) {
      var deferred = $q.defer();
      $http({
        cache: true,
        method: 'JSONP',
        url: apiURL(type, angular.extend({}, apiURLOpts, options))
      }).then(function (res) {
        $log.debug('github:', type, '(' + (res.data.data ? res.data.data.length : 0) + ')', res.data.data);
        deferred.resolve(res.data.data);
      }, function (res) {
        $log.error('github:', type, res);
        deferred.reject(res);
      });
      return deferred.promise;
    }
    var apiURLOpts = branch ? {
        sha: branch,
        per_page: 1000
      } : null;
    this.getRepository = function () {
      return repository;
    };
    this.getBranch = function () {
      return branch;
    };
    this.getCollaborators = function () {
      return apiCall('collaborators', {});
    };
    this.getContributors = function () {
      return apiCall('contributors', {});
    };
    this.getCommits = function () {
      return apiCall('commits', { per_page: 10 });
    };
    this.getAllCommits = function () {
      var deferred = $q.defer();
      apiCall('branches', { sha: null }).then(function (data) {
        var qs = [];
        angular.forEach(data, function (val) {
          var bdef = $q.defer();
          qs.push(bdef.promise);
          apiCall('commits', {
            per_page: 10,
            sha: val.name
          }).then(function (branchCommits) {
            bdef.resolve(branchCommits);
          }, function (e) {
            bdef.reject(e);
          });
        });
        $q.all(qs).then(function (allCommits) {
          var flattened = _.flatten(allCommits);
          var sorted = _.sortBy(flattened, function (commit) {
              return -Date.parse(commit.commit.committer.date);
            });
          deferred.resolve(_.flatten(allCommits));
        }, function (e) {
          deferred.reject(e);
        });
      }, function (e) {
        deferred.reject(e);
      });
      return deferred.promise;
    };
    this.getIssues = function () {
      return apiCall('issues', {});
    };
    this.getEvents = function () {
      return apiCall('events', {});
    };
    this.getTags = function () {
      return apiCall('tags', {});
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
  this.$get = [
    '$log',
    '$http',
    '$q',
    function ($log, $http, $q) {
      return new GithubService($log, $http, $q);
    }
  ];
});
'use strict';
angular.module('angularGoogleMapsApp').provider('analytics', function () {
  var _trackingCode = null, _trackViewChange = true, ga = null;
  this.trackingCode = function () {
    if (arguments.length) {
      _trackingCode = arguments[0];
      return this;
    }
    return _trackingCode;
  };
  this.trackViewChange = function () {
    if (arguments.length) {
      _trackViewChange = arguments[0];
      return this;
    }
    return _trackViewChange;
  };
  this.$get = [
    '$window',
    '$log',
    '$rootScope',
    '$document',
    '$location',
    function ($window, $log, $rootScope, $document, $location) {
      var _trackingCodeSet = false;
      var _setTrackingCode = function () {
          if (!_trackingCodeSet && $window.ga) {
            $window.ga('create', _trackingCode, 'auto');
            _trackingCodeSet = true;
          }
        }, _trackPageView = function (path) {
          $log.debug('analytics: tracking page view', path);
          _setTrackingCode();
          if ($window.ga) {
            $window.ga('send', 'pageView', path);
          }
        }, _trackEvent = function (name, value) {
          $log.debug('analytics: tracking event', {
            'name': name,
            'value': value
          });
          _setTrackingCode();
          if ($window.ga) {
            $window.ga('send', 'event', 'button', 'click', 'download library');
          }
        };
      if (_trackViewChange) {
        $log.info('analytics: telling analytics service to track view changes');
        $rootScope.$on('$routeChangeSuccess', function () {
          _trackPageView($location.path());
        });
        $rootScope.$on('$routeChangeError', function () {
          _trackPageView($location.path());
        });
      }
      return {
        trackPageView: _trackPageView,
        trackEvent: _trackEvent
      };
    }
  ];
});
/**
 * Shamelessly copied from angularjs https://github.com/angular/angular.js/blob/master/docs/app/src/examples.js
 * and modified for this use under the MIT License restrictions.
 */
angular.module('angularGoogleMapsApp').factory('formPostData', [
  '$document',
  function ($document) {
    return function (url, fields) {
      var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
      angular.forEach(fields, function (value, name) {
        var input = angular.element('<input type="hidden" name="' + name + '">');
        input.attr('value', value);
        form.append(input);
      });
      $document.find('body').append(form);
      form[0].submit();
      form.remove();
    };
  }
]).factory('openPlnkr', [
  'formPostData',
  '$http',
  '$q',
  function (formPostData, $http, $q) {
    return function (exampleFolder) {
      var exampleName = 'Angular Google Maps Example';
      function getInsertionPoint(index, anchor) {
        return index.content.indexOf(anchor);
      }
      function getIndex(files) {
        return files.filter(function (cur) {
          return cur.name === 'index.html';
        })[0];
      }
      function appendContent(index, insertPoint, data) {
        index.content = index.content.substring(0, insertPoint) + data + index.content.substring(insertPoint);
      }
      ;
      function insertFiles(files, filter, anchor, template) {
        var list = files.filter(filter);
        var index = getIndex(files);
        var insertPoint = getInsertionPoint(index, anchor);
        var tags = [];
        list.map(function (cur) {
          tags.push(template.replace('$file', cur.name));
        });
        appendContent(index, insertPoint, tags.join('\n'));
      }
      function insertScripts(files) {
        var filter = function (cur) {
          return cur.name.substring(cur.name.length - 3) === '.js';
        };
        var template = '<script type=\'text/javascript\' src=\'$file\'></script>';
        var anchor = '<!--script-->';
        insertFiles(files, filter, anchor, template);
      }
      function insertExample(files) {
        var anchor = '<!--example-->';
        var index = getIndex(files);
        var insertionPoint = getInsertionPoint(index, anchor);
        var exampleIdx = -1;
        var example = files.filter(function (cur, idx) {
            if (cur.name === 'example.html') {
              exampleIdx = idx;
              return true;
            }
            return false;
          })[0];
        appendContent(index, insertionPoint, example.content);
        delete files[exampleIdx];
      }
      // Load the manifest for the example
      $http.get(exampleFolder + '/manifest.json').then(function (response) {
        return response.data;
      }).then(function (manifest) {
        var filePromises = [];
        // Build a pretty title for the Plunkr
        var exampleNameParts = manifest.name.split('-');
        exampleNameParts.unshift('AngularJS');
        angular.forEach(exampleNameParts, function (part, index) {
          exampleNameParts[index] = part.charAt(0).toUpperCase() + part.substr(1);
        });
        exampleName = exampleNameParts.join(' - ');
        angular.forEach(manifest.files, function (filename) {
          filePromises.push($http.get(exampleFolder + '/' + filename, { transformResponse: [] }).then(function (response) {
            // The manifests provide the production index file but Plunkr wants
            // a straight index.html
            if (filename === 'index.html') {
              filename = 'example.html';
            }
            // Rename plnkr to the main entry point
            if (filename === '../base/plnkr.html') {
              filename = 'index.html';
            }
            return {
              name: filename,
              content: response.data
            };
          }));
        });
        return $q.all(filePromises);
      }).then(function (files) {
        // TODO: Add CSS insertion.
        var postData = {};
        insertScripts(files);
        insertExample(files);
        angular.forEach(files, function (file) {
          if (!!file && !!file.name) {
            postData['files[' + file.name + ']'] = file.content;
          }
        });
        if (!postData['files[style.css]']) {
          postData['files[style.css]'] = '/* style file */';
        }
        postData['tags[0]'] = 'angularjs';
        postData['tags[1]'] = 'example';
        postData['tags[2]'] = 'angular-google-maps';
        postData.private = true;
        postData.description = exampleName;
        formPostData('http://plnkr.co/edit/?p=preview', postData);
      });
    };
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').value('headlinesFetchInterval', 300000).config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$logProvider',
  '$githubProvider',
  'analyticsProvider',
  '$sceDelegateProvider',
  'hljsServiceProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, $githubProvider, analyticsProvider, $sceDelegateProvider, hljsServiceProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
    $logProvider.debugEnabled(false);
    $githubProvider.username('angular-ui').repository('angular-google-maps').branch('master');
    analyticsProvider.trackingCode('UA-34163232-1').trackViewChange(true);
    $sceDelegateProvider.resourceUrlWhitelist(['self']);
    $sceDelegateProvider.resourceUrlBlacklist(['https://rawgithub.com/**']);
    hljsServiceProvider.setOptions({ tabReplace: '    ' });
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).state('use', {
      url: '/use',
      templateUrl: 'views/use.html',
      controller: 'UseCtrl'
    }).state('api', {
      url: '/api',
      templateUrl: 'views/api.html',
      controller: 'ApiCtrl',
      reloadOnSearch: false
    }).state('demo', {
      url: '/demo',
      templateUrl: 'views/demo.html',
      controller: 'DemoCtrl'
    }).state('faq', {
      url: '/faq',
      templateUrl: 'views/faq.html',
      controller: 'FAQCtrl'
    }).state('changelog', {
      url: '/changelog',
      templateUrl: 'views/changelog.html',
      controller: 'ChangeLogCtrl',
      reloadOnSearch: false,
      resolve: {
        changelog: [
          '$http',
          '$q',
          '$log',
          function ($http, $q, $log) {
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
          }
        ]
      }
    }).state('not-found', {
      url: '/not-found',
      templateUrl: 'views/404.html',
      controller: 'NotFoundCtrl'
    });
    $urlRouterProvider.otherwise('/');
  }
]).run([
  '$rootScope',
  '$log',
  '$location',
  function ($rootScope, $log, $location) {
    $rootScope.$location = $location;
    $rootScope.$on('$routeChangeError', function (e, current, previous, rejection) {
      $log.error('could not change route', rejection);
    });
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').directive('rel', [
  '$log',
  function ($log) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        // Open links wil rel='external' in new window/tab
        var el = angular.element(element);
        if (el.attr('rel').indexOf('external') !== -1) {
          el.attr('target', '_blank').addClass('link-external');
        }
      }
    };
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').directive('share', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      template: '<div class="share-button" ng-cloak></div>',
      replace: true,
      link: function postLink(scope, element, attrs) {
        // Open links wil rel='external' in new window/tab
        var el = angular.element(element);
        var opts = {};
        if (attrs.url) {
          opts.url = attrs.url;
        }
        if (attrs.text) {
          opts.text = attrs.text;
        }
        if (attrs.image) {
          opts.image = attrs.image;
        }
        if (attrs.appId) {
          opts.app_id = attrs.appId;
        }
        if (attrs.background) {
          opts.background = attrs.background;
        }
        if (attrs.color) {
          opts.color = attrs.color;
        }
        if (attrs.icon) {
          opts.icon = attrs.icon;
        }
        if (attrs.buttonText) {
          opts.button_text = attrs.buttonText;
        }
        if (attrs.flyout) {
          opts.flyout = attrs.flyout;
        }
        $log.debug('share options', opts);
        var shareElement = el.share(opts);
        el.data('ng-share', shareElement);
      }
    };
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').directive('affix', [
  '$log',
  function ($log) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var opts = { offset: {} };
        if (attrs.offsetTop) {
          opts.offset.top = parseInt(attrs.offsetTop);
        }
        if (attrs.offsetBottom) {
          opts.offset.bottom = parseInt(attrs.offsetBottom);
        }
        $log.debug('affix options', opts);
        angular.element(element).affix(opts);
      }
    };
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').directive('googleApi', [
  '$log',
  function ($log) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $log.debug('generating link to Google Maps API reference for ' + attrs.googleApi);
        // Open links wil rel='external' in new window/tab
        var el = angular.element(element);
        el.attr('href', 'https://developers.google.com/maps/documentation/javascript/reference#' + attrs.googleApi).attr('rel', 'external').attr('target', '_blank');
      }
    };
  }
]);
'use strict';
angular.module('angularGoogleMapsApp').directive('runnableExample', [
  'openPlnkr',
  function (openPlnkr) {
    return {
      restrict: 'E',
      template: '<div>' + '<div>' + '<button ng-click="click(\'index\')">index.html</button>' + '<button ng-click="click(\'script\')">script.js</button>' + '<button style="float:right" ng-click="editPlnkr()">Edit in Plnkr</button>' + '</div>' + '<div ng-show="index">' + '<pre ng-non-bindable></pre>' + '</div>' + '<div ng-show="script">' + '<pre ng-non-bindable></pre>' + '</div>' + '<div style="width:100%; height: 350px; padding:4px;">' + '<iframe style="width: 100%; height: 100%"></iframe>' + '</div>' + '</div>',
      scope: { example: '=example' },
      controller: [
        '$scope',
        '$element',
        '$http',
        function ($scope, $element, $http) {
          console.log('Example controller.');
          $scope.index = true;
          $scope.script = false;
          var prefix = window.location.pathname + 'views/examples/';
          $scope.click = function (clicked) {
            var indexClicked = clicked === 'index';
            $scope.index = indexClicked;
            $scope.script = !indexClicked;
          };
          $scope.editPlnkr = function () {
            openPlnkr(prefix + $scope.example);
          };
          var pres = $element.find('pre');
          $http.get(prefix + $scope.example + '/index.html').then(function (index) {
            console.log('fetched index', index);
            pres[0].innerText = index.data;
          });
          $http.get(prefix + $scope.example + '/script.js').then(function (script) {
            console.log('fetched script', script);
            pres[1].innerText = script.data;
          });
          var iframe = $element.find('iframe');
          iframe.attr('src', prefix + 'base/base.html?example=' + $scope.example);
        }
      ]
    };
  }
]);