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

@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
###

###
Map marker directive

This directive is used to create a marker on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute icon optional}    string url to image used for marker icon
{attribute animate optional} if set to false, the marker won't be animated (on by default)
###
angular.module("google-maps").directive "markers",
        ["$timeout", "IMarker", "MarkersParentModel", ($timeout, IMarker, MarkersParentModel) ->
            class Markers extends IMarker
                constructor: ($timeout) ->
                    super($timeout)
                    self = @
                    @template = '<span class="angular-google-map-markers" ng-transclude></span>'

                    @scope.idKey = '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
                    @scope.doRebuildAll = '=dorebuildall' #root level directive attribute not a model level
                    @scope.models = '=models'
                    @scope.doCluster = '=docluster'
                    @scope.clusterOptions = '=clusteroptions'
                    @scope.fit = '=fit'
                    @scope.labelContent = '=labelcontent'
                    @scope.labelAnchor = '@labelanchor'
                    @scope.labelClass = '@labelclass'


                    @$timeout = $timeout
                    @$log.info @

                controller: ['$scope', '$element', ($scope, $element) ->
                    getMarkersScope: ->
                        $scope
                ]

                link: (scope, element, attrs, ctrl) =>
                    new MarkersParentModel(scope, element, attrs, ctrl, @$timeout)
            new Markers($timeout)
        ]