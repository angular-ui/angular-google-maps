// (X,Y) --> idx
var curve = {
  xy2d: function(x, y) {
    var bit = 1, max = Math.max(x,y), res = 0.0;
    while (bit <= max) bit <<= 1;
    bit >>= 1;
    while (bit) {
      res *= 2.0;
      if (x & bit) res += 1.0;
      res *= 2.0;
      if (y & bit) res += 1.0;
      bit >>= 1;
    }
    return res;
  }
};