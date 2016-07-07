###
Map Layers directive

This directive is used to create any type of Layer from the google maps sdk.
This directive creates a new scope.
###
angular.module('uiGmapgoogle-maps')
.directive "uiGmapMapTypes", ["$timeout", "uiGmapLogger", "uiGmapMapTypesParentModel",
  ($timeout, Logger, MapTypesParentModel) ->
    class MapTypes
      constructor:  ->
        @$log = Logger
        @restrict = "EMA"
        @require = '^' + 'uiGmapGoogleMap'
        @priority = -1
        @transclude = true
        @template = '<span class=\"angular-google-map-layers\" ng-transclude></span>'
        @scope =
          mapTypes: "=mapTypes"
          show: "=show"
          options: "=options"
          refresh: "=refresh"
          id: "=idKey"

      link: (scope, element, attrs, mapCtrl) =>
        mapCtrl.getScope().deferred.promise.then (map) =>
          new MapTypesParentModel(scope, element, attrs, map)
    new MapTypes()
]
