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

  this.module("directives.api.models.child", function() {
    return this.MarkerChildModel = (function(_super) {
      __extends(MarkerChildModel, _super);

      MarkerChildModel.include(directives.api.utils.GmapUtil);

      function MarkerChildModel(index, model, parentScope, gMap, $timeout, notifyLocalDestroy, defaults, doClick) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchIcon = __bind(this.watchIcon, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.setIcon = __bind(this.setIcon, this);
        this.setCoords = __bind(this.setCoords, this);
        this.destroy = __bind(this.destroy, this);
        this.setMyScope = __bind(this.setMyScope, this);
        var _this = this;
        this.index = index;
        this.model = model;
        this.parentScope = parentScope;
        this.iconKey = parentScope.icon;
        this.coordsKey = parentScope.coords;
        this.clickKey = parentScope.click();
        this.animateKey = parentScope.animate;
        this.myScope = parentScope.$new(false);
        this.setMyScope(model);
        this.myScope.$watch('model', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return _this.setMyScope(newValue);
          }
        }, true);
        this.defaults = defaults;
        this.gMap = gMap;
        this.opts = this.createMarkerOptions(this.gMap, this.myScope.coords, this.myScope.icon, this.myScope.animate, this.defaults);
        this.gMarker = new google.maps.Marker(this.opts);
        this.doClick = doClick;
        this.$log = directives.api.utils.Logger;
        google.maps.event.addListener(this.gMarker, 'click', function() {
          if (_this.doClick && (_this.myScope.click != null)) {
            return _this.myScope.click();
          }
        });
        this.setCoords(this.myScope);
        this.setIcon(this.myScope);
        $timeout(function() {
          _this.watchCoords(_this.myScope);
          _this.watchIcon(_this.myScope);
          return _this.watchDestroy(_this.myScope);
        });
      }

      MarkerChildModel.prototype.setMyScope = function(model) {
        this.myScope.icon = this.iconKey === 'self' ? model : model[this.iconKey];
        this.myScope.coords = this.coordsKey === 'self' ? model : model[this.coordsKey];
        this.myScope.click = this.clickKey === 'self' ? model : model[this.clickKey];
        this.myScope.animate = this.animateKey === 'self' ? model : model[this.animateKey];
        this.myScope.animate = this.animateKey === void 0 ? false : this.myScope.animate;
        return this.myScope.model = model;
      };

      MarkerChildModel.prototype.destroy = function() {
        return this.myScope.$destroy();
      };

      MarkerChildModel.prototype.setCoords = function(scope) {
        if (scope.$id !== this.myScope.$id) {
          return;
        }
        if ((scope.coords != null)) {
          this.gMarker.setMap(this.gMap.getMap());
          this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
          return this.gMarker.setVisible((scope.coords.latitude != null) && (scope.coords.longitude != null));
        } else {
          return this.gMarker.setMap(null);
        }
      };

      MarkerChildModel.prototype.setIcon = function(scope) {
        if (scope.$id !== this.myScope.$id) {
          return;
        }
        this.gMarker.icon = scope.icon;
        this.gMarker.setMap(null);
        this.gMarker.setMap(this.gMap.getMap());
        this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
        return this.gMarker.setVisible(scope.coords.latitude && (scope.coords.longitude != null));
      };

      MarkerChildModel.prototype.watchCoords = function(scope) {
        var _this = this;
        return scope.$watch('coords', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            _this.parentScope.doRebuild = false;
            _this.setCoords(scope);
            return _this.parentScope.doRebuild = true;
          }
        }, true);
      };

      MarkerChildModel.prototype.watchIcon = function(scope) {
        var _this = this;
        return scope.$watch('icon', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            _this.parentScope.doRebuild = false;
            _this.setIcon(scope);
            return _this.parentScope.doRebuild = true;
          }
        }, true);
      };

      MarkerChildModel.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          _this.gMarker.setMap(null);
          if (typeof notifyLocalDestroy !== "undefined" && notifyLocalDestroy !== null) {
            return notifyLocalDestroy(_this.index);
          }
        });
      };

      return MarkerChildModel;

    })(oo.BaseObject);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models.child", function() {
    return this.WindowChildModel = (function(_super) {
      __extends(WindowChildModel, _super);

      function WindowChildModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile, needToManualDestroy) {
        if (needToManualDestroy == null) {
          needToManualDestroy = false;
        }
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
        this.needToManualDestroy = needToManualDestroy;
        this.$log.info(this);
      }

      WindowChildModel.prototype.watchShow = function(scope, $http, $templateCache, $compile, gWin, showHandle, hideHandle, mapCtrl) {
        return scope.$watch('show', function(newValue, oldValue) {
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
      };

      WindowChildModel.prototype.handleClick = function(scope, mapCtrl, markerInstance, gWin, isIconVisibleOnClick, initialMarkerVisibility) {
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
      };

      WindowChildModel.prototype.showWindow = function(scope, $http, $templateCache, $compile, gWin, mapCtrl) {
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
      };

      WindowChildModel.prototype.hideWindow = function(gWin) {
        return gWin.close();
      };

      WindowChildModel.prototype.destroy = function() {
        this.hideWindow(this.gWin);
        if ((this.scope != null) && this.needToManualDestroy) {
          this.scope.$destroy();
        }
        delete this.gWin;
        return delete this;
      };

      return WindowChildModel;

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

  this.module("directives.api.models.parent", function() {
    return this.IMarkerParentModel = (function(_super) {
      __extends(IMarkerParentModel, _super);

      IMarkerParentModel.prototype.DEFAULTS = {
        animation: google.maps.Animation.DROP
      };

      IMarkerParentModel.prototype.isFalse = function(value) {
        return ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) !== -1;
      };

      function IMarkerParentModel(scope, element, attrs, mapCtrl, $timeout) {
        this.linkInit = __bind(this.linkInit, this);
        this.onDestroy = __bind(this.onDestroy, this);
        this.onWatch = __bind(this.onWatch, this);
        this.watch = __bind(this.watch, this);
        this.validateScope = __bind(this.validateScope, this);
        this.onTimeOut = __bind(this.onTimeOut, this);
        var self,
          _this = this;
        self = this;
        if (this.validateScope(scope)) {
          return;
        }
        this.animate = angular.isDefined(attrs.animate) ? !this.isFalse(attrs.animate) : false;
        this.doClick = angular.isDefined(attrs.click);
        this.mapCtrl = mapCtrl;
        this.clsName = "IMarker";
        this.$log = directives.api.utils.Logger;
        this.$timeout = $timeout;
        this.$timeout(function() {
          _this.watch('coords', scope);
          _this.watch('icon', scope);
          _this.watch('animate', scope);
          _this.onTimeOut(scope);
          return scope.$on("$destroy", function() {
            return _this.onDestroy(scope);
          });
        });
      }

      IMarkerParentModel.prototype.onTimeOut = function(scope) {};

      IMarkerParentModel.prototype.validateScope = function(scope) {
        var ret;
        ret = angular.isUndefined(scope.coords) || scope.coords === void 0;
        if (ret) {
          this.$log.error(this.clsName + ": no valid coords attribute found");
        }
        return ret;
      };

      IMarkerParentModel.prototype.watch = function(propNameToWatch, scope) {
        var _this = this;
        return scope.$watch(propNameToWatch, function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return _this.onWatch(propNameToWatch, scope, newValue, oldValue);
          }
        }, true);
      };

      IMarkerParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {
        throw new Exception("Not Implemented!!");
      };

      IMarkerParentModel.prototype.onDestroy = function(scope) {
        throw new Exception("Not Implemented!!");
      };

      IMarkerParentModel.prototype.linkInit = function(element, mapCtrl, scope, animate) {
        throw new Exception("Not Implemented!!");
      };

      return IMarkerParentModel;

    })(oo.BaseObject);
  });

}).call(this);

