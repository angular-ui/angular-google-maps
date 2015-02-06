#taken directly from (should be its own lib)
#http://stackoverflow.com/questions/20921622/running-code-after-an-angularjs-animation-has-completed
angular.module('uiGmapgoogle-maps')
.directive 'uiGmapShow',['$animate', 'uiGmapLogger', ($animate, $log) ->
  scope:
    'uiGmapShow': '='
    'uiGmapAfterShow': '&'
    'uiGmapAfterHide': '&'
  link: (scope, element) ->
    angular_post_1_3_handle = (animateAction, cb) ->
      $animate[animateAction](element, 'ng-hide').then ->
        cb()
    angular_pre_1_3_handle = (animateAction, cb) ->
      $animate[animateAction](element, 'ng-hide', cb)

    handle = (animateAction, cb) ->
      if angular.version.major > 1
        return $log.error """
          uiGmapShow is not supported for Angular Major greater than 1.
          Your Major is #{angular.version.major}"
        """
      if angular.version.major == 1 and angular.version.minor < 3
        return angular_pre_1_3_handle(animateAction, cb)
      angular_post_1_3_handle(animateAction, cb)

    scope.$watch 'uiGmapShow', (show) ->
      if show
        handle('removeClass', scope.uiGmapAfterShow)
      if !show
        handle('addClass', scope.uiGmapAfterHide)
]