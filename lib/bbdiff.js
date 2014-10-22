function BBDiff() {
    this.getDir = function(r, s) {
        var dirLat = 0, dirLng = 0;
        if (r.ne.lng < s.ne.lng) {
          dirLng = 1;
        } else if (r.ne.lng > s.ne.lng) {
          dirLng = -1;
        }
        if (r.ne.lat < s.ne.lat) {
          dirLat = -1;
        } else if (r.ne.lat > s.ne.lat) {
          dirLat = 1;
        }
        return {
          lat: dirLat,
          lng: dirLng
        };
    };
}

BBDiff.prototype.getUpdateRegions = function(r, s, dirty, zoom) {
    var a, add, areas, b, c, d, dir, e, f, g, h, remove;
    a = Math.min(r.sw.lng, s.sw.lng);
    b = Math.max(r.sw.lng, s.sw.lng);
    c = Math.min(r.ne.lng, s.ne.lng);
    d = Math.max(r.ne.lng, s.ne.lng);
    e = Math.min(r.sw.lat, s.sw.lat);
    f = Math.max(r.sw.lat, s.sw.lat);
    g = Math.min(r.ne.lat, s.ne.lat);
    h = Math.max(r.ne.lat, s.ne.lat);
    areas = [];
    areas.push({ ne: { lat: f, lng: b }, sw: { lat: e, lng: a } });
    areas.push({ ne: { lat: f, lng: c }, sw: { lat: e, lng: b } });
    areas.push({ ne: { lat: f, lng: d }, sw: { lat: e, lng: c } });
    areas.push({ ne: { lat: g, lng: b }, sw: { lat: f, lng: a } });
    areas.push({ ne: { lat: g, lng: c }, sw: { lat: f, lng: b } });
    areas.push({ ne: { lat: g, lng: d }, sw: { lat: f, lng: c } });
    areas.push({ ne: { lat: h, lng: b }, sw: { lat: g, lng: a } });
    areas.push({ ne: { lat: h, lng: c }, sw: { lat: g, lng: b } });
    areas.push({ ne: { lat: h, lng: d }, sw: { lat: g, lng: c } });
    remove = [];
    add = [];
    if (zoom === 0) {
      dir = this.getDir(r, s);
      if (dir.lng > 0 && dir.lat === 0) {
        add = [areas[8], areas[5], areas[2]];
        remove = [areas[6], areas[3], areas[0]];
      } else if (dir.lng < 0 && dir.lat === 0) {
        add = [areas[6], areas[3], areas[0]];
        remove = [areas[8], areas[5], areas[2]];
      } else if (dir.lng === 0 && dir.lat > 0) {
        add = [areas[6], areas[7], areas[8]];
        remove = [areas[0], areas[1], areas[2]];
      } else if (dir.lng === 0 && dir.lat < 0) {
        add = [areas[0], areas[1], areas[2]];
        remove = [areas[6], areas[7], areas[8]];
      } else if (dir.lng > 0 && dir.lat > 0) {
        add = [areas[1], areas[2], areas[5]];
        remove = [areas[3], areas[6], areas[7]];
      } else if (dir.lng < 0 && dir.lat < 0) {
        add = [areas[3], areas[6], areas[7]];
        remove = [areas[1], areas[2], areas[5]];
      } else if (dir.lng > 0 && dir.lat < 0) {
        add = [areas[7], areas[8], areas[5]];
        remove = [areas[3], areas[0], areas[1]];
      } else if (dir.lng < 0 && dir.lat > 0) {
        add = [areas[3], areas[0], areas[1]];
        remove = [areas[7], areas[8], areas[5]];
      }
    } else if (zoom < 0) {
      remove = [areas[0], areas[1], areas[2], areas[3], areas[5], areas[6], areas[7], areas[8]];
    } else if (zoom > 0) {
      add = [areas[0], areas[1], areas[2], areas[3], areas[4], areas[5], areas[6], areas[7], areas[8]];
    }
    if (dirty) {
      add.push(areas[4]);
    }
    return {
      add: add,
      remove: remove
    };
};