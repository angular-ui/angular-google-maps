angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapMapTypeParentModel', [
  'uiGmapBaseObject', 'uiGmapLogger',
  (BaseObject, Logger) ->
    class MapTypeParentModel extends BaseObject
      constructor: (@scope, @element, @attrs, @gMap, @$log = Logger, @childModel, @propMap) ->
        unless @scope.options?
          @$log.info('options attribute for the map-type directive is mandatory. Map type creation aborted!!')
          return
        @id = @gMap.overlayMapTypesCount = @gMap.overlayMapTypesCount + 1 or 0
        @doShow = true
        @createMapType()
        @refreshShown()
        @showOverlay() if @doShow and @gMap?

        watchChildModelShow = =>
          @childModel[@attrs.show]
        watchShow = if @childModel then watchChildModelShow else 'show'

        @scope.$watch watchShow, (newValue, oldValue) =>
          if newValue isnt oldValue
            @doShow = newValue
            if newValue
              @showOverlay()
            else
              @hideOverlay()

        watchChildModelOptions = =>
          @childModel[@attrs.options]
        watchOptions = if @childModel then watchChildModelOptions else 'options'

        @scope.$watchCollection watchOptions, (newValue, oldValue) =>
          unless _.isEqual newValue, oldValue
            mapTypeProps = [
              'tileSize'
              'maxZoom'
              'minZoom'
              'name'
              'alt'
            ]
            different = _.some(mapTypeProps, (prop) ->
              !oldValue or !newValue or !_.isEqual(newValue[prop], oldValue[prop])
            )
            if different
              @refreshMapType()

        if angular.isDefined @attrs.refresh
          @scope.$watch 'refresh', (newValue, oldValue) =>
            unless _.isEqual newValue, oldValue
              @refreshMapType()
          , true

        @scope.$on '$destroy', =>
          @hideOverlay()
          @mapType = null

      createMapType: =>
        mapType = if @childModel then (if @attrs.options then @childModel[@attrs.options] else @childModel) else @scope.options
        if mapType.getTile?
          @mapType = mapType
        else if mapType.getTileUrl?
          @mapType = new google.maps.ImageMapType mapType
        else
          @$log.info('options should provide either getTile or getTileUrl methods. Map type creation aborted!!')
          return

        idAttr = if @attrs.id then (if @childModel then @attrs.id else 'id') else undefined
        id = if idAttr then (if @childModel then @childModel[idAttr] else @scope[idAttr]) else undefined
        if id
          @gMap.mapTypes.set id, @mapType
          @doShow = false unless angular.isDefined(@attrs.show)

        @mapType.layerId = @id

        # use prop map to keep track of order of layers
        if @childModel and angular.isDefined @scope.index
          @propMap.put @mapType.layerId, @scope.index

      refreshMapType: =>
        @hideOverlay()
        @mapType = null
        @createMapType()
        @showOverlay() if @doShow and @gMap?

      showOverlay: =>
        if angular.isDefined @scope.index

          # iterate over each current map-type layer
          found = false
          if @gMap.overlayMapTypes.getLength()
            @gMap.overlayMapTypes.forEach (mapType, index) =>
              if !found

                # once we have found a layer with a higher or missing layer index,
                # insert this layer using the found overlayMapTypes index to keep
                # them in the layers in order
                layerIndex = @propMap.get(mapType.layerId.toString())
                if layerIndex > @scope.index or !angular.isDefined(layerIndex)
                  found = true
                  @gMap.overlayMapTypes.insertAt index, @mapType
              return

            # if still not found, it just means that no layer has been found with
            # a higher (or missing) index, so just added to the end
            if !found
              @gMap.overlayMapTypes.push @mapType
          else
            @gMap.overlayMapTypes.push @mapType
        else
          @gMap.overlayMapTypes.push @mapType

      hideOverlay: =>
        found = false
        @gMap.overlayMapTypes.forEach (mapType, index) =>
          if not found and mapType.layerId is @id
            found = true
            @gMap.overlayMapTypes.removeAt index
          return

      refreshShown: () =>
        @doShow = if angular.isDefined(@attrs.show) then (if @childModel then @childModel[@attrs.show] else @scope.show) else true

    MapTypeParentModel
]
