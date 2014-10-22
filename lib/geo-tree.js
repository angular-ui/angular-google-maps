function GeoTree() {
  this.tree = new RBTree();
}

GeoTree.prototype.getLength = function() {
  return this.tree.getLength();
};

// supported args:
// { lat: ..., lng: ..., data: ... }  - single object
// [ { lat: ..., lng: ..., data: ... }, ... ]  - array of the above objects
// lat, lng, data  - 3 args
GeoTree.prototype.insert = function(arg1, arg2, arg3) {
  var lat, lng, data;
  if ('number' === typeof(arg1)) {
    lat = arg1;
    lng = arg2;
    data = arg3;
  } else if ('object' === typeof(arg1)) {
    if ('number' === typeof(arg1.length)) {
      for (var i = 0; i < arg1.length; i++) { this.insert(arg1[i]); }
      return;
    } else {
      lat = arg1.lat;
      lng = arg1.lng;
      data = arg1.data;
    }
  } else { return; } // unsupported args
  // lat: -90 .. +90
  var iLat = Math.round((lat + 90.0) * 100000);  // 5 decimal digits
  // lng: -180 .. +180
  var iLng = Math.round((lng + 180.0) * 100000);
  var idx = curve.xy2d(iLat, iLng);
  this.tree.insert(idx, { idx: idx, lat: lat, lng: lng, data: data} );
};

// supported args:
// -- no args --   - return all
// { lat: ..., lng: ... }  - return exact match
// { lat: ..., lng: ... }, { lat: ..., lng: ... }  - rectangle
// { lat: ..., lng: ... }, radius (in angles)  - circle
GeoTree.prototype.find = function(arg1, arg2, fn) {
  var all, radius, _ref;
  all = (0 === arguments.length);
  if (undefined === arg2) { arg2 = arg1; }
  if ('number' === typeof(arg2)) { radius = arg2; }
  var minLat, maxLat, minLng, maxLng, minIdx = -Infinity, maxIdx = Infinity;
  if (!all) {
    if (undefined === radius) {
      // rectangle
      minLat = Math.min(arg1.lat, arg2.lat);
      maxLat = Math.max(arg1.lat, arg2.lat);
      minLng = Math.min(arg1.lng, arg2.lng);
      maxLng = Math.max(arg1.lng, arg2.lng);
    } else {
      // circle
      minLat = Math.max(arg1.lat - radius, -90.0);
      maxLat = Math.min(arg1.lat + radius,  90.0);
      minLng = Math.max(arg1.lng - radius, -180.0);
      maxLng = Math.min(arg1.lng + radius,  180.0);
    }
    minIdx = curve.xy2d(Math.round((minLat + 90.0) * 100000),
                        Math.round((minLng + 180.0) * 100000));
    maxIdx = curve.xy2d(Math.round((maxLat + 90.0) * 100000),
                        Math.round((maxLng + 180.0) * 100000));
  }
  var candidates = this.tree.find(minIdx, maxIdx);
  var i, j, item, lat, lng, res = [], data;
  if (all) {
    for (i = 0; i < candidates.length; i++) {
      item = candidates[i];
      for (j = 0; j < item.length; j++) {
	data = item[j].data;
	if(!fn || (fn && fn(data))) { res.push(data); }
      }
    }
  } else {
    if (undefined === radius) {
      // rectangle
      for (i = 0; i < candidates.length; i++) {
        _ref = (item = candidates[i])[0];
        lat = _ref.lat;
        lng = _ref.lng;
        if (minLat <= lat && lat <= maxLat && minLng <= lng && lng <= maxLng) {
          for (j = 0; j < item.length; j++) {
	    data = item[j].data;
	    if(!fn || (fn && fn(data))) { res.push(data); }
	  }
	}
      }
    } else {
      // circle
      var radius2 = radius * radius;
      for (i = 0; i < candidates.length; i++) {
        _ref = (item = candidates[i])[0];
        lat = arg1.lat - _ref.lat;
        lng = arg1.lng - _ref.lng;
        if (lat * lat + lng * lng <= radius2) {
          for (j = 0; j < item.length; j++) {
	    data = item[j].data;
	    if(!fn || (fn && fn(data))) { res.push(data); }
	  }
        }
      }
    }
  }
  return res;
};

GeoTree.prototype.dump = function() {
  this.tree.dump();
};

// callback: function(data) { ... }
GeoTree.prototype.forEach = function(callback) {
  this.tree.forEach(function(item) { callback(item.data); });
};

