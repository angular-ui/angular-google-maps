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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.utils", function() {
    return this.Linked = (function(_super) {
      __extends(Linked, _super);

      function Linked(scope, element, attrs, ctrls) {
        this.scope = scope;
        this.element = element;
        this.attrs = attrs;
        this.ctrls = ctrls;
      }

      return Linked;

    })(oo.BaseObject);
  });

}).call(this);

(function() {
  this.module("directives.api.utils", function() {
    return this.Logger = {
      logger: void 0,
      doLog: false,
      info: function(msg) {
        if (directives.api.utils.Logger.doLog) {
          if (directives.api.utils.Logger.logger != null) {
            return directives.api.utils.Logger.logger.info(msg);
          } else {
            return console.info(msg);
          }
        }
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

      function MarkerModel(index, model, parentScope, gMap, $timeout, notifyLocalDestroy, defaults, doClick) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.destroy = __bind(this.destroy, this);
        var _this = this;
        this.index = index;
        this.model = model;
        this.iconKey = parentScope.icon;
        this.coordsKey = parentScope.coords;
        this.myScope = parentScope.$new(false);
        this.myScope.icon = this.iconKey === 'self' ? model : model[this.iconKey];
        this.myScope.coords = this.coordsKey === 'self' ? model : model[this.coordsKey];
        this.gMap = gMap;
        this.opts = this.createMarkerOptions(this.gMap, this.myScope.coords, this.myScope.icon, defaults);
        this.gMarker = new google.maps.Marker(this.opts);
        this.doClick = doClick;
        this.$log = directives.api.utils.Logger;
        google.maps.event.addListener(this.gMarker, 'click', function() {
          if (_this.doClick && (_this.myScope.click != null)) {
            return _this.myScope.click();
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
              _this.gMarker.setMap(_this.gMap.getMap());
              _this.gMarker.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude));
              return _this.gMarker.setVisible((newValue.latitude != null) && (newValue.longitude != null));
            } else {
              return _this.gMarker.setMap(null);
            }
          }
        }, true);
      };

      MarkerModel.prototype.watchIcon = function(scope) {
        var _this = this;
        return scope.$watch('icon', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            _this.gMarker.icon = newValue;
            _this.gMarker.setMap(null);
            _this.gMarker.setMap(_this.gMap.getMap());
            _this.gMarker.setPosition(new google.maps.LatLng(coords.latitude, coords.longitude));
            return _this.gMarker.setVisible(coords.latitude && (coords.longitude != null));
          }
        }, true);
      };

      MarkerModel.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          _this.gMarker.setMap(null);
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
	Functions are using entireley local variables as to try and reuse functionality. 
	Hopefully this will work when an HTML Element is created or not for an InfoWindow.

	IE if another window-model needs to be derrived for Windows or other Window directives.
*/

