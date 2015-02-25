angular.module('uiGmapgoogle-maps.directives.api.managers')
.factory 'uiGmapClustererMarkerManager', ['uiGmapLogger',
'uiGmapFitHelper', 'uiGmapPropMap', ($log, FitHelper, PropMap) ->
  class ClustererMarkerManager
    @type = 'ClustererMarkerManager'
    constructor: (gMap, opt_markers={}, @opt_options = {}, @opt_events) ->
      @type = ClustererMarkerManager.type

      @clusterer = new NgMapMarkerClusterer gMap, opt_markers, @opt_options

      @propMapGMarkers = new PropMap() #keep in sync with cluster.markers_

      @attachEvents @opt_events, 'opt_events'

      @clusterer.setIgnoreHidden true
      @noDrawOnSingleAddRemoves = true
      $log.info @

    checkKey: (gMarker) ->
      unless gMarker.key?
        msg = 'gMarker.key undefined and it is REQUIRED!!'
        $log.error msg

    add: (gMarker)=>
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
        @clusterer.removeMarker(gMarker, @noDrawOnSingleAddRemoves)
        @propMapGMarkers.remove gMarker.key
      @checkSync()

    removeMany: (gMarkers)=>
      gMarkers.forEach (gMarker) =>
        @remove gMarker

    draw: ()=>
      @clusterer.repaint()

    clear: ()=>
      @removeMany @getGMarkers()
      @clusterer.repaint()

    attachEvents: (options, optionsName) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Attaching event: #{eventName} to clusterer"
            google.maps.event.addListener @clusterer, eventName, options[eventName]

    clearEvents: (options, optionsName) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Clearing event: #{eventName} to clusterer"
            google.maps.event.clearListeners @clusterer, eventName

    destroy: =>
      @clearEvents @opt_events, 'opt_events'
      @clear()

    fit: =>
      FitHelper.fit @getGMarkers(), @clusterer.getMap()

    getGMarkers: =>
      @clusterer.getMarkers().values()

    checkSync: =>
#      throw 'GMarkers out of Sync in MarkerClusterer' if @getGMarkers().length != @propMapGMarkers.length

  ClustererMarkerManager
]
