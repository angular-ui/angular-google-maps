###
    Useful function callbacks that should be defined at later time.
    Mainly to be used for specs to verify creation / linking.

    This is to lead a common design in notifying child stuff.
###
angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapChildEvents', ->
  onChildCreation: (child) ->
    #doing nothing but can be hooked / overriden later