/*
	- interface directive for all window(s) to derrive from
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models.parent", function() {
    return this.IWindowParentModel = (function(_super) {
      __extends(IWindowParentModel, _super);

      IWindowParentModel.include(directives.api.utils.GmapUtil);

      IWindowParentModel.prototype.DEFAULTS = {};

      function IWindowParentModel(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) {
        var self;
        self = this;
        this.clsName = "directives.api.models.parent.IWindow";
        this.$log = directives.api.utils.Logger;
        this.$timeout = $timeout;
        this.$compile = $compile;
        this.$http = $http;
        this.$templateCache = $templateCache;
      }

      return IWindowParentModel;

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

  this.module("directives.api.models.parent", function() {
    return this.MarkerParentModel = (function(_super) {
      __extends(MarkerParentModel, _super);

      MarkerParentModel.include(directives.api.utils.GmapUtil);

      function MarkerParentModel(scope, element, attrs, mapCtrl, $timeout) {
        this.onDestroy = __bind(this.onDestroy, this);
        this.onWatch = __bind(this.onWatch, this);
        this.validateScope = __bind(this.validateScope, this);
        var opts, self,
          _this = this;
        MarkerParentModel.__super__.constructor.call(this, scope, element, attrs, mapCtrl, $timeout);
        self = this;
        this.clsName = "MarkerParentModel";
        opts = this.createMarkerOptions(mapCtrl, scope.coords, scope.icon, this.animate, this.DEFAULTS);
        this.gMarker = new google.maps.Marker(opts);
        element.data('instance', this.gMarker);
        this.scope = scope;
        google.maps.event.addListener(this.gMarker, 'click', function() {
          if (_this.doClick && (scope.click != null)) {
            return _this.scope.click();
          }
        });
        this.$log.info(this);
      }

      MarkerParentModel.prototype.validateScope = function(scope) {
        return MarkerParentModel.__super__.validateScope.call(this, scope) || angular.isUndefined(scope.coords.latitude) || angular.isUndefined(scope.coords.longitude);
      };

      MarkerParentModel.prototype.onWatch = function(propNameToWatch, scope) {
        switch (propNameToWatch) {
          case 'coords':
            if ((scope.coords != null) && (this.gMarker != null)) {
              this.gMarker.setMap(this.mapCtrl.getMap());
              this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
              return this.gMarker.setVisible((scope.coords.latitude != null) && (scope.coords.longitude != null));
            } else {
              return this.gMarker.setMap(null);
            }
            break;
          case 'icon':
            if ((scope.icon != null) && (scope.coords != null) && (this.gMarker != null)) {
              this.gMarker.icon = scope.icon;
              this.gMarker.setMap(null);
              this.gMarker.setMap(this.mapCtrl.getMap());
              this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
              return this.gMarker.setVisible(scope.coords.latitude && (scope.coords.longitude != null));
            }
            break;
          case 'animate':
            break;
        }
      };

      MarkerParentModel.prototype.onDestroy = function(scope) {
        if (this.gMarker === void 0) {
          delete this;
          return;
        }
        this.gMarker.setMap(null);
        delete this.gMarker;
        return delete this;
      };

      return MarkerParentModel;

    })(directives.api.models.parent.IMarkerParentModel);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models.parent", function() {
    return this.MarkersParentModel = (function(_super) {
      __extends(MarkersParentModel, _super);

      function MarkersParentModel(scope, element, attrs, mapCtrl, $timeout) {
        this.onDestroy = __bind(this.onDestroy, this);
        this.onWatch = __bind(this.onWatch, this);
        this.reBuildMarkers = __bind(this.reBuildMarkers, this);
        this.createMarkers = __bind(this.createMarkers, this);
        this.validateScope = __bind(this.validateScope, this);
        this.onTimeOut = __bind(this.onTimeOut, this);
        var self;
        MarkersParentModel.__super__.constructor.call(this, scope, element, attrs, mapCtrl, $timeout);
        self = this;
        this.clsName = "MarkersParentModel";
        this.markers = [];
        this.markersIndex = 0;
        this.scope = scope;
        this.$log.info(this);
      }

      MarkersParentModel.prototype.onTimeOut = function(scope) {
        this.watch('models', scope);
        return this.createMarkers(scope);
      };

      MarkersParentModel.prototype.validateScope = function(scope) {
        var modelsNotDefined;
        modelsNotDefined = angular.isUndefined(scope.models) || scope.models === void 0;
        if (modelsNotDefined) {
          this.$log.error(this.clsName + ": no valid models attribute found");
        }
        return MarkersParentModel.__super__.validateScope.call(this, scope) || modelsNotDefined;
      };

      MarkersParentModel.prototype.createMarkers = function(scope) {
        var model, _fn, _i, _len, _ref,
          _this = this;
        _ref = scope.models;
        _fn = function(model) {
          scope.doRebuild = true;
          _this.markers.push(new directives.api.models.child.MarkerChildModel(_this.markersIndex, model, scope, _this.mapCtrl, _this.$timeout, function(index) {
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

      MarkersParentModel.prototype.reBuildMarkers = function(scope) {
        var oldM, _fn, _i, _len, _ref,
          _this = this;
        if (!scope.doRebuild && scope.doRebuild !== void 0) {
          return;
        }
        _ref = this.markers;
        _fn = function(oldM) {
          return oldM.destroy();
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          oldM = _ref[_i];
          _fn(oldM);
        }
        delete this.markers;
        this.markers = [];
        this.markersIndex = 0;
        return this.createMarkers(scope);
      };

      MarkersParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {
        if (propNameToWatch === 'models' && newValue.length === oldValue.length) {
          return;
        }
        return this.reBuildMarkers(scope);
      };

      MarkersParentModel.prototype.onDestroy = function(scope) {
        var model, _i, _len, _ref, _results;
        _ref = this.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(model.destroy());
        }
        return _results;
      };

      return MarkersParentModel;

    })(directives.api.models.parent.IMarkerParentModel);
  });

}).call(this);

/*
	Windows directive where many windows map to the models property
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.module("directives.api.models.parent", function() {
    return this.WindowsParentModel = (function(_super) {
      __extends(WindowsParentModel, _super);

      function WindowsParentModel(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache, $interpolate) {
        this.interpolateContent = __bind(this.interpolateContent, this);
        this.setChildScope = __bind(this.setChildScope, this);
        this.createWindow = __bind(this.createWindow, this);
        this.setContentKeys = __bind(this.setContentKeys, this);
        this.createChildScopesWindows = __bind(this.createChildScopesWindows, this);
        this.watchOurScope = __bind(this.watchOurScope, this);
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.watchModels = __bind(this.watchModels, this);
        this.watch = __bind(this.watch, this);
        var name, self, _i, _len, _ref,
          _this = this;
        WindowsParentModel.__super__.constructor.call(this, scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache, $interpolate);
        self = this;
        this.$interpolate = $interpolate;
        this.clsName = "WindowsParentModel";
        this.windows = [];
        this.windwsIndex = 0;
        this.scopePropNames = ['show', 'coords', 'templateUrl', 'templateParameter', 'isIconVisibleOnClick', 'closeClick'];
        _ref = this.scopePropNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          this[name + 'Key'] = void 0;
        }
        this.linked = new directives.api.utils.Linked(scope, element, attrs, ctrls);
        this.models = void 0;
        this.contentKeys = void 0;
        this.isIconVisibleOnClick = void 0;
        this.firstTime = true;
        this.$log.info(self);
        this.$timeout(function() {
          _this.watchOurScope(scope);
          return _this.createChildScopesWindows();
        }, 50);
      }

      WindowsParentModel.prototype.watch = function(scope, name, nameKey) {
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
                return model.scope[name] = _this[nameKey] === 'self' ? model : model[_this[nameKey]];
              })(model));
            }
            return _results;
          }
        }, true);
      };

      WindowsParentModel.prototype.watchModels = function(scope) {
        var _this = this;
        return scope.$watch('models', function(newValue, oldValue) {
          var model, _fn, _i, _len, _ref;
          if (newValue !== oldValue && newValue.length !== oldValue.length) {
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

      WindowsParentModel.prototype.watchDestroy = function(scope) {
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

      WindowsParentModel.prototype.watchOurScope = function(scope) {
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

      WindowsParentModel.prototype.createChildScopesWindows = function() {
        /*
        			being that we cannot tell the difference in Key String vs. a normal value string (TemplateUrl)
        			we will assume that all scope values are string expressions either pointing to a key (propName) or using 
        			'self' to point the model as container/object of interest.	
        
        			This may force redundant information into the model, but this appears to be the most flexible approach.
        */

        var gMap, markersScope, mm, model, modelsNotDefined, _fn, _i, _j, _len, _len1, _ref, _ref1,
          _this = this;
        this.isIconVisibleOnClick = true;
        if (angular.isDefined(this.linked.attrs.isiconvisibleonclick)) {
          this.isIconVisibleOnClick = this.linked.scope.isIconVisibleOnClick;
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

      WindowsParentModel.prototype.setContentKeys = function(models) {
        if (models.length > 0) {
          return this.contentKeys = Object.keys(models[0]);
        }
      };

      WindowsParentModel.prototype.createWindow = function(model, gMarker, gMap) {
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

        var childScope, opts, parsedContent,
          _this = this;
        childScope = this.linked.scope.$new(false);
        this.setChildScope(childScope, model);
        childScope.$watch('model', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return _this.setChildScope(childScope, newValue);
          }
        }, true);
        parsedContent = this.interpolateContent(this.linked.element.html(), model);
        opts = this.createWindowOptions(gMarker, childScope, parsedContent, this.DEFAULTS);
        return this.windows.push(new directives.api.models.child.WindowChildModel(childScope, opts, this.isIconVisibleOnClick, gMap, gMarker, this.$http, this.$templateCache, this.$compile, true));
      };

      WindowsParentModel.prototype.setChildScope = function(childScope, model) {
        var name, _fn, _i, _len, _ref,
          _this = this;
        _ref = this.scopePropNames;
        _fn = function(name) {
          var nameKey, newValue;
          nameKey = name + 'Key';
          newValue = _this[nameKey] === 'self' ? model : model[_this[nameKey]];
          if (newValue !== childScope[name]) {
            return childScope[name] = newValue;
          }
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _fn(name);
        }
        return childScope.model = model;
      };

      WindowsParentModel.prototype.interpolateContent = function(content, model) {
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

      return WindowsParentModel;

    })(directives.api.models.parent.IWindowParentModel);
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

      function IMarker($timeout) {
        this.link = __bind(this.link, this);
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

      IMarker.prototype.link = function(scope, element, attrs, ctrl) {
        throw new Exception("Not implemented!!");
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
          show: '=show',
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

      function Marker($timeout) {
        this.link = __bind(this.link, this);
        var self;
        Marker.__super__.constructor.call(this, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-marker" ng-transclude></span>';
        this.clsName = "Marker";
        this.$log.info(this);
      }

      Marker.prototype.controller = function($scope, $element) {
        return this.getMarker = function() {
          return $element.data('instance');
        };
      };

      Marker.prototype.link = function(scope, element, attrs, ctrl) {
        return new directives.api.models.parent.MarkerParentModel(scope, element, attrs, ctrl, this.$timeout);
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
        this.link = __bind(this.link, this);
        var self;
        Markers.__super__.constructor.call(this, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-markers" ng-transclude></span>';
        this.clsName = "Markers";
        this.scope.models = '=models';
        this.$timeout = $timeout;
        this.$log.info(this);
      }

      Markers.prototype.controller = function($scope, $element) {
        return this.getMarkersScope = function() {
          return $scope;
        };
      };

      Markers.prototype.link = function(scope, element, attrs, ctrl) {
        return new directives.api.models.parent.MarkersParentModel(scope, element, attrs, ctrl, this.$timeout);
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

      Window.include(directives.api.utils.GmapUtil);

      function Window($timeout, $compile, $http, $templateCache) {
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
          var isIconVisibleOnClick, mapCtrl, markerCtrl, opts, window;
          isIconVisibleOnClick = true;
          if (angular.isDefined(attrs.isiconvisibleonclick)) {
            isIconVisibleOnClick = scope.isIconVisibleOnClick;
          }
          mapCtrl = ctrls[0].getMap();
          markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1].getMarker() : void 0;
          opts = _this.createWindowOptions(markerCtrl, scope, element.html(), _this.DEFAULTS);
          if (mapCtrl != null) {
            window = new directives.api.models.child.WindowChildModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, _this.$http, _this.$templateCache, _this.$compile);
          }
          return scope.$on("$destroy", function() {
            return window.destroy();
          });
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
        this.link = __bind(this.link, this);
        var self;
        Windows.__super__.constructor.call(this, $timeout, $compile, $http, $templateCache);
        self = this;
        this.$interpolate = $interpolate;
        this.clsName = "Windows";
        this.require = ['^googleMap', '^?markers'];
        this.template = '<span class="angular-google-maps-windows" ng-transclude></span>';
        this.scope.models = '=models';
        this.$log.info(self);
      }

      Windows.prototype.link = function(scope, element, attrs, ctrls) {
        return new directives.api.models.parent.WindowsParentModel(scope, element, attrs, ctrls, this.$timeout, this.$compile, this.$http, this.$templateCache, this.$interpolate);
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
                var settingCenterFromScope = false;
                google.maps.event.addListener(_m, 'center_changed', function () {
                    var c = _m.center;

                    if(settingCenterFromScope) 
                        return; //if the scope notified this change then there is no reason to update scope otherwise infinite loop
                    $timeout(function () {
                        scope.$apply(function (s) {
                            if (!_m.dragging) {
                                if(s.center.latitude !== c.lat())
                                    s.center.latitude = c.lat();
                                if(s.center.longitude !== c.lng())
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
                    settingCenterFromScope = true;
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
                    settingCenterFromScope = false;
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

angular.module('google-maps').directive('marker', ['$timeout', function ($timeout) { 
	return new directives.api.Marker($timeout);
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

angular.module('google-maps').directive('markers', ['$timeout', function ($timeout) { 
	return new directives.api.Markers($timeout);
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