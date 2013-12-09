###
    Useful function callbacks that should be defined at later time.
    Mainly to be used for specs to verify creation / linking.

    This is to lead a common design in notifying child stuff.
###
@ngGmapModule "directives.api.utils", ->
    @ChildEvents =
        onChildCreation: (child) ->
            #doing nothing but can be hooked / overriden later