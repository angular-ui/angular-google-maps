'use strict';

angular.module('angularGoogleMapsApp').provider('analytics', function () {

	var _trackingCode = null,
		_trackViewChange = true,
		ga = null;

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

	this.$get = function ($window, $log, $rootScope, $document) {

		ga = $window._gaq || [];

		ga.push(['_setAccount', _trackingCode]);

		var _trackPageView = function (path) {
				ga.push(['_trackPageview', path]);
			},
			_trackEvent = function (name, value) {
				ga.push(['_trackEvent', name, value]);
			};

		if (_trackViewChange) {
			
			$log.info('analytics: telling analytics service to track view changes');

			$rootScope.$on('$routeChangeSuccess', function () {
				_trackPageView();
			});

			$rootScope.$on('$routeChangeError', function () {
				_trackPageView();
			});
		}

		return {
			trackPageView: _trackPageView,
			trackEvent: _trackEvent
		};
	};
});
