###
	Basic Directive api for a marker. Basic in the sense that this directive
  contains 1:1 on scope and model.
	Thus there will be one html element per marker within the directive.
###
angular.module("google-maps.directives.api.models.parent".ns())
.factory "MarkerParentModel".ns(),
["IMarkerParentModel".ns(), "GmapUtil".ns(), "EventsHelper".ns(),
"ModelKey".ns(), "_async".ns(),
"MarkerOptions".ns(),"MarkerChildModel".ns(),
    (IMarkerParentModel, GmapUtil, EventsHelper, ModelKey, _async,
        MarkerOptions, MarkerChildModel) ->
        class MarkerParentModel extends IMarkerParentModel
          @include GmapUtil
          @include EventsHelper
          @include MarkerOptions
          constructor: (scope, element, attrs, map, $timeout, @gMarkerManager, @doFit) ->
            super(scope, element, attrs, map, $timeout)

            keys =
              icon :"icon"
              coords :"coords"
              click : ->
                "click"
              options :"options"
              idKey: "idKey"

            @promise =  new MarkerChildModel(scope, scope, keys, map, {}, doClick = true,
              @gMarkerManager, doDrawSelf = false, trackModel = false).deferred.promise

          onDestroy: (scope) =>
            #do nothing as MarkerChildModel handles this
        return MarkerParentModel
  ]
