angular.module("google-maps.directives.api.models.parent".ns())
.factory "SearchBoxParentModel".ns(), ["BaseObject".ns(), "Logger".ns(), "EventsHelper".ns(), '$timeout', (BaseObject, Logger, EventsHelper, $timeout) ->
    class SearchBoxParentModel extends BaseObject
        @include EventsHelper
        constructor: (@scope, @element, @attrs, @gMap, @$log = Logger) ->
            #unless @attrs.input?
            #    @$log.info("input attribute for the search-box directive is mandatory. Places Search Box creation aborted!!")
            #    return
            @gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(@element.find('input'))
            @createSearchBox()

            @listener = google.maps.event.addListener @searchBox, 'places_changed', =>
                @$log.info "places_changed"
                @places = @searchBox.getPlaces()

            @listeners = @setEvents @searchBox, scope, scope
            @$log.info @

            @scope.$watch("options", (newValue, oldValue) =>
                unless _.isEqual newValue, oldValue
                    @$log.info('watch options')
            , true)

            @scope.$on "$destroy", =>
                @searchBox = null

        createSearchBox: () =>
            #bounds = new google.maps.LatLngBounds()
            @searchBox = new google.maps.places.SearchBox @element.find('input'), @scope.options

        setBounds: (bounds) =>
            @searchBox.setBounds(bounds)

        getBounds: () =>
            @searchBox.getBounds()
            

    SearchBoxParentModel
]
