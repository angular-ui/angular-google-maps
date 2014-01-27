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

	this.$get = function ($window, $log, $rootScope, $document, $location) {

		var _trackPageView = function (path) {
				$log.debug('analytics: tracking page view', path);
				
				if ($window.ga) {
					$window.ga('send', 'pageView', path);
				}
			},
			_trackEvent = function (name, value) {
				$log.debug('analytics: tracking event', { 'name': name, 'value': value });
				
				if ($window.ga) {
					$window.ga('send', 'event', 'button', 'click', 'download library')
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
	};
});
