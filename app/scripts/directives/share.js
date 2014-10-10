'use strict';

angular.module('angularGoogleMapsApp')
  .directive('share', ['$log', function ($log) {
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
  }]);
