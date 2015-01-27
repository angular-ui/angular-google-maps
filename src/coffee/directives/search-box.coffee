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
angular.module('uiGmapgoogle-maps')
.directive 'uiGmapSearchBox', ['uiGmapGoogleMapApi', 'uiGmapLogger',
'uiGmapSearchBoxParentModel', '$http', '$templateCache', '$compile',
  (GoogleMapApi, Logger, SearchBoxParentModel, $http, $templateCache, $compile) ->
    class SearchBox
      require: 'ngModel'
      constructor:  ->
        @$log = Logger
        @restrict = 'EMA'
        @require = '^' + 'uiGmapGoogleMap'
        @priority = -1
        @transclude = true
        @template = '<span class=\'angular-google-map-search\' ng-transclude></span>'
        @replace = true
        @scope =
          template: '=template' #required
          events: '=events' #required
          position: '=?position' #optional
          options: '=?options' #optional
          parentdiv: '=?parentdiv' #optional
          ngModel: "=?" #optional
      
      link: (scope, element, attrs, mapCtrl) =>
        GoogleMapApi.then (maps) =>
          $http.get(scope.template, { cache: $templateCache })
            .success (template) =>
              if angular.isUndefined scope.events
                @$log.error 'searchBox: the events property is required'
                return
              mapCtrl.getScope().deferred.promise.then (map) =>
                ctrlPosition = if angular.isDefined scope.position then scope.position.toUpperCase().replace /-/g, '_' else 'TOP_LEFT'
                if not maps.ControlPosition[ctrlPosition]
                    @$log.error 'searchBox: invalid position property'
                    return
                new SearchBoxParentModel(scope, element, attrs, map, ctrlPosition, $compile(template)(scope))
    new SearchBox()
]
