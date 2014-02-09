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

@authors Bruno Queiroz, creativelikeadog@gmail.com
###

###
Marker label directive

This directive is used to create a marker label on an existing map.

{attribute content required}  content of the label
{attribute anchor required}    string that contains the x and y point position of the label
{attribute class optional} class to DOM object
{attribute style optional} style for the label
###
###
Basic Directive api for a label. Basic in the sense that this directive contains 1:1 on scope and model.
Thus there will be one html element per marker within the directive.
###
angular.module("google-maps")
.directive "markerLabel", ["$timeout", "ILabel", "MarkerLabelChildModel", "GmapUtil", ($timeout, ILabel, MarkerLabelChildModel, GmapUtil) ->
    class Label extends ILabel
        constructor: ($timeout) ->
            super($timeout)
            self = @
            @require = '^marker'
            @template = '<span class="angular-google-maps-marker-label" ng-transclude></span>'
            @$log.info(@)
        link: (scope, element, attrs, ctrl) =>
            @$timeout( =>
                markerCtrl = ctrl.getMarkerScope().gMarker
                if markerCtrl?
                    label = new MarkerLabelChildModel(markerCtrl, scope)
                scope.$on("$destroy", =>
                    label.destroy()
                )
            ,GmapUtil.defaultDelay + 25)
    new Label($timeout)
]