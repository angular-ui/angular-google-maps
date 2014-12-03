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

            @visible = scope.options.visible

            controlDiv = angular.element '<div></div>'
            controlDiv.append @template
            @input = controlDiv.find('input')[0]

            @init()

        init: () =>
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

            @listener = google.maps.event.addListener @searchBox, 'places_changed', =>
                @places = @searchBox.getPlaces()

            @listeners = @setEvents @searchBox, @scope, @scope
            @$log.info @

            @scope.$on '$destroy', =>
                @searchBox = null

        addAsMapControl: () =>
            @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].push(@input)

        addToParentDiv: () =>
            @parentDiv = angular.element document.getElementById(@scope.parentdiv)
            @parentDiv.append @input

        createSearchBox: () =>
            @searchBox = new google.maps.places.SearchBox @input, @scope.options

        setBounds: (bounds) =>
            if angular.isUndefined bounds.isEmpty
              @$log.error 'Error: SearchBoxParentModel setBounds. Bounds not an instance of LatLngBounds.'
              return
            else
              if bounds.isEmpty() == false
                  if @searchBox?
                      @searchBox.setBounds(bounds)

        getBounds: () =>
            @searchBox.getBounds()

        setVisibility: (val) =>
            if @attrs.parentdiv?
                if val == false then @parentDiv.addClass "ng-hide" else @parentDiv.removeClass "ng-hide"
            else
                if val == false then @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].clear() else @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].push(@input)
            @visible = val



    SearchBoxParentModel
]
