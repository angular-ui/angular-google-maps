###
!
The MIT License

Copyright (c) 2010-2013 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

angular-google-maps
https://github.com/nlaplante/angular-google-maps

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
