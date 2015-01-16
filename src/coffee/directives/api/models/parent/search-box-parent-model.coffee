angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapSearchBoxParentModel', ['uiGmapBaseObject', 'uiGmapLogger',
'uiGmapEventsHelper', '$timeout', '$http', '$templateCache',
(BaseObject, Logger, EventsHelper, $timeout, $http, $templateCache) ->
    class SearchBoxParentModel extends BaseObject
        @include EventsHelper
        constructor: (@scope, @element, @attrs, @gMap, @ctrlPosition, @template, @$log = Logger) ->
            unless @attrs.template?
                @$log.error 'template attribute for the search-box directive is mandatory. Places Search Box creation aborted!!'
                return

            if angular.isUndefined @scope.options
                @scope.options = {}
                @scope.options.visible = true

            if angular.isUndefined @scope.options.visible
                @scope.options.visible = true

            if angular.isUndefined @scope.options.autocomplete
                @scope.options.autocomplete = false

            @visible = scope.options.visible
            @autocomplete = scope.options.autocomplete

            controlDiv = angular.element '<div></div>'
            controlDiv.append @template
            @input = controlDiv.find('input')[0]

            @init()

        init: =>
            @createSearchBox()

            @scope.$watch('options', (newValue, oldValue) =>
                if angular.isObject newValue
                    if newValue.bounds?
                        @setBounds(newValue.bounds)
                    if newValue.visible?
                        if @visible != newValue.visible
                            @setVisibility(newValue.visible)
            , true)

            if @attrs.parentdiv?
                @addToParentDiv()
            else
                @addAsMapControl()

            if @autocomplete
                @listener = google.maps.event.addListener @gObject, 'place_changed', =>
                    @places = @gObject.getPlace()
            else
                @listener = google.maps.event.addListener @gObject, 'places_changed', =>
                    @places = @gObject.getPlaces()

            @listeners = @setEvents @gObject, @scope, @scope
            @$log.info @

            @scope.$on '$destroy', =>
                @gObject = null

        addAsMapControl: =>
            @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].push(@input)

        addToParentDiv: =>
            @parentDiv = angular.element document.getElementById(@scope.parentdiv)
            @parentDiv.append @input

        createSearchBox: =>
            if @autocomplete
                @gObject = new google.maps.places.Autocomplete @input, @scope.options
            else
                @gObject = new google.maps.places.SearchBox @input, @scope.options

        setBounds: (bounds) =>
            if angular.isUndefined bounds.isEmpty
              @$log.error 'Error: SearchBoxParentModel setBounds. Bounds not an instance of LatLngBounds.'
              return
            else
              if bounds.isEmpty() == false
                  if @gObject?
                      @gObject.setBounds(bounds)

        getBounds: =>
            @gObject.getBounds()

        setVisibility: (val) =>
            if @attrs.parentdiv?
                if val == false then @parentDiv.addClass "ng-hide" else @parentDiv.removeClass "ng-hide"
            else
                if val == false then @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].clear() else @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].push(@input)
            @visible = val



    SearchBoxParentModel
]
