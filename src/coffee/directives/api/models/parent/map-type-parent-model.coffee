angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapMapTypeParentModel', [
  'uiGmapBaseObject', 'uiGmapLogger',
  (BaseObject, Logger) ->
    class MapTypeParentModel extends BaseObject
      constructor: (@scope, @element, @attrs, @gMap, @$log = Logger) ->
        unless @attrs.options?
          @$log.info('options attribute for the map-type directive is mandatory. Map type creation aborted!!')
          return
        @id = @gMap.overlayMapTypesCount = @gMap.overlayMapTypesCount + 1 or 0
        @doShow = true
        @createMapType()

        @doShow = @scope.show if angular.isDefined(@attrs.show)
        @showOverlay() if @doShow and @gMap?

        @scope.$watch('show', (newValue, oldValue) =>
          if newValue isnt oldValue
            @doShow = newValue
            if newValue
              @showOverlay()
            else
              @hideOverlay()
        , true)
        @scope.$watch('options', (newValue, oldValue) =>
          unless _.isEqual newValue, oldValue
            @refreshMapType()
        , true)
        @scope.$watch('refresh', (newValue, oldValue) =>
          unless _.isEqual newValue, oldValue
            @refreshMapType()
        , true) if angular.isDefined @attrs.refresh
        @scope.$on '$destroy', =>
          @hideOverlay()
          @mapType = null

      createMapType: ()=>
        if @scope.options.getTile?
          @mapType = @scope.options
        else if @scope.options.getTileUrl?
          @mapType = new google.maps.ImageMapType @scope.options
        else
          @$log.info('options should provide either getTile or getTileUrl methods. Map type creation aborted!!')
          return

        if @attrs.id and @scope.id
          @gMap.mapTypes.set @scope.id, @mapType
          @doShow = false unless angular.isDefined(@attrs.show)

        @mapType.layerId = @id

      refreshMapType: ()=>
        @hideOverlay()
        @mapType = null
        @createMapType()
        @showOverlay() if @doShow and @gMap?

      showOverlay: ()=>
        @gMap.overlayMapTypes.push @mapType

      hideOverlay: ()=>
        found = false
        @gMap.overlayMapTypes.forEach (mapType, index) =>
          if not found and mapType.layerId is @id
            found = true
            @gMap.overlayMapTypes.removeAt index
          return
    MapTypeParentModel
]
