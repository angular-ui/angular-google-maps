###
Map Layer directive

This directive is used to create any type of Layer from the google maps sdk.
This directive creates a new scope.

{attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
###
angular.module("uiGmapgoogle-maps")
.directive "uiGmapMapType", ["$timeout", "uiGmapLogger", "uiGmapMapTypeParentModel",
  ($timeout, Logger, MapTypeParentModel) ->
    class MapType
      constructor:  ->
        @$log = Logger
        @restrict = "EMA"
        @require = '^' + 'uiGmapGoogleMap'
        @priority = -1
        @transclude = true
        @template = '<span class=\"angular-google-map-layer\" ng-transclude></span>'
        @replace = true
        @scope =
          show: "=show"
          options: '=options'
          refresh: '=refresh'
          id: '@'

      link: (scope, element, attrs, mapCtrl) =>
        mapCtrl.getScope().deferred.promise.then (map) =>
          new MapTypeParentModel(scope, element, attrs, map)
    new MapType()
]
