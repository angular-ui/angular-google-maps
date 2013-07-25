/**!
 * The MIT License
 * 
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 * 
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

angular.module('google-maps', []);;(function() {
  this.module = function(names, fn) {
    var space, _name;
    if (typeof names === 'string') {
      names = names.split('.');
    }
    space = this[_name = names.shift()] || (this[_name] = {});
    space.module || (space.module = this.module);
    if (names.length) {
      return space.module(names, fn);
    } else {
      return fn.call(space);
    }
  };

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.module("oo", function() {
    var baseObjectKeywords;
    baseObjectKeywords = ['extended', 'included'];
    return this.BaseObject = (function() {
      function BaseObject() {}

      BaseObject.extend = function(obj) {
        var key, value, _ref;
        for (key in obj) {
          value = obj[key];
          if (__indexOf.call(baseObjectKeywords, key) < 0) {
            this[key] = value;
          }
        }
        if ((_ref = obj.extended) != null) {
          _ref.apply(0);
        }
        return this;
      };

      BaseObject.include = function(obj) {
        var key, value, _ref;
        for (key in obj) {
          value = obj[key];
          if (__indexOf.call(baseObjectKeywords, key) < 0) {
            this.prototype[key] = value;
          }
        }
        if ((_ref = obj.included) != null) {
          _ref.apply(0);
        }
        return this;
      };

      return BaseObject;

    })();
  });

}).call(this);

(function() {
  this.module("directives.api.utils", function() {
    return this.GmapUtil = {
      createMarkerOptions: function(map, coords, icon, animate, defaults) {
        var opts;
        opts = angular.extend({}, defaults, {
          position: new google.maps.LatLng(coords.latitude, coords.longitude),
          map: map.getMap(),
          icon: icon,
          visible: (coords.latitude != null) && (coords.longitude != null)
        });
        if (!animate) {
          delete opts.animation;
        }
        return opts;
      },
      createWindowOptions: function(gMarker, scope, content, defaults) {
        return angular.extend({}, defaults, {
          content: content,
          position: angular.isObject(gMarker) ? gMarker.getPosition() : new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude)
        });
      }
    };
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models", function() {
    return this.MarkerModel = (function(_super) {
      __extends(MarkerModel, _super);

      MarkerModel.include(directives.api.utils.GmapUtil);

      function MarkerModel(index, model, parentScope, mapCtrl, $timeout, $log, notifyLocalDestroy, defaults) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.destroy = __bind(this.destroy, this);
        var _this = this;
        this.index = index;
        this.iconKey = parentScope.icon;
        this.coordsKey = parentScope.coords;
        this.myScope = parentScope.$new(false);
        this.myScope.icon = this.iconKey === 'self' ? model : model[this.iconKey];
        this.myScope.coords = this.coordsKey === 'self' ? model : model[this.coordsKey];
        this.mapCtrl = mapCtrl;
        this.opts = this.createMarkerOptions(this.mapCtrl, this.myScope.coords, this.myScope.icon, defaults);
        this.gMarker = new google.maps.Marker(this.opts);
        google.maps.event.addListener(this.gMarker, 'click', function() {
          if (doClick && (this.myScope.click != null)) {
            return this.myScope.click();
          }
        });
        $timeout(function() {
          _this.watchCoords(_this.myScope);
          _this.watchIcon(_this.myScope);
          return _this.watchDestroy(_this.myScope);
        });
      }

      MarkerModel.prototype.destroy = function() {
        return this.myScope.$destroy();
      };

      MarkerModel.prototype.watchCoords = function(scope) {
        var _this = this;
        return scope.$watch('coords', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue) {
              _this.gmap.setMap(_this.mapCtrl.getMap());
              _this.gmap.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude));
              return _this.gmap.setVisible((newValue.latitude != null) && (newValue.longitude != null));
            } else {
              return _this.gmap.setMap(void 0);
            }
          }
        }, true);
      };

      MarkerModel.prototype.watchIcon = function(scope) {
        var _this = this;
        return scope.$watch('icon', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            _this.gmap.icon = newValue;
            _this.gmap.setMap(void 0);
            _this.gmap.setMap(_this.mapCtrl.getMap());
            _this.gmap.setPosition(new google.maps.LatLng(coords.latitude, coords.longitude));
            return _this.gmap.setVisible(coords.latitude && (coords.longitude != null));
          }
        }, true);
      };

      MarkerModel.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          _this.gmap.setMap(null);
          if (typeof notifyLocalDestroy !== "undefined" && notifyLocalDestroy !== null) {
            return notifyLocalDestroy(_this.index);
          }
        });
      };

      return MarkerModel;

    })(oo.BaseObject);
  });

}).call(this);


/*
	Functions are taking entireley local variables as to try and reuse functionality. 
	Hopefully this will work when an HTML Element is created or not for an InfoWindow.
*/

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models", function() {
    var _this = this;
    return this.WindowModelFunctions = {
      watchShow: function(scope, $http, $templateCache, $compile, gWin, showHandle, hideHandle, mapCtrl) {
        return scope.$watch('show()', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue) {
              return showHandle(scope, $http, $templateCache, $compile, gWin, mapCtrl);
            } else {
              return hideHandle(gWin);
            }
          } else {
            if (newValue && !win.getMap()) {
              return showHandle(scope, $http, $templateCache, $compile, gWin, mapCtrl);
            }
          }
        }, true);
      },
      handleClick: function(scope, mapCtrl, markerInstance, gWin, isIconVisibleOnClick, initialMarkerVisibility) {
        if (markerInstance != null) {
          google.maps.event.addListener(markerInstance, 'click', function() {
            gWin.setPosition(markerInstance.getPosition());
            gWin.open(mapCtrl);
            return markerInstance.setVisible(isIconVisibleOnClick);
          });
          return google.maps.event.addListener(gWin, 'closeclick', function() {
            markerInstance.setVisible(initialMarkerVisibility);
            return scope.closeClick();
          });
        }
      },
      showWindow: function(scope, $http, $templateCache, $compile, gWin, mapCtrl) {
        if (scope.templateUrl) {
          return $http.get(scope.templateUrl, {
            cache: $templateCache
          }).then(function(content) {
            var compiled, templateScope;
            templateScope = scope.$new();
            if (angular.isDefined(scope.templateParameter)) {
              templateScope.parameter = scope.templateParameter;
            }
            compiled = $compile(content.data)(templateScope);
            gWin.setContent(compiled.get(0));
            return gWin.open(mapCtrl);
          });
        } else {
          return gWin.open(mapCtrl);
        }
      },
      hideWindow: function(gWin) {
        return gWin.close();
      }
    };
  });

  this.module("directives.api.models", function() {
    return this.WindowModel = (function(_super) {
      __extends(WindowModel, _super);

      WindowModel.include(directives.api.models.WindowModelFunctions);

      function WindowModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $log, $http, $templateCache, $compile) {
        this.scope = scope;
        this.opts = opts;
        this.mapCtrl = mapCtrl;
        this.markerCtrl = markerCtrl;
        this.isIconVisibleOnClick = isIconVisibleOnClick;
        this.initialMarkerVisibility = this.markerCtrl != null ? this.markerCtrl.getVisible() : false;
        this.$log = $log;
        this.$http = $http;
        this.$templateCache = $templateCache;
        this.$compile = $compile;
        this.gWin = new google.maps.InfoWindow(opts);
        if (this.markerCtrl != null) {
          this.markerCtrl.setClickable(true);
        }
        this.handleClick(this.scope, this.mapCtrl, this.markerCtrl, this.gWin, this.isIconVisibleOnClick, this.initialMarkerVisibility);
        this.watchShow(scope, $http, $templateCache, this.$compile, this.gWin, this.showWindow, this.hideWindow, this.mapCtrl);
        this.$log.info(this);
      }

      return WindowModel;

    })(oo.BaseObject);
  });

}).call(this);


