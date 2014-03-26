$ ->
    #Takes from : http://stackoverflow.com/questions/12410062/check-if-infowindow-is-opened-google-maps-v3
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
