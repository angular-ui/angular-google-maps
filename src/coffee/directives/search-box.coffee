###
@authors:
- Nicolas Laplante https://plus.google.com/108189012221374960701
- Nicholas McCready - https://twitter.com/nmccready
- Carrie Kengle - http://about.me/carrie
###

###
Places Search Box directive

This directive is used to create a Places Search Box.
This directive creates a new scope.

{attribute input required}  HTMLInputElement
{attribute options optional} The options that can be set on a SearchBox object (google.maps.places.SearchBoxOptions object specification)
###
angular.module("google-maps".ns())
.directive "SearchBox".ns(), ["GoogleMapApi".ns(), "Logger".ns(), "SearchBoxParentModel".ns(), '$http', '$templateCache',
  (GoogleMapApi, Logger, SearchBoxParentModel, $http, $templateCache) ->
    class SearchBox
      constructor:  ->
        @$log = Logger
        @restrict = "EMA"
        @require = '^' + 'GoogleMap'.ns()
        @priority = -1
        @transclude = true
        @template = '<span class=\"angular-google-map-search\" ng-transclude></span>'
        @replace = true
        @scope =
          template: '=template'
          position: '=position'
          options: '=options'
          events: '=events'
          parentdiv: '=parentdiv'

      link: (scope, element, attrs, mapCtrl) =>
        GoogleMapApi.then (maps) =>
          $http.get(scope.template, { cache: $templateCache })
            .success (template) =>
              mapCtrl.getScope().deferred.promise.then (map) =>
                ctrlPosition = if angular.isDefined scope.position then scope.position.toUpperCase().replace /-/g, '_' else 'TOP_LEFT'
                if not maps.ControlPosition[ctrlPosition]
                    @$log.error 'searchBox: invalid position property'
                    return
                new SearchBoxParentModel(scope, element, attrs, map, ctrlPosition, template)
    new SearchBox()
]
