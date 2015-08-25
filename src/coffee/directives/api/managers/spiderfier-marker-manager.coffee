angular.module('uiGmapgoogle-maps.directives.api.managers')
.factory 'uiGmapSpiderfierMarkerManager', ['uiGmapLogger',
'uiGmapFitHelper', 'uiGmapPropMap', 'uiGmapMarkerSpiderfier', ($log, FitHelper, PropMap, MarkerSpiderfier) ->
  class SpiderfierMarkerManager
    @type = 'SpiderfierMarkerManager'
    constructor: (gMap, opt_markers={}, @opt_options = {}, @opt_events, @scope) ->
      @type = SpiderfierMarkerManager.type
      @markerSpiderfier = new MarkerSpiderfier gMap, @opt_options
      @propMapGMarkers = new PropMap() #keep in sync with cluster.markers_
      @attachEvents @opt_events, 'opt_events'
      @noDrawOnSingleAddRemoves = true
      $log.info @

    checkKey: (gMarker) ->
      unless gMarker.key?
        msg = 'gMarker.key undefined and it is REQUIRED!!'
        $log.error msg

    add: (gMarker) =>
      gMarker.setMap @markerSpiderfier.map #puts on map (could optimize for draw.. ugh)
      @checkKey gMarker
      @markerSpiderfier.addMarker gMarker, @noDrawOnSingleAddRemoves
      @propMapGMarkers.put gMarker.key, gMarker
      @checkSync()

    #if you want flashing as in remove and then re-add use this
    #otherwise leave the marker in the map and just edit its properties (coords, icon etc)
    update: (gMarker) =>
      @remove gMarker
      @add gMarker

    addMany: (gMarkers) =>
      gMarkers.forEach (gMarker) =>
        @add gMarker

    remove: (gMarker) =>
      @checkKey gMarker
      exists = @propMapGMarkers.get gMarker.key
      if exists
        gMarker.setMap null #puts on map (could optimize for draw.. ugh)
        @markerSpiderfier.removeMarker(gMarker, @noDrawOnSingleAddRemoves)
        @propMapGMarkers.remove gMarker.key
      @checkSync()

    removeMany: (gMarkers) =>
      gMarkers.forEach (gMarker) =>
        @remove gMarker

    draw: () =>
      # @markerSpiderfier.repaint()

    clear: () =>
      @removeMany @getGMarkers()

    attachEvents: (options, optionsName) =>
      if angular.isDefined(options) and options? and angular.isObject(options)
        _.each options, (eventHandler, eventName) =>
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Attaching event: #{eventName} to markerSpiderfier"
            @markerSpiderfier.addListener eventName, =>
              if eventName == 'spiderfy' or eventName == 'unspiderfy'
                @scope.$evalAsync(options[eventName](arguments...))
              else #for consistency to be like EventsHelper
                @scope.$evalAsync(options[eventName]([arguments[0], eventName, arguments[0].model, arguments]...))

    clearEvents: (options, optionsName) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Clearing event: #{eventName} to markerSpiderfier"
            @markerSpiderfier.clearListeners eventName
      return

    destroy: =>
      @clearEvents @opt_events, 'opt_events'
      @clear()

    fit: =>
      FitHelper.fit @getGMarkers(), @markerSpiderfier.map

    getGMarkers: =>
      @markerSpiderfier.getMarkers()#is an array so this should be fine as markerSpiderfierMarkerManager returns .values() (Array)

    isSpiderfied: =>
      _.find @getGMarkers(), (gMarker) ->
        gMarker?._omsData?

    checkSync: =>
#      throw 'GMarkers out of Sync in MarkermarkerSpiderfier' if @getGMarkers().length != @propMapGMarkers.length
]
