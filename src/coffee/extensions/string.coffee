angular.module('uiGmapgoogle-maps.extensions')
.factory 'uiGmapString', ->
  (str) ->
    @contains = (value, fromIndex) ->
      str.indexOf(value, fromIndex) != -1
    @