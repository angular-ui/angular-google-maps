angular.module('uiGmapgoogle-maps.directives.api.managers')
.factory 'uiGmapSpiderfierMarkerManager', ['uiGmapLogger',
'uiGmapFitHelper', 'uiGmapPropMap', 'uiGmapMarkerSpiderfier', ($log, FitHelper, PropMap, MarkerSpiderfier) ->
  class SpiderfierMarkerManager
    @type = 'SpiderfierMarkerManager'
    constructor: (gMap, opt_markers={}, @opt_options = {}, @opt_events) ->
      @type = SpiderfierMarkerManager.type

      @clusterer = new MarkerSpiderfier gMap, @opt_options

      @propMapGMarkers = new PropMap() #keep in sync with cluster.markers_

      @attachEvents @opt_events, 'opt_events'

      @noDrawOnSingleAddRemoves = true
      $log.info @

    checkKey: (gMarker) ->
      unless gMarker.key?
        msg = 'gMarker.key undefined and it is REQUIRED!!'
        $log.error msg

    add: (gMarker)=>
      gMarker.setMap @clusterer.map #puts on map (could optimize for draw.. ugh)
      @checkKey gMarker
      @clusterer.addMarker gMarker, @noDrawOnSingleAddRemoves
      @propMapGMarkers.put gMarker.key, gMarker
      @checkSync()

    #if you want flashing as in remove and then re-add use this
    #otherwise leave the marker in the map and just edit its properties (coords, icon etc)
    update: (gMarker) =>
      @remove gMarker
      @add gMarker

    addMany: (gMarkers)=>
      gMarkers.forEach (gMarker) =>
        @add gMarker

    remove: (gMarker)=>
      @checkKey gMarker
      exists = @propMapGMarkers.get gMarker.key
      if exists
        gMarker.setMap null #puts on map (could optimize for draw.. ugh)
        @clusterer.removeMarker(gMarker, @noDrawOnSingleAddRemoves)
        @propMapGMarkers.remove gMarker.key
      @checkSync()

    removeMany: (gMarkers)=>
      gMarkers.forEach (gMarker) =>
        @remove gMarker

    draw: ()=>
      # @clusterer.repaint()

    clear: ()=>
      @removeMany @getGMarkers()

    attachEvents: (options, optionsName) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Attaching event: #{eventName} to clusterer"
            @clusterer.addListener eventName, options[eventName]

    clearEvents: (options, optionsName) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Clearing event: #{eventName} to clusterer"
            @clusterer.clearListeners eventName

    destroy: =>
      @clearEvents @opt_events, 'opt_events'
      @clear()

    fit: =>
      FitHelper.fit @getGMarkers(), @clusterer.map

    getGMarkers: =>
      @clusterer.getMarkers()#is an array so this should be fine as ClustererMarkerManager returns .values() (Array)

    checkSync: =>
#      throw 'GMarkers out of Sync in MarkerClusterer' if @getGMarkers().length != @propMapGMarkers.length
]
