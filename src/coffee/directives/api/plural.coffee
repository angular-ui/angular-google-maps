angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPlural', [->
    extend: (obj, obj2) ->
      _.extend obj.scope or {}, obj2 or {},
        idKey: '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
        doRebuildAll: '=dorebuildall' #root level directive attribute not a model level, should default to false
        models: '=models'
        chunk: '=chunk' #false to disable chunking, otherwise a number to define chunk size
]
