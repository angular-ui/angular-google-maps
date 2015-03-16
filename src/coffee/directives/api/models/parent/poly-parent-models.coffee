['Polygon','Polyline'].forEach (name) ->
  angular.module('uiGmapgoogle-maps.directives.api.models.parent')
  .factory "uiGmap#{name}sParentModel", ['uiGmapBasePolysParentModel',"uiGmap#{name}ChildModel", "uiGmapI#{name}",
    (BasePolysParentModel, ChildModel,  IPoly) ->
      BasePolysParentModel(IPoly, ChildModel, name)
  ]