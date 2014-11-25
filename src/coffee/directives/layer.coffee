###
@authors:
- Nicolas Laplante https://plus.google.com/108189012221374960701
- Nicholas McCready - https://twitter.com/nmccready
###

###
Map Layer directive

This directive is used to create any type of Layer from the google maps sdk.
This directive creates a new scope.

{attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
###
angular.module('uiGmapgoogle-maps')
.directive 'uiGmapLayer', ['$timeout', 'uiGmapLogger', 'uiGmapLayerParentModel',
  ($timeout, Logger, LayerParentModel) ->
    class Layer
      constructor:  ->
        @$log = Logger
        @restrict = 'EMA'
        @require = '^' + 'uiGmapGoogleMap'
        @priority = -1
        @transclude = true
        @template = '<span class=\'angular-google-map-layer\' ng-transclude></span>'
        @replace = true
        @scope =
          show: '=show'
          type: '=type'
          namespace: '=namespace'
          options: '=options'
          onCreated: '&oncreated'

      link: (scope, element, attrs, mapCtrl) =>
        mapCtrl.getScope().deferred.promise.then (map) =>
          if scope.onCreated?
            new LayerParentModel(scope, element, attrs, map, scope.onCreated)
          else
            new LayerParentModel(scope, element, attrs, map)
    new Layer()
]
