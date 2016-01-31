angular.module('uiGmapgoogle-maps.directives.api').factory 'uiGmapRectangle',
['uiGmapLogger', 'uiGmapGmapUtil'
'uiGmapIRectangle', 'uiGmapRectangleParentModel',
  ($log, GmapUtil,IRectangle, RectangleParentModel) ->
    _.extend IRectangle,
      link: (scope, element, attrs, mapCtrl) ->
        mapCtrl.getScope().deferred.promise.then (gMap) ->
          new RectangleParentModel scope, element, attrs, gMap
]