/*
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api", function() {
    return this.IMarker = (function(_super) {
      __extends(IMarker, _super);

      IMarker.prototype.DEFAULTS = {
        animation: google.maps.Animation.DROP
      };

      IMarker.prototype.isFalse = function(value) {
        return ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) !== -1;
      };

      function IMarker($log, $timeout) {
        this.linkInit = __bind(this.linkInit, this);
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.link = __bind(this.link, this);
        this.validateLinkedScope = __bind(this.validateLinkedScope, this);
        var self;
        self = this;
        this.clsName = "IMarker";
        this.$log = $log;
        this.$timeout = $timeout;
        this.restrict = 'ECMA';
        this.require = '^googleMap';
        this.priority = -1;
        this.transclude = true;
        this.replace = true;
        this.scope = {
          coords: '=coords',
          icon: '=icon',
          click: '&click'
        };
      }

      IMarker.prototype.controller = function($scope, $element) {
        return this.getMarker = function() {
          return $element.data('instance');
        };
      };

      IMarker.prototype.validateLinkedScope = function(scope) {
        var ret;
        ret = angular.isUndefined(scope.coords) || scope.coords === void 0;
        if (ret) {
          this.$log.error(this.clsName + ": no valid coords attribute found");
        }
        return ret;
      };

      IMarker.prototype.link = function(scope, element, attrs, mapCtrl) {
        var _this = this;
        if (this.validateLinkedScope(scope)) {
          return;
        }
        return this.$timeout(function() {
          var animate;
          animate = angular.isDefined(attrs.animate) && _this.isFalse(attrs.animate);
          _this.linkInit(element, mapCtrl, scope, animate, angular.isDefined(attrs.click));
          _this.watchCoords(scope);
          _this.watchIcon(scope);
          return _this.watchDestroy(scope);
        });
      };

      IMarker.prototype.watchCoords = function(scope) {
        throw new Exception("Not Implemented!!");
      };

      IMarker.prototype.watchIcon = function(scope) {
        throw new Exception("Not Implemented!!");
      };

      IMarker.prototype.watchDestroy = function(scope) {
        throw new Exception("Not Implemented!!");
      };

      IMarker.prototype.linkInit = function(element, mapCtrl, scope, animate) {
        throw new Exception("Not Implemented!!");
      };

      return IMarker;

    })(oo.BaseObject);
  });

}).call(this);


/*
	- interface directive for all window(s) to derrive from
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api", function() {
    return this.IWindow = (function(_super) {
      __extends(IWindow, _super);

      IWindow.include(directives.api.utils.GmapUtil);

      IWindow.prototype.DEFAULTS = {};

      function IWindow($log, $timeout, $compile, $http, $templateCache) {
        this.link = __bind(this.link, this);
        var self;
        self = this;
        this.clsName = "IWindow";
        this.restrict = 'ECMA';
        this.template = void 0;
        this.transclude = true;
        this.priority = -100;
        this.require = ['^googleMap', '^?marker'];
        this.scope = {
          coords: '=coords',
          show: '&show',
          templateUrl: '=templateurl',
          templateParameter: '=templateparameter',
          isIconVisibleOnClick: '=isiconvisibleonclick',
          closeClick: '&closeclick'
        };
        this.$log = $log;
        this.$timeout = $timeout;
        this.$compile = $compile;
        this.$http = $http;
        this.$templateCache = $templateCache;
      }

      IWindow.prototype.link = function(scope, element, attrs, ctrls) {
        throw new Exception("Not Implemented!!");
      };

      return IWindow;

    })(oo.BaseObject);
  });

}).call(this);


/*
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api", function() {
    return this.Marker = (function(_super) {
      __extends(Marker, _super);

      Marker.include(directives.api.utils.GmapUtil);

      function Marker($log, $timeout) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.linkInit = __bind(this.linkInit, this);
        this.validateLinkedScope = __bind(this.validateLinkedScope, this);
        var self;
        Marker.__super__.constructor.call(this, $log, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-marker" ng-transclude></span>';
        this.clsName = "Marker";
        $log.info(this);
        this.markers = {};
        this.mapCtrl = void 0;
      }

      Marker.prototype.validateLinkedScope = function(scope) {
        return Marker.__super__.validateLinkedScope.call(this, scope) || angular.isUndefined(scope.coords.latitude) || angular.isUndefined(scope.coords.longitude);
      };

      Marker.prototype.linkInit = function(element, mapCtrl, scope, animate, doClick) {
        var opts;
        this.mapCtrl = mapCtrl;
        opts = this.createMarkerOptions(mapCtrl, scope.coords, scope.icon, animate, this.DEFAULTS);
        this.markers[scope.$id] = new google.maps.Marker(opts);
        element.data('instance', this.markers[scope.$id]);
        return google.maps.event.addListener(this.markers[scope.$id], 'click', function() {
          if (doClick && (scope.click != null)) {
            return scope.click();
          }
        });
      };

      Marker.prototype.watchCoords = function(scope) {
        var _this = this;
        return scope.$watch('coords', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue) {
              _this.markers[scope.$id].setMap(_this.mapCtrl.getMap());
              _this.markers[scope.$id].setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude));
              return _this.markers[scope.$id].setVisible((newValue.latitude != null) && (newValue.longitude != null));
            } else {
              return _this.markers[scope.$id].setMap(void 0);
            }
          }
        }, true);
      };

      Marker.prototype.watchIcon = function(scope) {
        var _this = this;
        return scope.$watch('icon', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            _this.markers[scope.$id].icon = newValue;
            _this.markers[scope.$id].setMap(void 0);
            _this.markers[scope.$id].setMap(_this.mapCtrl.getMap());
            _this.markers[scope.$id].setPosition(new google.maps.LatLng(coords.latitude, coords.longitude));
            return _this.markers[scope.$id].setVisible(coords.latitude && (coords.longitude != null));
          }
        }, true);
      };

      Marker.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          _this.markers[scope.$id].setMap(null);
          return delete _this.markers[scope.$id];
        });
      };

      return Marker;

    })(directives.api.IMarker);
  });

}).call(this);


/*
Markers will map icon and coords differently than directibes.api.Marker. This is because Scope and the model marker are
not 1:1 in this setting.
	
	- icon - will be the iconKey to the marker value ie: to get the icon marker[iconKey]
	- coords - will be the coordsKey to the marker value ie: to get the icon marker[coordsKey]

    - watches from IMarker reflect that the look up key for a value has changed and not the actual icon or coords itself
    - actual changes to a model are tracked inside directives.api.model.MarkerModel
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api", function() {
    return this.Markers = (function(_super) {
      __extends(Markers, _super);

      function Markers($log, $timeout) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.createMarkers = __bind(this.createMarkers, this);
        this.linkInit = __bind(this.linkInit, this);
        this.validateLinkedScope = __bind(this.validateLinkedScope, this);
        var self;
        Markers.__super__.constructor.call(this, $log, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-markers" ng-transclude></span>';
        this.clsName = "Markers";
        this.scope.models = '=models';
        this.markers = {};
        this.markersIndex = 0;
        this.mapCtrl = void 0;
        this.$timeout = $timeout;
        this.$log.info(this);
      }

      Markers.prototype.validateLinkedScope = function(scope) {
        var modelsNotDefined;
        modelsNotDefined = angular.isUndefined(scope.models) || scope.models === void 0;
        if (modelsNotDefined) {
          this.$log.error(this.clsName + ": no valid models attribute found");
        }
        return Markers.__super__.validateLinkedScope.call(this, scope) || modelsNotDefined;
      };

      Markers.prototype.linkInit = function(element, mapCtrl, scope, animate, doClick) {
        this.mapCtrl = mapCtrl;
        return this.createMarkers(element, scope, animate, doClick);
      };

      Markers.prototype.createMarkers = function(element, scope, animate, doClick) {
        var model, _i, _len, _ref, _results,
          _this = this;
        _ref = scope.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push((function(model) {
            _this.markers[_this.markersIndex] = new directives.api.models.MarkerModel(_this.markersIndex, model, scope, _this.mapCtrl, _this.$timeout, _this.$log, function(index) {
              return delete _this.markers[index];
            }, _this.DEFAULTS);
            _this.markersIndex++;
            return element.data('instance', _this.markers);
          })(model));
        }
        return _results;
      };

      Markers.prototype.watchCoords = function(scope) {
        var _this = this;
        return scope.$watch('coords', function(newValue, oldValue) {
          var model, _i, _len, _ref, _results;
          if (newValue !== oldValue) {
            _ref = _this.markers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _results.push(model.coordsKey = newValue);
            }
            return _results;
          }
        }, true);
      };

      Markers.prototype.watchIcon = function(scope) {
        var _this = this;
        return scope.$watch('icon', function(newValue, oldValue) {
          var model, _i, _len, _ref, _results;
          if (newValue !== oldValue) {
            _ref = _this.markers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _results.push(model.iconKey = newValue);
            }
            return _results;
          }
        }, true);
      };

      Markers.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          var model, _i, _len, _ref, _results;
          _ref = _this.markers;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            model = _ref[_i];
            _results.push(model.destroy());
          }
          return _results;
        });
      };

      return Markers;

    })(directives.api.IMarker);
  });

}).call(this);


/*
	Window directive for GoogleMap Info Windows, where ng-repeat is being used....
	Where Html DOM element is 1:1 on Scope and a Model
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api", function() {
    return this.Window = (function(_super) {
      __extends(Window, _super);

      function Window($log, $timeout, $compile, $http, $templateCache) {
        this.link = __bind(this.link, this);
        var self;
        Window.__super__.constructor.call(this, $log, $timeout, $compile, $http, $templateCache);
        self = this;
        this.clsName = "Window";
        this.template = '<span class="angular-google-maps-window" ng-transclude></span>';
        this.$log.info(self);
      }

      Window.prototype.link = function(scope, element, attrs, ctrls) {
        var _this = this;
        return this.$timeout(function() {
          var isIconVisibleOnClick, mapCtrl, markerCtrl, opts;
          isIconVisibleOnClick = true;
          if (angular.isDefined(attrs.isiconvisibleonclick)) {
            isIconVisibleOnClick = scope.isIconVisibleOnClick;
          }
          mapCtrl = ctrls[0].getMap();
          markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1].getMarker() : void 0;
          opts = _this.createWindowOptions(markerCtrl, scope, element.html(), _this.DEFAULTS);
          if (mapCtrl != null) {
            return new directives.api.models.WindowModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, _this.$templateCache, _this.$compile);
          }
        }, 50);
      };

      return Window;

    })(directives.api.IWindow);
  });

}).call(this);
;/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

angular.module('google-maps')
    .directive('googleMap', ['$log', '$timeout', function ($log, $timeout) {

        "use strict";

        var DEFAULTS = {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        /*
         * Utility functions
         */

        /**
         * Check if a value is true
         */
        function isTrue(val) {
            return angular.isDefined(val) &&
                val !== null &&
                val === true ||
                val === '1' ||
                val === 'y' ||
                val === 'true';
        }

        return {
            /**
             *
             */
            restrict: 'ECMA',

            /**
             *
             */
            transclude: true,

            /**
             *
             */
            replace: false,

            /**
             *
             */
            //priority: 100,

            /**
             *
             */
            template: '<div class="angular-google-map"><div class="angular-google-map-container"></div><div ng-transclude style="display: none"></div></div>',

            /**
             *
             */
            scope: {
                center: '=center',          // required
                zoom: '=zoom',              // required
                dragging: '=dragging',      // optional
                markers: '=markers',        // optional
                refresh: '&refresh',        // optional
                windows: '=windows',        // optional
                events: '=events'           // optional
            },

            /**
             *
             */
            controller: ['$scope', function ($scope) {
                /**
                 * @return the map instance
                 */
                this.getMap = function () {
                    return $scope.map;
                };
            }],

            /**
             *
             * @param scope
             * @param element
             * @param attrs
             */
            link: function (scope, element, attrs) {

                // Center property must be specified and provide lat &
                // lng properties
                if (!angular.isDefined(scope.center) ||
                    (!angular.isDefined(scope.center.latitude) || !angular.isDefined(scope.center.longitude))) {

                    $log.error("angular-google-maps: could not find a valid center property");
                    return;
                }

                if (!angular.isDefined(scope.zoom)) {
                    $log.error("angular-google-maps: map zoom property not set");
                    return;
                }

                var el = angular.element(element);

                el.addClass("angular-google-map");

                // Parse options
                var opts = {options: {}};
                if (attrs.options) {
                    opts.options = angular.fromJson(attrs.options);
                }

                if (attrs.type) {
                    var type = attrs.type.toUpperCase();

                    if (google.maps.MapTypeId.hasOwnProperty(type)) {
                        opts.mapTypeId = google.maps.MapTypeId[attrs.type.toUpperCase()];
                    }
                    else {
                        $log.error('angular-google-maps: invalid map type "' + attrs.type + '"');
                    }
                }

                // Create the map
                var _m = new google.maps.Map(el.find('div')[1], angular.extend({}, DEFAULTS, opts, {
                    center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),
                    draggable: isTrue(attrs.draggable),
                    zoom: scope.zoom
                }));

                var dragging = false;

                google.maps.event.addListener(_m, 'dragstart', function () {
                    dragging = true;
                    $timeout(function () {
                        scope.$apply(function (s) {
                            s.dragging = dragging;
                        });
                    });
                });

                google.maps.event.addListener(_m, 'dragend', function () {
                    dragging = false;
                    $timeout(function () {
                        scope.$apply(function (s) {
                            s.dragging = dragging;
                        });
                    });
                });

                google.maps.event.addListener(_m, 'drag', function () {
                    var c = _m.center;

                    $timeout(function () {
                        scope.$apply(function (s) {
                            s.center.latitude = c.lat();
                            s.center.longitude = c.lng();
                        });
                    });
                });

                google.maps.event.addListener(_m, 'zoom_changed', function () {
                    if (scope.zoom != _m.zoom) {

                        $timeout(function () {
                            scope.$apply(function (s) {
                                s.zoom = _m.zoom;
                            });
                        });
                    }
                });

                google.maps.event.addListener(_m, 'center_changed', function () {
                    var c = _m.center;

                    $timeout(function () {
                        scope.$apply(function (s) {
                            if (!_m.dragging) {
                                s.center.latitude = c.lat();
                                s.center.longitude = c.lng();
                            }
                        });
                    });
                });

                if (angular.isDefined(scope.events) &&
                    scope.events !== null &&
                    angular.isObject(scope.events)) {

                    var getEventHandler = function (eventName) {
                        return function () {
                            scope.events[eventName].apply(scope, [_m, eventName, arguments ]);
                        };
                    };

                    for (var eventName in scope.events) {

                        if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
                            google.maps.event.addListener(_m, eventName, getEventHandler(eventName));
                        }
                    }
                }

                // Put the map into the scope
                scope.map = _m;

                google.maps.event.trigger(_m, "resize");

                // Check if we need to refresh the map
                if (!angular.isUndefined(scope.refresh())) {
                    scope.$watch("refresh()", function (newValue, oldValue) {
                        if (newValue && !oldValue) {
                            //  _m.draw();
                            var coords = new google.maps.LatLng(newValue.latitude, newValue.longitude);

                            if (isTrue(attrs.pan)) {
                                _m.panTo(coords);
                            }
                            else {
                                _m.setCenter(coords);
                            }


                        }
                    });
                }

                // Update map when center coordinates change
                scope.$watch('center', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    if (!dragging) {

                        var coords = new google.maps.LatLng(newValue.latitude, newValue.longitude);

                        if (isTrue(attrs.pan)) {
                            _m.panTo(coords);
                        }
                        else {
                            _m.setCenter(coords);
                        }

                        //_m.draw();
                    }
                }, true);

                scope.$watch('zoom', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    _m.setZoom(newValue);

                    //_m.draw();
                });
            }
        };
    }]);
