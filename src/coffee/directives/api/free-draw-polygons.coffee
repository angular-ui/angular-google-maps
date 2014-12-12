###
  - Link up Polygons to be sent back to a controller
  - inject the draw function into a controllers scope so that controller can call the directive to draw on demand
  - draw function creates the DrawFreeHandChildModel which manages itself
###
angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapApiFreeDrawPolygons', [
  'uiGmapLogger', 'uiGmapBaseObject', 'uiGmapCtrlHandle', 'uiGmapDrawFreeHandChildModel', 'uiGmapLodash',
  ($log, BaseObject, CtrlHandle, DrawFreeHandChildModel, uiGmapLodash) ->
    class FreeDrawPolygons extends BaseObject
      @include CtrlHandle
      restrict: 'EMA'
      replace: true
      require: '^' + 'uiGmapGoogleMap'
      scope:
        polygons: '='
        draw: '='
        revertmapoptions: '='

      link: (scope, element, attrs, ctrl) =>
        @mapPromise(scope, ctrl).then (map) =>
          return $log.error 'No polygons to bind to!' unless scope.polygons
          return $log.error 'Free Draw Polygons must be of type Array!' unless _.isArray scope.polygons
          freeHand = new DrawFreeHandChildModel map, scope.revertmapoptions
          listener = undefined
          scope.draw = ->
            #clear watch only watch when we are finished drawing/engaging
            listener?()
            freeHand.engage(scope.polygons).then ->
              #we are done drawing, now watch for changes on polygons, on post draw
              firstTime = true
              listener =
                scope.$watchCollection 'polygons', (newValue, oldValue) ->
                  #preven infinite loop on watching
                  if firstTime or newValue == oldValue
                    firstTime = false
                    return
                  removals = uiGmapLodash.differenceObjects oldValue, newValue
                  removals.forEach (p) ->
                    p.setMap null
]
