/**
 * Performance overrides on MarkerClusterer custom to Angular Google Maps
 *
 * Created by Petr Bruna ccg1415 and Nick McCready on 7/13/14.
 */
/**
 * Adds a marker to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to be added.
 * @return {boolean} True if the marker was added.
 * @ignore
 */
Cluster.prototype.addMarker = function (marker) {
  var i;
  var mCount;
  var mz;

  if (this.isMarkerAlreadyAdded_(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } else {
    if (this.averageCenter_) {
      var l = this.markers_.length + 1;
      var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  this.markers_.push(marker);

  mCount = this.markers_.length;
  mz = this.markerClusterer_.getMaxZoom();
  if (mz !== null && this.map_.getZoom() > mz) {
    // Zoomed in past max zoom, so show the marker.
    if (marker.getMap() !== this.map_) {
      marker.setMap(this.map_);
    }
  } else if (mCount < this.minClusterSize_) {
    // Min cluster size not reached so show the marker.
    if (marker.getMap() !== this.map_) {
      marker.setMap(this.map_);
    }
  } else if (mCount === this.minClusterSize_) {
    // Hide the markers that were showing.
    for (i = 0; i < mCount; i++) {
      this.markers_[i].setMap(null);
    }
  } else {
    marker.setMap(null);
  }

//  this.updateIcon_();
  return true;
};


/**
 * Determines if a marker has already been added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker has already been added.
 */
Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
  var i;
  for (i = 0; i < this.markers_.length; i++) {
    if (marker.key === this.markers_[i].key) {
      return true;
    }
  }

  return false;
};

/**
 * Creates the clusters. This is done in batches to avoid timeout errors
 *  in some browsers when there is a huge number of markers.
 *
 * @param {number} iFirst The index of the first marker in the batch of
 *  markers to be added to clusters.
 */
MarkerClusterer.prototype.createClusters_ = function (iFirst) {
  var i, marker;
  var mapBounds;
  var cMarkerClusterer = this;
  if (!this.ready_) {
    return;
  }

  // Cancel previous batch processing if we're working on the first batch:
  if (iFirst === 0) {
    /**
     * This event is fired when the <code>MarkerClusterer</code> begins
     *  clustering markers.
     * @name MarkerClusterer#clusteringbegin
     * @param {MarkerClusterer} mc The MarkerClusterer whose markers are being clustered.
     * @event
     */
    google.maps.event.trigger(this, "clusteringbegin", this);

    if (typeof this.timerRefStatic !== "undefined") {
      clearTimeout(this.timerRefStatic);
      delete this.timerRefStatic;
    }
  }

  // Get our current map view bounds.
  // Create a new bounds object so we don't affect the map.
  //
  // See Comments 9 & 11 on Issue 3651 relating to this workaround for a Google Maps bug:
  if (this.getMap().getZoom() > 3) {
    mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),
        this.getMap().getBounds().getNorthEast());
  } else {
    mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
  }
  var bounds = this.getExtendedBounds(mapBounds);

  var iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);

  for (i = iFirst; i < iLast; i++) {
    marker = this.markers_[i];
    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
      if (!this.ignoreHidden_ || (this.ignoreHidden_ && marker.getVisible())) {
        this.addToClosestCluster_(marker);
      }
    }
  }

  if (iLast < this.markers_.length) {
    this.timerRefStatic = setTimeout(function () {
      cMarkerClusterer.createClusters_(iLast);
    }, 0);
  } else {
    // custom addition by ngmaps
    // update icon for all clusters
    for (i = 0; i < this.clusters_.length; i++) {
      this.clusters_[i].updateIcon_();
    }

    delete this.timerRefStatic;

    /**
     * This event is fired when the <code>MarkerClusterer</code> stops
     *  clustering markers.
     * @name MarkerClusterer#clusteringend
     * @param {MarkerClusterer} mc The MarkerClusterer whose markers are being clustered.
     * @event
     */
    google.maps.event.trigger(this, "clusteringend", this);
  }
};

