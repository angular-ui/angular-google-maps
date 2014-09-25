angular.module("google-maps.directives.api.models.parent".ns())
.factory "SearchBoxParentModel".ns(), ["BaseObject".ns(), "Logger".ns(), "EventsHelper".ns(), '$timeout', '$http', '$templateCache', (BaseObject, Logger, EventsHelper, $timeout, $http, $templateCache) ->
    class SearchBoxParentModel extends BaseObject
        @include EventsHelper
        constructor: (@scope, @element, @attrs, @gMap, @ctrlPosition, @template, @$log = Logger) ->
            unless @attrs.template?
                @$log.error "template attribute for the search-box directive is mandatory. Places Search Box creation aborted!!"
                return

            controlDiv = angular.element '<div></div>'
            controlDiv.append @template
            @input = controlDiv.find('input')[0]
          
            @init()

        init: () =>
            @createSearchBox()

            if @attrs.parentdiv?
                @addToParentDiv()
            else
                @addAsMapControl()
  
            @listener = google.maps.event.addListener @searchBox, 'places_changed', =>
                @places = @searchBox.getPlaces()

            @listeners = @setEvents @searchBox, @scope, @scope
            @$log.info @

            @scope.$watch("options", (newValue, oldValue) =>
                if angular.isObject newValue
                    if newValue.bounds?
                        @setBounds(newValue.bounds)
            , true)

            @scope.$on "$destroy", =>
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
              @$log.error "Error: SearchBoxParentModel setBounds. Bounds not an instance of LatLngBounds."
              return
            else 
              if bounds.isEmpty() == false
                  if @searchBox?
                      @searchBox.setBounds(bounds)

        getBounds: () =>
            @searchBox.getBounds()
            

    SearchBoxParentModel
]
