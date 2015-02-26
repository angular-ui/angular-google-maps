/**
 * Performance overrides on MarkerClusterer custom to Angular Google Maps
 *
 * Created by Petr Bruna ccg1415 and Nick McCready on 7/13/14.
 */
angular.module('uiGmapgoogle-maps.extensions')
.service('uiGmapExtendMarkerClusterer',['uiGmapLodash', 'uiGmapPropMap', function (uiGmapLodash, PropMap) {
  return {
    init: _.once(function () {
      (function () {
        var __hasProp = {}.hasOwnProperty,
          __extends = function (child, parent) {
            for (var key in parent) {
              if (__hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          };

        window.NgMapCluster = (function (_super) {
          __extends(NgMapCluster, _super);

          function NgMapCluster(opts) {
            NgMapCluster.__super__.constructor.call(this, opts);
            this.markers_ = new PropMap();
          }

          /**
           * Adds a marker to the cluster.
           *
           * @param {google.maps.Marker} marker The marker to be added.
           * @return {boolean} True if the marker was added.
           * @ignore
           */
          NgMapCluster.prototype.addMarker = function (marker) {
            var i;
            var mCount;
            var mz;

            if (this.isMarkerAlreadyAdded_(marker)) {
              var oldMarker = this.markers_.get(marker.key);
              if (oldMarker.getPosition().lat() == marker.getPosition().lat() && oldMarker.getPosition().lon() == marker.getPosition().lon()) //if nothing has changed
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
              this.markers_.each(function (m) {
                m.setMap(null);
              });
            } else {
              marker.setMap(null);
            }

            //this.updateIcon_();
            return true;
          };

          /**
           * Determines if a marker has already been added to the cluster.
           *
           * @param {google.maps.Marker} marker The marker to check.
           * @return {boolean} True if the marker has already been added.
           */
          NgMapCluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
            return uiGmapLodash.isNullOrUndefined(this.markers_.get(marker.key));
          };


          /**
           * Returns the bounds of the cluster.
           *
           * @return {google.maps.LatLngBounds} the cluster bounds.
           * @ignore
           */
          NgMapCluster.prototype.getBounds = function () {
            var i;
            var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
            this.getMarkers().each(function(m){
              bounds.extend(m.getPosition());
            });
            return bounds;
          };


          /**
           * Removes the cluster from the map.
           *
           * @ignore
           */
          NgMapCluster.prototype.remove = function () {
            this.clusterIcon_.setMap(null);
            this.markers_ = new PropMap();
            delete this.markers_;
          };


          return NgMapCluster;

        })(Cluster);


        window.NgMapMarkerClusterer = (function (_super) {
          __extends(NgMapMarkerClusterer, _super);

          function NgMapMarkerClusterer(map, opt_markers, opt_options) {
            NgMapMarkerClusterer.__super__.constructor.call(this, map, opt_markers, opt_options);
            this.markers_ = new PropMap();
          }

          /**
           * Removes all clusters and markers from the map and also removes all markers
           *  managed by the clusterer.
           */
          NgMapMarkerClusterer.prototype.clearMarkers = function () {
            this.resetViewport_(true);
            this.markers_ = new PropMap();
          };
          /**
           * Removes a marker and returns true if removed, false if not.
           *
           * @param {google.maps.Marker} marker The marker to remove
           * @return {boolean} Whether the marker was removed or not
           */
          NgMapMarkerClusterer.prototype.removeMarker_ = function (marker) {
            if (!this.markers_.get(marker.key)) {
              return false;
            }
            marker.setMap(null);
            this.markers_.remove(marker.key); // Remove the marker from the list of managed markers
            return true;
          };

          /**
           * Creates the clusters. This is done in batches to avoid timeout errors
           *  in some browsers when there is a huge number of markers.
           *
           * @param {number} iFirst The index of the first marker in the batch of
           *  markers to be added to clusters.
           */
          NgMapMarkerClusterer.prototype.createClusters_ = function (iFirst) {
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
              google.maps.event.trigger(this, 'clusteringbegin', this);

              if (typeof this.timerRefStatic !== 'undefined') {
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

            var _ms = this.markers_.values();
            for (i = iFirst; i < iLast; i++) {
              marker = _ms[i];
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
              // custom addition by ui-gmap
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
              google.maps.event.trigger(this, 'clusteringend', this);
            }
          };

          /**
           * Adds a marker to a cluster, or creates a new cluster.
           *
           * @param {google.maps.Marker} marker The marker to add.
           */
          NgMapMarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
            var i, d, cluster, center;
            var distance = 40000; // Some large number
            var clusterToAddTo = null;
            for (i = 0; i < this.clusters_.length; i++) {
              cluster = this.clusters_[i];
              center = cluster.getCenter();
              if (center) {
                d = this.distanceBetweenPoints_(center, marker.getPosition());
                if (d < distance) {
                  distance = d;
                  clusterToAddTo = cluster;
                }
              }
            }

            if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
              clusterToAddTo.addMarker(marker);
            } else {
              cluster = new NgMapCluster(this);
              cluster.addMarker(marker);
              this.clusters_.push(cluster);
            }
          };

          /**
           * Redraws all the clusters.
           */
          NgMapMarkerClusterer.prototype.redraw_ = function () {
            this.createClusters_(0);
          };


          /**
           * Removes all clusters from the map. The markers are also removed from the map
           *  if <code>opt_hide</code> is set to <code>true</code>.
           *
           * @param {boolean} [opt_hide] Set to <code>true</code> to also remove the markers
           *  from the map.
           */
          NgMapMarkerClusterer.prototype.resetViewport_ = function (opt_hide) {
            var i, marker;
            // Remove all the clusters
            for (i = 0; i < this.clusters_.length; i++) {
              this.clusters_[i].remove();
            }
            this.clusters_ = [];

            // Reset the markers to not be added and to be removed from the map.
            this.markers_.each(function (marker) {
              marker.isAdded = false;
              if (opt_hide) {
                marker.setMap(null);
              }
            });
          };

          /**
           * Extends an object's prototype by another's.
           *
           * @param {Object} obj1 The object to be extended.
           * @param {Object} obj2 The object to extend with.
           * @return {Object} The new extended object.
           * @ignore
           */
          NgMapMarkerClusterer.prototype.extend = function (obj1, obj2) {
            return (function (object) {
              var property;
              for (property in object.prototype) {
                if (property !== 'constructor')
                  this.prototype[property] = object.prototype[property];
              }
              return this;
            }).apply(obj1, [obj2]);
          };
          ////////////////////////////////////////////////////////////////////////////////
          /*
          Other overrides relevant to MarkerClusterPlus
          */
          ////////////////////////////////////////////////////////////////////////////////
          /**
          * Positions and shows the icon.
          */
          ClusterIcon.prototype.show = function () {
            if (this.div_) {
              var img = "";
              // NOTE: values must be specified in px units
              var bp = this.backgroundPosition_.split(" ");
              var spriteH = parseInt(bp[0].trim(), 10);
              var spriteV = parseInt(bp[1].trim(), 10);
              var pos = this.getPosFromLatLng_(this.center_);
              this.div_.style.cssText = this.createCss(pos);
              img = "<img src='" + this.url_ + "' style='position: absolute; top: " + spriteV + "px; left: " + spriteH + "px; ";
              if (!this.cluster_.getMarkerClusterer().enableRetinaIcons_) {
                img += "clip: rect(" + (-1 * spriteV) + "px, " + ((-1 * spriteH) + this.width_) + "px, " +
                ((-1 * spriteV) + this.height_) + "px, " + (-1 * spriteH) + "px);";
              }
              // ADDED FOR RETINA SUPPORT
              else {
                img += "width: " + this.width_ + "px;" + "height: " + this.height_ + "px;";
              }
              // END ADD
              img += "'>";
              this.div_.innerHTML = img + "<div style='" +
              "position: absolute;" +
              "top: " + this.anchorText_[0] + "px;" +
              "left: " + this.anchorText_[1] + "px;" +
              "color: " + this.textColor_ + ";" +
              "font-size: " + this.textSize_ + "px;" +
              "font-family: " + this.fontFamily_ + ";" +
              "font-weight: " + this.fontWeight_ + ";" +
              "font-style: " + this.fontStyle_ + ";" +
              "text-decoration: " + this.textDecoration_ + ";" +
              "text-align: center;" +
              "width: " + this.width_ + "px;" +
              "line-height:" + this.height_ + "px;" +
              "'>" + this.sums_.text + "</div>";
              if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
                this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
              } else {
                this.div_.title = this.sums_.title;
              }
              this.div_.style.display = "";
            }
            this.visible_ = true;
          };
          //END OTHER OVERRIDES
          ////////////////////////////////////////////////////////////////////////////////

          return NgMapMarkerClusterer;

        })(MarkerClusterer);
      }).call(this);
    })
  };
}]);
