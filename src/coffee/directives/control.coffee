###
@authors
Adam Kreitals, kreitals@hotmail.com
###

###
mapControl directive

This directive is used to create a custom control element on an existing map.
This directive creates a new scope.

{attribute template required}  	string url of the template to be used for the control
{attribute position optional}  	string position of the control of the form top-left or TOP_LEFT defaults to TOP_CENTER
{attribute controller optional}	string controller to be applied to the template
{attribute index optional}		number index for controlling the order of similarly positioned mapControl elements
###
angular.module("uiGmapgoogle-maps")
.directive "uiGmapMapControl", ["uiGmapControl", (Control) ->
  new Control()
]