(function() {
  this.module("directives.api.models", function() {
    return this.WindowFunctions = {
      watchShow: function(scope, $http, $templateCache, $compile, gWin, showHandle, hideHandle, mapCtrl) {
        return scope.$watch('show()', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue) {
              return showHandle(scope, $http, $templateCache, $compile, gWin, mapCtrl);
            } else {
              return hideHandle(gWin);
            }
          } else {
            if (newValue && !gWin.getMap()) {
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

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models", function() {
    return this.WindowModel = (function(_super) {
      __extends(WindowModel, _super);

      WindowModel.include(directives.api.models.WindowFunctions);

      function WindowModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile) {
        this.destroy = __bind(this.destroy, this);
        this.scope = scope;
        this.opts = opts;
        this.mapCtrl = mapCtrl;
        this.markerCtrl = markerCtrl;
        this.isIconVisibleOnClick = isIconVisibleOnClick;
        this.initialMarkerVisibility = this.markerCtrl != null ? this.markerCtrl.getVisible() : false;
        this.$log = directives.api.utils.Logger;
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

      WindowModel.prototype.destroy = function() {
        this.hideWindow(this.gWin);
        this.scope.$destroy();
        delete this.gWin;
        return delete this;
      };

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

      function IMarker($timeout) {
        this.linkInit = __bind(this.linkInit, this);
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.link = __bind(this.link, this);
        this.validateLinkedScope = __bind(this.validateLinkedScope, this);
        var self;
        self = this;
        this.clsName = "IMarker";
        this.$log = directives.api.utils.Logger;
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
        throw new Exception("Not Implemented!!");
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

      function IWindow($timeout, $compile, $http, $templateCache) {
        this.link = __bind(this.link, this);
        var self;
        self = this;
        this.clsName = "IWindow";
        this.restrict = 'ECMA';
        this.template = void 0;
        this.transclude = true;
        this.priority = -100;
        this.require = void 0;
        this.scope = {
          coords: '=coords',
          show: '&show',
          templateUrl: '=templateurl',
          templateParameter: '=templateparameter',
          isIconVisibleOnClick: '=isiconvisibleonclick',
          closeClick: '&closeclick'
        };
        this.$log = directives.api.utils.Logger;
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

      function Marker($timeout) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.linkInit = __bind(this.linkInit, this);
        this.validateLinkedScope = __bind(this.validateLinkedScope, this);
        var self;
        Marker.__super__.constructor.call(this, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-marker" ng-transclude></span>';
        this.clsName = "Marker";
        this.$log.info(this);
        this.markers = {};
        this.mapCtrl = void 0;
      }

      Marker.prototype.controller = function($scope, $element) {
        return this.getMarker = function() {
          return $element.data('instance');
        };
      };

      Marker.prototype.validateLinkedScope = function(scope) {
        return Marker.__super__.validateLinkedScope.call(this, scope) || angular.isUndefined(scope.coords.latitude) || angular.isUndefined(scope.coords.longitude);
      };

      Marker.prototype.linkInit = function(element, mapCtrl, scope, animate, doClick) {
        var gMarker, opts;
        this.mapCtrl = mapCtrl;
        opts = this.createMarkerOptions(mapCtrl, scope.coords, scope.icon, animate, this.DEFAULTS);
        gMarker = new google.maps.Marker(opts);
        this.markers[scope.$id] = gMarker;
        element.data('instance', gMarker);
        return google.maps.event.addListener(gMarker, 'click', function() {
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
              return _this.markers[scope.$id].setMap(null);
            }
          }
        }, true);
      };

      Marker.prototype.watchIcon = function(scope) {
        var _this = this;
        return scope.$watch('icon', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            _this.markers[scope.$id].icon = newValue;
            _this.markers[scope.$id].setMap(null);
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

      function Markers($timeout) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.watchModels = __bind(this.watchModels, this);
        this.createMarkers = __bind(this.createMarkers, this);
        this.linkInit = __bind(this.linkInit, this);
        this.validateLinkedScope = __bind(this.validateLinkedScope, this);
        var self;
        Markers.__super__.constructor.call(this, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-markers" ng-transclude></span>';
        this.clsName = "Markers";
        this.scope.models = '=models';
        this.markers = [];
        this.markersIndex = 0;
        this.mapCtrl = void 0;
        this.$timeout = $timeout;
        this.doClick = void 0;
        this.animate = void 0;
        this.$log.info(this);
      }

      Markers.prototype.controller = function($scope, $element) {
        return this.getMarkersScope = function() {
          return $scope;
        };
      };

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
        this.doClick = doClick;
        this.animate = animate;
        this.watchModels(scope);
        return this.createMarkers(scope);
      };

      Markers.prototype.createMarkers = function(scope) {
        var model, _fn, _i, _len, _ref,
          _this = this;
        _ref = scope.models;
        _fn = function(model) {
          _this.markers.push(new directives.api.models.MarkerModel(_this.markersIndex, model, scope, _this.mapCtrl, _this.$timeout, function(index) {
            return delete _this.markers[index];
          }, _this.DEFAULTS, _this.doClick));
          return _this.markersIndex++;
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _fn(model);
        }
        return scope.markerModels = this.markers;
      };

      Markers.prototype.watchModels = function(scope) {
        var _this = this;
        return scope.$watch('models', function(newValue, oldValue) {
          var oldM, _fn, _i, _len, _ref;
          if (newValue !== oldValue) {
            _ref = _this.markers;
            _fn = function(oldM) {
              return oldM.destroy();
            };
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              oldM = _ref[_i];
              _fn(oldM);
            }
            delete _this.markers;
            _this.markers = [];
            _this.markersIndex = 0;
            return _this.createMarkers(scope);
          }
        }, true);
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

      function Window($timeout, $compile, $http, $templateCache, $interpolate) {
        this.link = __bind(this.link, this);
        var self;
        Window.__super__.constructor.call(this, $timeout, $compile, $http, $templateCache);
        self = this;
        this.clsName = "Window";
        this.require = ['^googleMap', '^?marker'];
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
            return new directives.api.models.WindowModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, _this.$http, _this.$templateCache, _this.$compile);
          }
        }, 50);
      };

      return Window;

    })(directives.api.IWindow);
  });

}).call(this);


