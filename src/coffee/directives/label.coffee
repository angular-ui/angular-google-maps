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
.directive "markerLabel", ["$timeout", "ILabel", "MarkerLabelChildModel", "GmapUtil", "nggmap-PropertyAction"
  ($timeout, ILabel, MarkerLabelChildModel, GmapUtil, PropertyAction) ->
    class Label extends ILabel
      constructor: ($timeout) ->
        super($timeout)
        self = @
        @require = '^marker'
        @template = '<span class="angular-google-maps-marker-label" ng-transclude></span>'
        @$log.info(@)

      link: (scope, element, attrs, ctrl) =>
        markerScope = ctrl.getScope()
        if markerScope
          markerScope.deferred.promise.then =>
            @init markerScope, scope


      init: (markerScope, scope)=>
        label = null
        createLabel =  ->
          unless label
            label = new MarkerLabelChildModel markerScope.gMarker, scope, markerScope.map

        isFirstSet = true
        markerScope.$watch 'gMarker', (newVal, oldVal) ->
          if markerScope.gMarker?
            contentAction = new PropertyAction (newVal) ->
              createLabel()
              if scope.labelContent
                label?.setOption 'labelContent', scope.labelContent
            , isFirstSet
            anchorAction = new PropertyAction (newVal) ->
              createLabel()
              label?.setOption 'labelAnchor', scope.labelAnchor
            , isFirstSet
            classAction = new PropertyAction (newVal) ->
              createLabel()
              label?.setOption 'labelClass', scope.labelClass
            , isFirstSet
            styleAction = new PropertyAction (newVal) ->
              createLabel()
              label?.setOption 'labelStyle', scope.labelStyle
            , isFirstSet

            scope.$watch 'labelContent', contentAction.sic
            scope.$watch 'labelAnchor', anchorAction.sic
            scope.$watch 'labelClass', classAction.sic
            scope.$watch 'labelStyle', styleAction.sic
            isFirstSet = false

          scope.$on '$destroy', ->
            label?.destroy()

    new Label($timeout)
]