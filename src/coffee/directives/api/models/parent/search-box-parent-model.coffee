angular.module("google-maps.directives.api.models.parent".ns())
.factory "SearchBoxParentModel".ns(), ["BaseObject".ns(), "Logger".ns(), "EventsHelper".ns(), '$timeout', '$http', '$templateCache', (BaseObject, Logger, EventsHelper, $timeout, $http, $templateCache) ->
    class SearchBoxParentModel extends BaseObject
        @include EventsHelper
        constructor: (@scope, @element, @attrs, @gMap, @maps, @template, @$log = Logger) ->
            unless @attrs.template?
                @$log.info("template attribute for the search-box directive is mandatory. Places Search Box creation aborted!!")
                return

            @ctrlPosition = if angular.isDefined @scope.position then @scope.position.toUpperCase().replace /-/g, '_' else 'TOP_LEFT'
            if not @maps.ControlPosition[@ctrlPosition]
                @$log.error 'searchBox: invalid position property'
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

            #@setBounds()
            console.log @gMap.bounds

  
            @listener = google.maps.event.addListener @searchBox, 'places_changed', =>
                @places = @searchBox.getPlaces()

            @listeners = @setEvents @searchBox, @scope, @scope
            @$log.info @

            @scope.$watch("options", (newValue, oldValue) =>
                unless _.isEqual newValue, oldValue
                    @$log.info('watch options')
            , true)

            @scope.$on "$destroy", =>
                @searchBox = null

        addAsMapControl: () =>
            console.log 'add as map control'
            @gMap.controls[google.maps.ControlPosition[@ctrlPosition]].push(@input)

        addToParentDiv: () =>
            @parentDiv = angular.element document.getElementById(@scope.parentdiv)
            @parentDiv.append @input

        createSearchBox: () =>
            @searchBox = new google.maps.places.SearchBox @input, @scope.options

        setBounds: (bounds) =>
            @searchBox.setBounds(bounds)

        getBounds: () =>
            @searchBox.getBounds()
            

    SearchBoxParentModel
]