/*
	Windows directive where many windows map to the models property
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api", function() {
    return this.Windows = (function(_super) {
      __extends(Windows, _super);

      function Windows($timeout, $compile, $http, $templateCache, $interpolate) {
        this.interpolateContent = __bind(this.interpolateContent, this);
        this.createWindow = __bind(this.createWindow, this);
        this.setContentKeys = __bind(this.setContentKeys, this);
        this.createChildScopesWindows = __bind(this.createChildScopesWindows, this);
        this.link = __bind(this.link, this);
        this.watchOurScope = __bind(this.watchOurScope, this);
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchModels = __bind(this.watchModels, this);
        this.watch = __bind(this.watch, this);
        var name, self, _i, _len, _ref;
        Windows.__super__.constructor.call(this, $timeout, $compile, $http, $templateCache);
        self = this;
        this.$interpolate = $interpolate;
        this.clsName = "Windows";
        this.require = ['^googleMap', '^?markers'];
        this.template = '<span class="angular-google-maps-windows" ng-transclude></span>';
        this.scope.models = '=models';
        this.windows = [];
        this.windwsIndex = 0;
        this.scopePropNames = ['show', 'coords', 'templateUrl', 'templateParameter', 'isIconVisibleOnClick', 'closeClick'];
        _ref = this.scopePropNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          this[name + 'Key'] = void 0;
        }
        this.linked = void 0;
        this.models = void 0;
        this.contentKeys = void 0;
        this.isIconVisibleOnClick = void 0;
        this.firstTime = true;
        this.$log.info(self);
      }

      Windows.prototype.watch = function(scope, name, nameKey) {
        var _this = this;
        return scope.$watch(name, function(newValue, oldValue) {
          var model, _i, _len, _ref, _results;
          if (newValue !== oldValue) {
            _this[nameKey] = typeof newValue === 'function' ? newValue() : newValue;
            _ref = _this.windows;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _results.push((function(model) {
                return model.scope[name] = _this[nameKey] === 'self' || _this[nameKey] === void 0 ? model : model[_this[nameKey]];
              })(model));
            }
            return _results;
          }
        }, true);
      };

      Windows.prototype.watchModels = function(scope) {
        var _this = this;
        return scope.$watch('models', function(newValue, oldValue) {
          var model, _fn, _i, _len, _ref;
          if (newValue !== oldValue) {
            _ref = _this.windows;
            _fn = function(model) {
              return model.destroy();
            };
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _fn(model);
            }
            _this.windows = [];
            _this.windowsIndex = 0;
            return _this.createChildScopesWindows();
          }
        }, true);
      };

      Windows.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          var model, _i, _len, _ref;
          _ref = _this.windows;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            model = _ref[_i];
            model.destroy();
          }
          delete _this.windows;
          _this.windows = [];
          return _this.windowsIndex = 0;
        });
      };

      Windows.prototype.watchOurScope = function(scope) {
        var name, _i, _len, _ref, _results,
          _this = this;
        _ref = this.scopePropNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _results.push((function(name) {
            var nameKey;
            nameKey = name + 'Key';
            _this[nameKey] = typeof scope[name] === 'function' ? scope[name]() : scope[name];
            return _this.watch(scope, name, nameKey);
          })(name));
        }
        return _results;
      };

      Windows.prototype.link = function(scope, element, attrs, ctrls) {
        var _this = this;
        this.linked = new directives.api.utils.Linked(scope, element, attrs, ctrls);
        return this.$timeout(function() {
          _this.watchOurScope(scope);
          return _this.createChildScopesWindows();
        }, 50);
      };

      Windows.prototype.createChildScopesWindows = function() {

        /*
        			being that we cannot tell the difference in Key String vs. a normal value string (TemplateUrl)
        			we will assume that all scope values are string expressions either pointing to a key (propName) or using 
        			'self' to point the model as container/object of interest.	
        
        			This may force redundant information into the model, but this appears to be the most flexible approach.
        */
        var gMap, isIconVisibleOnClick, markersScope, mm, model, modelsNotDefined, _fn, _i, _j, _len, _len1, _ref, _ref1,
          _this = this;
        this.isIconVisibleOnClick = true;
        if (angular.isDefined(this.linked.attrs.isiconvisibleonclick)) {
          isIconVisibleOnClick = this.linked.scope.isIconVisibleOnClick;
        }
        gMap = this.linked.ctrls[0].getMap();
        markersScope = this.linked.ctrls.length > 1 && (this.linked.ctrls[1] != null) ? this.linked.ctrls[1].getMarkersScope() : void 0;
        modelsNotDefined = angular.isUndefined(this.linked.scope.models) || scope.models === void 0;
        if (modelsNotDefined && (markersScope === void 0 || markersScope.markerModels === void 0 || markersScope.models === void 0)) {
          this.$log.info("No models to create windows from! Need direct models or models derrived from markers!");
          return;
        }
        if (gMap != null) {
          if (this.linked.scope.models != null) {
            this.models = this.linked.scope.models;
            if (this.firstTime) {
              this.watchModels(this.linked.scope);
              this.watchDestroy(this.linked.scope);
            }
            this.setContentKeys(this.linked.scope.models);
            _ref = this.linked.scope.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              this.createWindow(model, void 0, gMap);
            }
          } else {
            this.models = markersScope.models;
            if (this.firstTime) {
              this.watchModels(markersScope);
              this.watchDestroy(markersScope);
            }
            this.setContentKeys(markersScope.models);
            _ref1 = markersScope.markerModels;
            _fn = function(mm) {
              return _this.createWindow(mm.model, mm.gMarker, gMap);
            };
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              mm = _ref1[_j];
              _fn(mm);
            }
          }
        }
        return this.firstTime = false;
      };

      Windows.prototype.setContentKeys = function(models) {
        if (models.length > 0) {
          return this.contentKeys = Object.keys(models[0]);
        }
      };

      Windows.prototype.createWindow = function(model, gMarker, gMap) {

        /*
        			Create ChildScope to Mimmick an ng-repeat created scope, must define the below scope
        		  		scope= {
        					coords: '=coords',
        					show: '&show',
        					templateUrl: '=templateurl',
        					templateParameter: '=templateparameter',
        					isIconVisibleOnClick: '=isiconvisibleonclick',
        					closeClick: '&closeclick'
        				}
        */
        var childScope, name, opts, parsedContent, _fn, _i, _len, _ref,
          _this = this;
        childScope = this.linked.scope.$new(false);
        _ref = this.scopePropNames;
        _fn = function(name) {
          var nameKey;
          nameKey = name + 'Key';
          return childScope[name] = _this[nameKey] === 'self' || _this[nameKey] === void 0 ? model : model[_this[nameKey]];
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _fn(name);
        }
        parsedContent = this.interpolateContent(this.linked.element.html(), model);
        opts = this.createWindowOptions(gMarker, childScope, parsedContent, this.DEFAULTS);
        return this.windows.push(new directives.api.models.WindowModel(childScope, opts, this.isIconVisibleOnClick, gMap, gMarker, this.$http, this.$templateCache, this.$compile));
      };

      Windows.prototype.interpolateContent = function(content, model) {
        var exp, interpModel, key, _i, _len, _ref;
        if (this.contentKeys === void 0 || this.contentKeys.length === 0) {
          return;
        }
        exp = this.$interpolate(content);
        interpModel = {};
        _ref = this.contentKeys;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          interpModel[key] = model[key];
        }
        return exp(interpModel);
      };

      return Windows;

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
        
        directives.api.utils.Logger.logger = $log;

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

angular.module('google-maps').directive('marker', ['$timeout', function($timeout){ 
	return new directives.api.Marker($timeout);}]);
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

angular.module('google-maps').directive('markers', ['$timeout', function($timeout){ 
	return new directives.api.Markers($timeout);}]);
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

angular.module("google-maps").directive("window", ['$timeout','$compile', '$http', '$templateCache', 
  function ($timeout, $compile, $http, $templateCache) {
    return new directives.api.Window($timeout, $compile, $http, $templateCache);
  }]);;/**!
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
 * @authors: 
 *			- Nicolas Laplante https://plus.google.com/108189012221374960701 
 *			- Nicholas McCready  https://plus.google.com/112199819969944829348
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

angular.module("google-maps").directive("windows", ['$timeout','$compile', '$http', '$templateCache', '$interpolate',
  function ($timeout, $compile, $http, $templateCache,$interpolate) {
    return new directives.api.Windows($timeout, $compile, $http, $templateCache, $interpolate);
  }]);