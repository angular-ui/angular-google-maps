angular.module("google-maps.directives.api")
.factory "Markers", ["IMarker", "MarkersParentModel", '$timeout', (IMarker, MarkersParentModel, $timeout) ->
  class Markers extends IMarker
    constructor: ($timeout) ->
      super($timeout)
      @template = '<span class="angular-google-map-markers" ng-transclude></span>'
      @scope.doRebuildAll = '=dorebuildall' #root level directive attribute not a model level, should default to false
      @scope.models = '=models'
      @scope.doCluster = '=docluster'
      @scope.clusterOptions = '=clusteroptions'
      @scope.clusterEvents = '=clusterevents'
      @scope.labelContent = '=labelcontent'
      @scope.labelAnchor = '@labelanchor'
      @scope.labelClass = '@labelclass'

      @$timeout = $timeout
      self = @
      @$log.info @

    controller: ['$scope', '$element', ($scope, $element) ->
      getMarkersScope: ->
        $scope
    ]

    link: (scope, element, attrs, ctrl) =>
      parentModel = new MarkersParentModel(scope, element, attrs, ctrl, @$timeout)
      if scope.control?
        scope.control.getGMarkers = =>
          parentModel.gMarkerManager?.getGMarkers()
        scope.control.getChildMarkers = =>
          parentModel.markerModels
]