;/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @authors Nicolas Laplante, Nicholas McCready https://plus.google.com/108189012221374960701
 */

/**
 * Map marker directive
 *
 * This directive is used to create a marker on an existing map.
 * This directive creates a new scope.
 *
 * {attribute coords required}  object containing latitude and longitude properties
 * {attribute icon optional}	string url to image used for marker icon
 * {attribute animate optional} if set to false, the marker won't be animated (on by default)
 */

angular.module('google-maps').directive('marker', ['$log', '$timeout', function($log,$timeout){ 
	return new directives.api.Marker($log,$timeout);}]);
;/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante, Nicholas McCready https://plus.google.com/108189012221374960701
 */

/**
 * Map marker directive
 *
 * This directive is used to create a marker on an existing map.
 * This directive creates a new scope.
 *
 * {attribute coords required}  object containing latitude and longitude properties
 * {attribute icon optional}	string url to image used for marker icon
 * {attribute animate optional} if set to false, the marker won't be animated (on by default)
 */

angular.module('google-maps').directive('markers', ['$log', '$timeout', function($log,$timeout){ 
	return new directives.api.Markers($log,$timeout);}]);
;/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

angular.module("google-maps")
    .directive("polyline", ['$log', '$timeout', function ($log, $timeout) {

        "use strict";

        var DEFAULTS = {

        };

        function validatePathPoints(path) {
            for (var i = 0; i < path.length; i++) {
              if (angular.isUndefined(path[i].latitude) ||
                  angular.isUndefined(path[i].longitude)) {
                  return false;
              }
            }

            return true;
        }

        function convertPathPoints(path) {
            var result = [];

            for (var i = 0; i < path.length; i++) {
                result.push(new google.maps.LatLng(path[i].latitude, path[i].longitude));
            }

            return result;
        }

        function extendMapBounds(map, points) {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < points.length; i++) {
                bounds.extend(points[i]);
            }

            map.fitBounds(bounds);
        }

        /*
         * Utility functions
         */

        /**
         * Check if a value is true
         */
        function isTrue(val) {
            return angular.isDefined(val) &&
                val !== null &&
                val === true ||
                val === '1' ||
                val === 'y' ||
                val === 'true';
        }

        return {
            restrict: 'ECA',
            require: '^googleMap',
            scope: {
                path: '=path',
                stroke: '=stroke'
            },
            link: function (scope, element, attrs, mapCtrl) {
                // Validate required properties
                if (angular.isUndefined(scope.path) ||
                    scope.path === null ||
                    scope.path.length < 2 ||
                    !validatePathPoints(scope.path)) {

                    $log.error("polyline: no valid path attribute found");
                    return;
                }

                // Wrap polyline initialization inside a $timeout() call to make sure the map is created already
                $timeout(function () {
                    var map = mapCtrl.getMap();

                    var pathPoints = convertPathPoints(scope.path);

                    var opts = angular.extend({}, DEFAULTS, {
                        map: map,
                        path: pathPoints,
                        strokeColor: scope.stroke && scope.stroke.color,
                        strokeOpacity: scope.stroke && scope.stroke.opacity,
                        strokeWeight: scope.stroke && scope.stroke.weight
                    });

                    var polyline = new google.maps.Polyline(opts);

                    if (isTrue(attrs.fit)) {
                        extendMapBounds(map, pathPoints);
                    }

                    scope.$watch('path', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            if (newValue) {
                                var newPathPoints = convertPathPoints(newValue);

                                polyline.setMap(map);
                                polyline.setPath(newPathPoints);

                                if (isTrue(attrs.fit)) {
                                    extendMapBounds(map, newPathPoints);
                                }
                            }
                            else {
                                // Remove polyline
                                polyline.setMap(null);
                            }
                        }
                    }, true);

                    // Remove polyline on scope $destroy
                    scope.$on("$destroy", function () {
                        polyline.setMap(null);
                    });
                });
            }
        };
    }]);
;/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

/**
 * Map info window directive
 *
 * This directive is used to create an info window on an existing map.
 * This directive creates a new scope.
 *
 * {attribute coords required}  object containing latitude and longitude properties
 * {attribute show optional}    map will show when this expression returns true
 */

angular.module("google-maps").directive("window", ['$log', '$timeout','$compile', '$http', '$templateCache', 
  function ($log, $timeout, $compile, $http, $templateCache) {
    return new directives.api.Window($log, $timeout, $compile, $http, $templateCache);
  }]);