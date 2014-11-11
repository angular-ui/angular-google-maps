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
###

###
Map Layer directive

This directive is used to create any type of Layer from the google maps sdk.
This directive creates a new scope.

{attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
###
angular.module("uiGmapgoogle-maps")
.directive "uiGmapMapType", ["$timeout", "uiGmapLogger", "uiGmapMapTypeParentModel",
  ($timeout, Logger, MapTypeParentModel) ->
    class MapType
      constructor:  ->
        @$log = Logger
        @restrict = "EMA"
        @require = '^' + 'GoogleMap'.ns()
        @priority = -1
        @transclude = true
        @template = '<span class=\"angular-google-map-layer\" ng-transclude></span>'
        @replace = true
        @scope =
          show: "=show"
          options: '=options'
          refresh: '=refresh'
          id: '@'

      link: (scope, element, attrs, mapCtrl) =>
        mapCtrl.getScope().deferred.promise.then (map) =>
          new MapTypeParentModel(scope, element, attrs, map)
    new MapType()
]
