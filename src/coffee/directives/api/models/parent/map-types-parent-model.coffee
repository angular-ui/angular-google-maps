angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapMapTypesParentModel', [
  'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapMapTypeParentModel', 'uiGmapPropMap'
  (BaseObject, Logger, MapTypeParentModel, PropMap) ->
    class MapTypesParentModel extends BaseObject
      constructor: (@scope, @element, @attrs, @gMap, @$log = Logger) ->
        unless @attrs.mapTypes?
          @$log.info('layers attribute for the map-types directive is mandatory. Map types creation aborted!!')
          return

        pMap = new PropMap

        @scope.mapTypes.forEach (l, i) =>
          mockAttr =
            options: @scope.options
            show: @scope.show
            refresh: @scope.refresh
          childScope = @scope.$new()
          childScope.index = i;
          new MapTypeParentModel(childScope, null, mockAttr, @gMap, @$log, l, pMap)
          return

    MapTypesParentModel
]
