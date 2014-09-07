/*
 * #############################################################################
 * ## EZ Tween #################################################################
 * #############################################################################
 */
(function(window, undefined) {
  window.EZ = window.EZ || {};
  window.EZ.Easing = {
    Linear: function(percentComplete) {
      return percentComplete;
    }
  };
  var Tween = function(from) {
    if ( typeof from !== 'number' && Object.prototype.toString.call(from) !== '[object Object]' ) {
      throw 'from value must be an object or an integer';
    }
    this.from = from;
    this.to = from;
    this.duration = 0;
    this.interval = 10;
    this.tweenFn = EZ.Easing.Linear;
  };
  Tween.prototype.setTo = function(to) {
    if ( (typeof to) !== (typeof this.from) ) {
      throw 'to value must be the same type as from value';
    }
    this.to = to;
    return this;
  };
  Tween.prototype.setDuration = function(duration) {
    this.duration = duration;
    return this;
  };
  Tween.prototype.setInterval = function(interval) {
    this.interval = interval;
    return this;
  };
  Tween.prototype.setTweenFn = function(tweenFn) {
    this.tweenFn = tweenFn;
    return this;
  };
  Tween.prototype.start = function(stepCallback, completeCallback) {
    var timeElapsed = 0;
    var duration = parseInt(this.duration, 10);
    var interval = parseInt(this.interval, 10);
    if ( typeof this.tweenFn !== 'function' ) {
      throw 'tweenFn must be a function';
    }
    if ( isNaN(interval) || interval <= 0 ) {
      throw 'Interval must be a positive integer';
    }
    if ( isNaN(duration) || duration <= 0 ) {
      throw 'Duration must be a positive integer';
    }
    if ( interval > duration ) {
      duration = interval;
    }
    interval = makeIntervalFullyDivisible(interval, duration);

    var _self = this;
    var currentValue;
    var eLoop = window.setInterval(function() {
      timeElapsed += interval;
      if ( typeof _self.from === 'number' ) {
        currentValue = tweenNumeric(_self.from, _self.to - _self.from, _self.tweenFn(timeElapsed / duration));
      } else {
        currentValue = clone(_self.from);
        for ( var k in _self.to ) {
          if ( typeof _self.from[k] !== 'number' || typeof _self.to[k] !== 'number' ) {
            continue;
          }
          currentValue[k] = tweenNumeric(_self.from[k], _self.to[k] - _self.from[k], _self.tweenFn(timeElapsed / duration));
        }
      }
      if ( typeof stepCallback === 'function' ) {
        stepCallback.call(this, currentValue);
      }
      if ( timeElapsed >= duration ) {
        if ( typeof completeCallback === 'function' ) {
          completeCallback.call(this, currentValue);
        }
        window.clearInterval(eLoop);
      }
    }, interval);
    return this;
  };
  window.EZ.Tween = Tween;
  function tweenNumeric(from, valueDiff, percentComplete) {
    var result = from + (valueDiff * percentComplete);
    if ( result > from + valueDiff) {
      result = from + valueDiff;
    }
    return result;
  }
  function makeIntervalFullyDivisible(interval, duration) {
    return duration / Math.ceil(duration / interval);
  }
  function clone(obj) {
    if (null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }
})(window);

/*
 * #############################################################################
 * ## TRACKING CTRL ############################################################
 * #############################################################################
 */
(function(window, ng, undefined) {
  var app = ng.module('app', ['google-maps'.ns()]);
  app.controller('TrackingCtrl', ['$rootScope', '$scope', '$timeout', '$log', function($rootScope, $scope, $timeout, $log) {
    $scope.map = {
      center: {
        latitude: 53.406754,
        longitude: -2.158843
      },
      pan: true,
      zoom: 14,
      refresh: false,
      options: {
        disableDefaultUI: true
      },
      events:  {},
      bounds: {},
      markers: [{
        id: 1,
        location: {
          latitude: 53.406754,
          longitude: -2.158843
        },
        options: {
          title: 'Marker'
        },
        showWindow: false,
        moveTo: function(location, duration) {
          var _self = this;
          if ( typeof duration === 'undefined' ) {
            duration = 1;
          }
          (new EZ.Tween(_self.location))
              .setTo(location)
              .setDuration(duration)
              .setInterval(13)
              .start(function(location) {
                $scope.$apply(function() {
                  _self.location = location;
                });
              });
          return this;
        }
      }]
    };
    $scope.map.markers[0].moveTo({
      latitude: 53.416754,
      longitude: -2.148843
    }, 1000);
  }]);
})(window, angular);