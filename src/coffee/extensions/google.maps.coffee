#boot strap angular and extend google maps
angular.element(document).ready ->
    return unless google or google?.maps or google.maps.InfoWindow?
    #Taken from : http://stackoverflow.com/questions/12410062/check-if-infowindow-is-opened-google-maps-v3
    #
    #
    # modify the prototype for google.maps.Infowindow so that it is capable of tracking
    # the opened state of the window.  we track the state via boolean which is set when
    # open() or close() are called.  in addition to these, the closeclick event is
    # monitored so that the value of _openedState can be set when the close button is
    # clicked (see code at bottom of this file).
    #
    google.maps.InfoWindow::_open = google.maps.InfoWindow::open
    google.maps.InfoWindow::_close = google.maps.InfoWindow::close
    google.maps.InfoWindow::_isOpen = false

    google.maps.InfoWindow::open = (map, anchor) ->
        @_isOpen = true
        @_open map, anchor
        return

    google.maps.InfoWindow::close = ->
        @_isOpen = false
        @_close()
        return

    google.maps.InfoWindow::isOpen = (val = undefined ) ->
        unless val?
            return @_isOpen
        else
            @_isOpen = val

    ###
    Do the same for InfoBox
    TODO: Clean this up so the logic is defined once, wait until develop becomes master as this will be easier
    ###
    return unless window.InfoBox

    window.InfoBox::_open = window.InfoBox::open
    window.InfoBox::_close = window.InfoBox::close
    window.InfoBox::_isOpen = false

    window.InfoBox::open = (map, anchor) ->
        @_isOpen = true
        @_open map, anchor
        return

    window.InfoBox::close = ->
        @_isOpen = false
        @_close()
        return

    window.InfoBox::isOpen = (val = undefined ) ->
        unless val?
            return @_isOpen
        else
            @_isOpen = val