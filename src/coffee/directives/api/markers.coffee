angular.module("google-maps.directives.api".ns())
.factory "Markers".ns(), ["IMarker".ns(), "MarkersParentModel".ns(),"_sync".ns(), (IMarker, MarkersParentModel,_sync) ->
  class Markers extends IMarker
    constructor: ($timeout) ->
      super($timeout)
      @template = '<span class="angular-google-map-markers" ng-transclude></span>'
      @scope = _.extend @scope or {},
        idKey: '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
        doRebuildAll: '=dorebuildall' #root level directive attribute not a model level, should default to false
        models: '=models'
        doCluster: '=docluster'
        clusterOptions: '=clusteroptions'
        clusterEvents: '=clusterevents'

      @$log.info @

    controller: ['$scope', '$element', ($scope, $element) ->
      $scope.ctrlType = 'Markers'
      _.extend @, IMarker.handle($scope,$element)
    ]

    link: (scope, element, attrs, ctrl) =>
      parentModel = undefined
      ready = =>
        if scope.control?
          scope.control.getGMarkers = =>
            parentModel.gMarkerManager?.getGMarkers()
          scope.control.getChildMarkers = =>
            parentModel.markerModels
        scope.deferred.resolve()

      IMarker.mapPromise(scope, ctrl).then (map) =>
#        if @parentModel?
#          scope.deferred = Promise.defer()#reset deferred as the other is expired
#        fake = _sync.fakePromise()
#        maybeDeferred = @parentModel?.existingPieces || fake
#        maybeDeferred.then =>
        parentModel = new MarkersParentModel(scope, element, attrs, map)
        parentModel.existingPieces.then ->
          ready()

#        unless @parentModel?
#          maybeDeferred.resolve()



]
