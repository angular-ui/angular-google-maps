##
#
# author: Nicholas McCready
# directive to invoke google-maps-tools keydragzoom
#
# details: http://google-maps-utility-library-v3.googlecode.com/svn/tags/keydragzoom/2.0.9/docs/examples.html
#   options: can set styles and keys
#
##
angular.module('uiGmapgoogle-maps.directives.api').service 'uiGmapDragZoom', [
  'uiGmapCtrlHandle', 'uiGmapPropertyAction', (CtrlHandle, PropertyAction) ->
    restrict: 'EMA'
    transclude: true
    replace: false
    template: '<div class="angular-google-map-dragzoom" ng-transclude style="display: none"></div>'
    replace: true
    require: '^' + 'uiGmapGoogleMap'
    scope:
      keyboardkey: '='
      options: '='

    controller: ['$scope', '$element', ($scope, $element) ->
      $scope.ctrlType = 'uiGmapDragZoom'
      _.extend @, CtrlHandle.handle($scope, $element)
    ]

    link: (scope, element, attrs, ctrl) ->
      CtrlHandle.mapPromise(scope, ctrl).then (map) ->

        setKeyAction = new PropertyAction (key, newVal) ->
          if newVal
            map.enableKeyDragZoom key: newVal
          else
            map.enableKeyDragZoom()

        setOptionsAction = new PropertyAction (key, newVal) ->
          map.enableKeyDragZoom newVal if newVal

        scope.$watch 'keyboardkey', setKeyAction.sic
        setKeyAction.sic scope.keyboardkey

        scope.$watch 'options', setOptionsAction.sic
        setOptionsAction.sic scope.options
]
