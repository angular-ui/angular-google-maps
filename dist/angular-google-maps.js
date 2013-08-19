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

(function(){
    var app = angular.module('google-maps', []);

    app.factory('debounce', ['$timeout', function ($timeout) {
        return function(fn){ // debounce fn
            var nthCall = 0;
            return function(){ // intercepting fn
                var that = this;
                var argz = arguments;
                nthCall++;
                var later = (function(version){
                    return function(){
                        if (version === nthCall){
                            return fn.apply(that, argz);
                        }
                    };
                })(nthCall);
                return $timeout(later,0, true);
            };
        };
    }]);
})();;(function() {
  this.ngGmapModule = function(names, fn) {
    var space, _name;
    if (typeof names === 'string') {
      names = names.split('.');
    }
    space = this[_name = names.shift()] || (this[_name] = {});
    space.ngGmapModule || (space.ngGmapModule = this.ngGmapModule);
    if (names.length) {
      return space.ngGmapModule(names, fn);
    } else {
      return fn.call(space);
    }
  };

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.ngGmapModule("oo", function() {
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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.ngGmapModule("directives.api.managers", function() {
    return this.ClustererMarkerManager = (function(_super) {
      __extends(ClustererMarkerManager, _super);

      function ClustererMarkerManager(gMap, opt_markers, opt_options) {
        this.clear = __bind(this.clear, this);
        this.draw = __bind(this.draw, this);
        this.removeMany = __bind(this.removeMany, this);
        this.remove = __bind(this.remove, this);
        this.addMany = __bind(this.addMany, this);
        this.add = __bind(this.add, this);
        var self;
        ClustererMarkerManager.__super__.constructor.call(this);
        self = this;
        this.clusterer = new MarkerClusterer(gMap);
        this.clusterer.setIgnoreHidden(true);
        this.$log = directives.api.utils.Logger;
        this.noDrawOnSingleAddRemoves = true;
        this.$log.info(this);
      }

      ClustererMarkerManager.prototype.add = function(gMarker) {
        return this.clusterer.addMarker(gMarker, this.noDrawOnSingleAddRemoves);
      };

      ClustererMarkerManager.prototype.addMany = function(gMarkers) {
        return this.clusterer.addMarkers(gMarkers);
      };

      ClustererMarkerManager.prototype.remove = function(gMarker) {
        return this.clusterer.removeMarker(gMarker, this.noDrawOnSingleAddRemoves);
      };

      ClustererMarkerManager.prototype.removeMany = function(gMarkers) {
        return this.clusterer.addMarkers(gMarkers);
      };

      ClustererMarkerManager.prototype.draw = function() {
        return this.clusterer.repaint();
      };

      ClustererMarkerManager.prototype.clear = function() {
        this.clusterer.clearMarkers();
        return this.clusterer.repaint();
      };

      return ClustererMarkerManager;

    })(oo.BaseObject);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.ngGmapModule("directives.api.managers", function() {
    return this.MarkerManager = (function(_super) {
      __extends(MarkerManager, _super);

      function MarkerManager(gMap, opt_markers, opt_options) {
        this.handleOptDraw = __bind(this.handleOptDraw, this);
        this.clear = __bind(this.clear, this);
        this.draw = __bind(this.draw, this);
        this.removeMany = __bind(this.removeMany, this);
        this.remove = __bind(this.remove, this);
        this.addMany = __bind(this.addMany, this);
        this.add = __bind(this.add, this);
        var self;
        MarkerManager.__super__.constructor.call(this);
        self = this;
        this.gMap = gMap;
        this.gMarkers = [];
        this.$log = directives.api.utils.Logger;
        this.$log.info(this);
      }

      MarkerManager.prototype.add = function(gMarker, optDraw) {
        this.handleOptDraw(gMarker, optDraw, true);
        return this.gMarkers.push(gMarker);
      };

      MarkerManager.prototype.addMany = function(gMarkers) {
        var gMarker, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = gMarkers.length; _i < _len; _i++) {
          gMarker = gMarkers[_i];
          _results.push(this.add(gMarker));
        }
        return _results;
      };

      MarkerManager.prototype.remove = function(gMarker, optDraw) {
        var index, tempIndex;
        this.handleOptDraw(gMarker, optDraw, false);
        if (!optDraw) {
          return;
        }
        index = void 0;
        if (this.gMarkers.indexOf != null) {
          index = this.gMarkers.indexOf(gMarker);
        } else {
          tempIndex = 0;
          _.find(this.gMarkers, function(marker) {
            tempIndex += 1;
            if (marker === gMarker) {
              index = tempIndex;
            }
          });
        }
        if (index != null) {
          return this.gMarkers.splice(index, 1);
        }
      };

      MarkerManager.prototype.removeMany = function(gMarkers) {
        var marker, _i, _len, _ref, _results;
        _ref = this.gMarkers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          _results.push(this.remove(marker));
        }
        return _results;
      };

      MarkerManager.prototype.draw = function() {
        var deletes, gMarker, _fn, _i, _j, _len, _len1, _ref, _results,
          _this = this;
        deletes = [];
        _ref = this.gMarkers;
        _fn = function(gMarker) {
          if (!gMarker.isDrawn) {
            if (gMarker.doAdd) {
              return gMarker.setMap(_this.gMap);
            } else {
              return deletes.push(gMarker);
            }
          }
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          gMarker = _ref[_i];
          _fn(gMarker);
        }
        _results = [];
        for (_j = 0, _len1 = deletes.length; _j < _len1; _j++) {
          gMarker = deletes[_j];
          _results.push(this.remove(gMarker, true));
        }
        return _results;
      };

      MarkerManager.prototype.clear = function() {
        var gMarker, _i, _len, _ref;
        _ref = this.gMarkers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          gMarker = _ref[_i];
          gMarker.setMap(null);
        }
        delete this.gMarkers;
        return this.gMarkers = [];
      };

      MarkerManager.prototype.handleOptDraw = function(gMarker, optDraw, doAdd) {
        if (optDraw === true) {
          if (doAdd) {
            gMarker.setMap(this.gMap);
          } else {
            gMarker.setMap(null);
          }
          return gMarker.isDrawn = true;
        } else {
          gMarker.isDrawn = false;
          return gMarker.doAdd = doAdd;
        }
      };

      return MarkerManager;

    })(oo.BaseObject);
  });

}).call(this);

/*
    Author: Nicholas McCready & jfriend00
    AsyncProcessor handles things asynchronous-like :), to allow the UI to be free'd to do other things
    Code taken from http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui
*/


(function() {
  this.ngGmapModule("directives.api.utils", function() {
    return this.AsyncProcessor = {
      handleLargeArray: function(array, callback, pausedCallBack, chunk, index) {
        var doChunk;
        if (chunk == null) {
          chunk = 100;
        }
        if (index == null) {
          index = 0;
        }
        if (array === void 0 || array.length <= 0) {
          return;
        }
        doChunk = function() {
          var cnt, i;
          cnt = chunk;
          i = index;
          while (cnt-- && i < array.length) {
            callback(array[i]);
            ++i;
          }
          if (i < array.length) {
            index = i;
            if (pausedCallBack != null) {
              pausedCallBack();
            }
            return setTimeout(doChunk(), 1);
          }
        };
        return doChunk();
      }
    };
  });

}).call(this);

(function() {
  this.ngGmapModule("directives.api.utils", function() {
    return this.GmapUtil = {
      createMarkerOptions: function(coords, icon, defaults, map) {
        var opts;
        if (map == null) {
          map = void 0;
        }
        opts = angular.extend({}, defaults, {
          position: new google.maps.LatLng(coords.latitude, coords.longitude),
          icon: icon,
          visible: (coords.latitude != null) && (coords.longitude != null)
        });
        if (map != null) {
          opts.map = map;
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

  this.ngGmapModule("directives.api.utils", function() {
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
  this.ngGmapModule("directives.api.utils", function() {
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

  this.ngGmapModule("directives.api.models.child", function() {
    return this.MarkerChildModel = (function(_super) {
      __extends(MarkerChildModel, _super);

      MarkerChildModel.include(directives.api.utils.GmapUtil);

      function MarkerChildModel(index, model, parentScope, gMap, $timeout, defaults, doClick, gMarkerManager) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.setOptions = __bind(this.setOptions, this);
        this.setIcon = __bind(this.setIcon, this);
        this.setCoords = __bind(this.setCoords, this);
        this.destroy = __bind(this.destroy, this);
        this.createMarker = __bind(this.createMarker, this);
        this.setMyScope = __bind(this.setMyScope, this);
        var _this = this;
        this.index = index;
        this.gMarkerManager = gMarkerManager;
        this.model = model;
        this.defaults = defaults;
        this.parentScope = parentScope;
        this.iconKey = parentScope.icon;
        this.coordsKey = parentScope.coords;
        this.clickKey = parentScope.click();
        this.optionsKey = parentScope.options;
        this.myScope = parentScope.$new(false);
        this.myScope.model = model;
        this.gMap = gMap;
        this.setMyScope(model, void 0, true);
        this.createMarker(model);
        this.doClick = doClick;
        this.$log = directives.api.utils.Logger;
        this.myScope.$watch('model', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return _this.setMyScope(newValue, oldValue);
          }
        }, true);
        this.watchDestroy(this.myScope);
      }

      MarkerChildModel.prototype.setMyScope = function(model, oldModel, isInit) {
        if (oldModel == null) {
          oldModel = void 0;
        }
        if (isInit == null) {
          isInit = false;
        }
        this.maybeSetScopeValue('icon', model, oldModel, this.iconKey, this.evalModelHandle, isInit, this.setIcon);
        this.maybeSetScopeValue('coords', model, oldModel, this.coordsKey, this.evalModelHandle, isInit, this.setCoords);
        this.maybeSetScopeValue('click', model, oldModel, this.clickKey, this.evalModelHandle, isInit);
        return this.createMarker(model, oldModel, isInit);
      };

      MarkerChildModel.prototype.createMarker = function(model, oldModel, isInit) {
        var _this = this;
        if (oldModel == null) {
          oldModel = void 0;
        }
        if (isInit == null) {
          isInit = false;
        }
        return this.maybeSetScopeValue('options', model, oldModel, this.optionsKey, function(lModel, lModelKey) {
          var value;
          if (lModel === void 0) {
            return void 0;
          }
          value = lModelKey === 'self' ? lModel : lModel[lModelKey];
          if (value === void 0) {
            return value = lModelKey === void 0 ? _this.defaults : _this.myScope.options;
          } else {
            return value;
          }
        }, isInit, this.setOptions);
      };

      MarkerChildModel.prototype.evalModelHandle = function(model, modelKey) {
        if (model === void 0) {
          return void 0;
        }
        if (modelKey === 'self') {
          return model;
        } else {
          return model[modelKey];
        }
      };

      MarkerChildModel.prototype.maybeSetScopeValue = function(scopePropName, model, oldModel, modelKey, evaluate, isInit, gSetter) {
        var newValue, oldVal;
        if (gSetter == null) {
          gSetter = void 0;
        }
        if (oldModel === void 0) {
          this.myScope[scopePropName] = evaluate(model, modelKey);
          if (!isInit) {
            if (gSetter != null) {
              gSetter(this.myScope);
            }
          }
          return;
        }
        oldVal = evaluate(oldModel, modelKey);
        newValue = evaluate(model, modelKey);
        if (newValue !== oldVal && this.myScope[scopePropName] !== newValue) {
          this.myScope[scopePropName] = newValue;
          if (!isInit) {
            if (gSetter != null) {
              gSetter(this.myScope);
            }
            return this.gMarkerManager.draw();
          }
        }
      };

      MarkerChildModel.prototype.destroy = function() {
        return this.myScope.$destroy();
      };

      MarkerChildModel.prototype.setCoords = function(scope) {
        if (scope.$id !== this.myScope.$id || this.gMarker === void 0) {
          return;
        }
        if ((scope.coords != null)) {
          this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
          this.gMarker.setVisible((scope.coords.latitude != null) && (scope.coords.longitude != null));
          this.gMarkerManager.remove(this.gMarker);
          return this.gMarkerManager.add(this.gMarker);
        } else {
          return this.gMarkerManager.remove(this.gMarker);
        }
      };

      MarkerChildModel.prototype.setIcon = function(scope) {
        if (scope.$id !== this.myScope.$id || this.gMarker === void 0) {
          return;
        }
        this.gMarkerManager.remove(this.gMarker);
        this.gMarker.setIcon(scope.icon);
        this.gMarkerManager.add(this.gMarker);
        this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
        return this.gMarker.setVisible(scope.coords.latitude && (scope.coords.longitude != null));
      };

      MarkerChildModel.prototype.setOptions = function(scope) {
        var _ref,
          _this = this;
        if (scope.$id !== this.myScope.$id) {
          return;
        }
        if (this.gMarker != null) {
          this.gMarkerManager.remove(this.gMarker);
          delete this.gMarker;
        }
        if (!((_ref = scope.coords) != null ? _ref : typeof scope.icon === "function" ? scope.icon(scope.options != null) : void 0)) {
          return;
        }
        this.opts = this.createMarkerOptions(scope.coords, scope.icon, scope.options);
        delete this.gMarker;
        this.gMarker = new google.maps.Marker(this.opts);
        this.gMarkerManager.add(this.gMarker);
        return google.maps.event.addListener(this.gMarker, 'click', function() {
          if (_this.doClick && (_this.myScope.click != null)) {
            return _this.myScope.click();
          }
        });
      };

      MarkerChildModel.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          if (_this.gMarker != null) {
            _this.gMarkerManager.remove(_this.gMarker);
            delete _this.gMarker;
          }
          return delete _this;
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

  this.ngGmapModule("directives.api.models.child", function() {
    return this.WindowChildModel = (function(_super) {
      __extends(WindowChildModel, _super);

      function WindowChildModel(scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile, needToManualDestroy) {
        if (needToManualDestroy == null) {
          needToManualDestroy = false;
        }
        this.destroy = __bind(this.destroy, this);
        this.hideWindow = __bind(this.hideWindow, this);
        this.showWindow = __bind(this.showWindow, this);
        this.handleClick = __bind(this.handleClick, this);
        this.watchCoords = __bind(this.watchCoords, this);
        this.watchShow = __bind(this.watchShow, this);
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
        this.handleClick();
        this.watchShow();
        this.watchCoords();
        this.needToManualDestroy = needToManualDestroy;
        this.$log.info(this);
      }

      WindowChildModel.prototype.watchShow = function() {
        var _this = this;
        return this.scope.$watch('show', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue) {
              return _this.showWindow();
            } else {
              return _this.hideWindow();
            }
          } else {
            if (newValue && !_this.gWin.getMap()) {
              return _this.showWindow();
            }
          }
        }, true);
      };

      WindowChildModel.prototype.watchCoords = function() {
        var _this = this;
        return this.scope.$watch('coords', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return _this.gWin.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude));
          }
        }, true);
      };

      WindowChildModel.prototype.handleClick = function() {
        var _this = this;
        if (this.markerCtrl != null) {
          google.maps.event.addListener(this.markerCtrl, 'click', function() {
            _this.gWin.setPosition(_this.markerCtrl.getPosition());
            _this.gWin.open(_this.mapCtrl);
            return _this.markerCtrl.setVisible(_this.isIconVisibleOnClick);
          });
        }
        return google.maps.event.addListener(this.gWin, 'closeclick', function() {
          if (_this.markerCtrl != null) {
            _this.markerCtrl.setVisible(_this.initialMarkerVisibility);
          }
          if (_this.scope.closeClick != null) {
            return _this.scope.closeClick();
          }
        });
      };

      WindowChildModel.prototype.showWindow = function() {
        var _this = this;
        if (this.scope.templateUrl) {
          return this.$http.get(this.scope.templateUrl, {
            cache: this.$templateCache
          }).then(function(content) {
            var compiled, templateScope;
            templateScope = _this.scope.$new();
            if (angular.isDefined(_this.scope.templateParameter)) {
              templateScope.parameter = _this.scope.templateParameter;
            }
            compiled = _this.$compile(content.data)(templateScope);
            _this.gWin.setContent(compiled.get(0));
            return _this.gWin.open(_this.mapCtrl);
          });
        } else {
          return this.gWin.open(this.mapCtrl);
        }
      };

      WindowChildModel.prototype.hideWindow = function() {
        return this.gWin.close();
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

  this.ngGmapModule("directives.api.models.parent", function() {
    return this.IMarkerParentModel = (function(_super) {
      __extends(IMarkerParentModel, _super);

      IMarkerParentModel.prototype.DEFAULTS = {};

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
        this.doClick = angular.isDefined(attrs.click);
        this.mapCtrl = mapCtrl;
        this.$log = directives.api.utils.Logger;
        this.$timeout = $timeout;
        if (scope.options != null) {
          this.DEFAULTS = scope.options;
        }
        this.$timeout(function() {
          _this.watch('coords', scope);
          _this.watch('icon', scope);
          _this.watch('options', scope);
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
          this.$log.error(this.constructor.name + ": no valid coords attribute found");
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

  this.ngGmapModule("directives.api.models.parent", function() {
    return this.IWindowParentModel = (function(_super) {
      __extends(IWindowParentModel, _super);

      IWindowParentModel.include(directives.api.utils.GmapUtil);

      IWindowParentModel.prototype.DEFAULTS = {};

      function IWindowParentModel(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) {
        var self;
        self = this;
        this.$log = directives.api.utils.Logger;
        this.$timeout = $timeout;
        this.$compile = $compile;
        this.$http = $http;
        this.$templateCache = $templateCache;
        if (scope.options != null) {
          this.DEFAULTS = scope.options;
        }
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

  this.ngGmapModule("directives.api.models.parent", function() {
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
        opts = this.createMarkerOptions(scope.coords, scope.icon, scope.options, mapCtrl.getMap());
        this.gMarker = new google.maps.Marker(opts);
        element.data('instance', this.gMarker);
        this.scope = scope;
        google.maps.event.addListener(this.gMarker, 'click', function() {
          if (_this.doClick && (scope.click != null)) {
            return $timeout(function() {
              return _this.scope.click();
            });
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
              this.gMarker.setVisible((scope.coords.latitude != null) && (scope.coords.longitude != null));
              return this.gMarker.setOptions(scope.options);
            } else {
              return this.gMarker.setMap(null);
            }
            break;
          case 'icon':
            if ((scope.icon != null) && (scope.coords != null) && (this.gMarker != null)) {
              this.gMarker.setOptions(scope.options);
              this.gMarker.setIcon(scope.icon);
              this.gMarker.setMap(null);
              this.gMarker.setMap(this.mapCtrl.getMap());
              this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
              return this.gMarker.setVisible(scope.coords.latitude && (scope.coords.longitude != null));
            }
            break;
          case 'options':
            if ((scope.coords != null) && (scope.icon != null) && scope.options) {
              this.gMarker.setMap(null);
              delete this.gMarker;
              return this.gMarker = new google.maps.Marker(this.createMarkerOptions(scope.coords, scope.icon, scope.options, this.mapCtrl.getMap()));
            }
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

  this.ngGmapModule("directives.api.models.parent", function() {
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
        this.markers = [];
        this.markersIndex = 0;
        this.gMarkerManager = void 0;
        this.scope = scope;
        this.bigGulp = directives.api.utils.AsyncProcessor;
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
          this.$log.error(this.constructor.name + ": no valid models attribute found");
        }
        return MarkersParentModel.__super__.validateScope.call(this, scope) || modelsNotDefined;
      };

      MarkersParentModel.prototype.createMarkers = function(scope) {
        var _this = this;
        if ((scope.doCluster != null) && scope.doCluster === true && this.gMarkerManager === void 0) {
          this.gMarkerManager = new directives.api.managers.ClustererMarkerManager(this.mapCtrl.getMap());
        } else {
          if (this.gMarkerManager === void 0) {
            this.gMarkerManager = new directives.api.managers.MarkerManager(this.mapCtrl.getMap());
          }
        }
        this.bigGulp.handleLargeArray(scope.models, function(model) {
          var child;
          scope.doRebuild = true;
          child = new directives.api.models.child.MarkerChildModel(_this.markersIndex, model, scope, _this.mapCtrl, _this.$timeout, _this.DEFAULTS, _this.doClick, _this.gMarkerManager);
          _this.markers.push(child);
          return _this.markersIndex++;
        });
        this.gMarkerManager.draw();
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
        if (this.gMarkerManager != null) {
          this.gMarkerManager.clear();
        }
        return this.createMarkers(scope);
      };

      MarkersParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {
        if (propNameToWatch === 'models' && newValue.length === oldValue.length) {
          return;
        }
        if (propNameToWatch === 'options' && (newValue != null)) {
          this.DEFAULTS = newValue;
          return;
        }
        return this.reBuildMarkers(scope);
      };

      MarkersParentModel.prototype.onDestroy = function(scope) {
        var model, _i, _len, _ref;
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          model.destroy();
        }
        if (this.gMarkerManager != null) {
          return this.gMarkerManager.clear();
        }
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

  this.ngGmapModule("directives.api.models.parent", function() {
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
        this.bigGulp = directives.api.utils.AsyncProcessor;
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
          if (newValue !== oldValue && newValue.length !== oldValue.length) {
            _this.bigGulp.handleLargeArray(_this.windows, function(model) {
              return model.destroy();
            });
            _this.windows = [];
            _this.windowsIndex = 0;
            return _this.createChildScopesWindows();
          }
        }, true);
      };

      WindowsParentModel.prototype.watchDestroy = function(scope) {
        var _this = this;
        return scope.$on("$destroy", function() {
          _this.bigGulp.handleLargeArray(_this.windows, function(model) {
            return model.destroy();
          });
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

        var gMap, markersScope, modelsNotDefined,
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
            this.bigGulp.handleLargeArray(this.linked.scope.models, function(model) {
              return _this.createWindow(model, void 0, gMap);
            });
          } else {
            this.models = markersScope.models;
            if (this.firstTime) {
              this.watchModels(markersScope);
              this.watchDestroy(markersScope);
            }
            this.setContentKeys(markersScope.models);
            this.bigGulp.handleLargeArray(markersScope.markerModels, function(mm) {
              return _this.createWindow(mm.model, mm.gMarker, gMap);
            });
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

  this.ngGmapModule("directives.api", function() {
    return this.IMarker = (function(_super) {
      __extends(IMarker, _super);

      function IMarker($timeout) {
        this.link = __bind(this.link, this);
        var self;
        self = this;
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
          click: '&click',
          options: '=options'
        };
      }

      IMarker.prototype.controller = {
        controller: [
          '$scope', '$element', function($scope, $element) {
            throw new Exception("Not Implemented!!");
          }
        ]
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

  this.ngGmapModule("directives.api", function() {
    return this.IWindow = (function(_super) {
      __extends(IWindow, _super);

      function IWindow($timeout, $compile, $http, $templateCache) {
        this.link = __bind(this.link, this);
        var self;
        self = this;
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
          closeClick: '&closeclick',
          options: '=options'
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

  this.ngGmapModule("directives.api", function() {
    return this.Marker = (function(_super) {
      __extends(Marker, _super);

      function Marker($timeout) {
        this.link = __bind(this.link, this);
        var self;
        Marker.__super__.constructor.call(this, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-marker" ng-transclude></span>';
        this.$log.info(this);
      }

      Marker.prototype.controller = [
        '$scope', '$element', function($scope, $element) {
          return this.getMarker = function() {
            return $element.data('instance');
          };
        }
      ];

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

  this.ngGmapModule("directives.api", function() {
    return this.Markers = (function(_super) {
      __extends(Markers, _super);

      function Markers($timeout) {
        this.link = __bind(this.link, this);
        var self;
        Markers.__super__.constructor.call(this, $timeout);
        self = this;
        this.template = '<span class="angular-google-map-markers" ng-transclude></span>';
        this.scope.models = '=models';
        this.scope.doCluster = '=docluster';
        this.$timeout = $timeout;
        this.$log.info(this);
      }

      Markers.prototype.controller = [
        '$scope', '$element', function($scope, $element) {
          return this.getMarkersScope = function() {
            return $scope;
          };
        }
      ];

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

  this.ngGmapModule("directives.api", function() {
    return this.Window = (function(_super) {
      __extends(Window, _super);

      Window.include(directives.api.utils.GmapUtil);

      function Window($timeout, $compile, $http, $templateCache) {
        this.link = __bind(this.link, this);
        var self;
        Window.__super__.constructor.call(this, $timeout, $compile, $http, $templateCache);
        self = this;
        this.require = ['^googleMap', '^?marker'];
        this.template = '<span class="angular-google-maps-window" ng-transclude></span>';
        this.$log.info(self);
      }

      Window.prototype.link = function(scope, element, attrs, ctrls) {
        var _this = this;
        return this.$timeout(function() {
          var defaults, isIconVisibleOnClick, mapCtrl, markerCtrl, opts, window;
          isIconVisibleOnClick = true;
          if (angular.isDefined(attrs.isiconvisibleonclick)) {
            isIconVisibleOnClick = scope.isIconVisibleOnClick;
          }
          mapCtrl = ctrls[0].getMap();
          markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1].getMarker() : void 0;
          defaults = scope.options != null ? scope.options : {};
          opts = _this.createWindowOptions(markerCtrl, scope, element.html(), defaults);
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

  this.ngGmapModule("directives.api", function() {
    return this.Windows = (function(_super) {
      __extends(Windows, _super);

      function Windows($timeout, $compile, $http, $templateCache, $interpolate) {
        this.link = __bind(this.link, this);
        var self;
        Windows.__super__.constructor.call(this, $timeout, $compile, $http, $templateCache);
        self = this;
        this.$interpolate = $interpolate;
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
;/*jslint browser: true, confusion: true, sloppy: true, vars: true, nomen: false, plusplus: false, indent: 2 */
/*global window,google */

/**
 * @name MarkerClustererPlus for Google Maps V3
 * @version 2.0.15 [October 18, 2012]
 * @author Gary Little
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of markers.
 * <p>
 * This is an enhanced V3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >V2 MarkerClusterer</a> by Xiaoxi Wu. It is based on the
 * <a href="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/"
 * >V3 MarkerClusterer</a> port by Luke Mahe. MarkerClustererPlus was created by Gary Little.
 * <p>
 * v2.0 release: MarkerClustererPlus v2.0 is backward compatible with MarkerClusterer v1.0. It
 *  adds support for the <code>ignoreHidden</code>, <code>title</code>, <code>printable</code>,
 *  <code>batchSizeIE</code>, and <code>calculator</code> properties as well as support for
 *  four more events. It also allows greater control over the styling of the text that appears
 *  on the cluster marker. The documentation has been significantly improved and the overall
 *  code has been simplified and polished. Very large numbers of markers can now be managed
 *  without causing Javascript timeout errors on Internet Explorer. Note that the name of the
 *  <code>clusterclick</code> event has been deprecated. The new name is <code>click</code>,
 *  so please change your application code now.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @name ClusterIconStyle
 * @class This class represents the object for values in the <code>styles</code> array passed
 *  to the {@link MarkerClusterer} constructor. The element in this array that is used to
 *  style the cluster icon is determined by calling the <code>calculator</code> function.
 *
 * @property {string} url The URL of the cluster icon image file. Required.
 * @property {number} height The height (in pixels) of the cluster icon. Required.
 * @property {number} width The width (in pixels) of the cluster icon. Required.
 * @property {Array} [anchor] The anchor position (in pixels) of the label text to be shown on
 *  the cluster icon, relative to the top left corner of the icon.
 *  The format is <code>[yoffset, xoffset]</code>. The <code>yoffset</code> must be positive
 *  and less than <code>height</code> and the <code>xoffset</code> must be positive and less
 *  than <code>width</code>. The default is to anchor the label text so that it is centered
 *  on the icon.
 * @property {Array} [anchorIcon] The anchor position (in pixels) of the cluster icon. This is the
 *  spot on the cluster icon that is to be aligned with the cluster position. The format is
 *  <code>[yoffset, xoffset]</code> where <code>yoffset</code> increases as you go down and
 *  <code>xoffset</code> increases to the right. The default anchor position is the center of the
 *  cluster icon.
 * @property {string} [textColor="black"] The color of the label text shown on the
 *  cluster icon.
 * @property {number} [textSize=11] The size (in pixels) of the label text shown on the
 *  cluster icon.
 * @property {number} [textDecoration="none"] The value of the CSS <code>text-decoration</code>
 *  property for the label text shown on the cluster icon.
 * @property {number} [fontWeight="bold"] The value of the CSS <code>font-weight</code>
 *  property for the label text shown on the cluster icon.
 * @property {number} [fontStyle="normal"] The value of the CSS <code>font-style</code>
 *  property for the label text shown on the cluster icon.
 * @property {number} [fontFamily="Arial,sans-serif"] The value of the CSS <code>font-family</code>
 *  property for the label text shown on the cluster icon.
 * @property {string} [backgroundPosition="0 0"] The position of the cluster icon image
 *  within the image defined by <code>url</code>. The format is <code>"xpos ypos"</code>
 *  (the same format as for the CSS <code>background-position</code> property). You must set
 *  this property appropriately when the image defined by <code>url</code> represents a sprite
 *  containing multiple images.
 */
/**
 * @name ClusterIconInfo
 * @class This class is an object containing general information about a cluster icon. This is
 *  the object that a <code>calculator</code> function returns.
 *
 * @property {string} text The text of the label to be shown on the cluster icon.
 * @property {number} index The index plus 1 of the element in the <code>styles</code>
 *  array to be used to style the cluster icon.
 * @property {string} title The tooltip to display when the mouse moves over the cluster icon.
 *  If this value is <code>undefined</code> or <code>""</code>, <code>title</code> is set to the
 *  value of the <code>title</code> property passed to the MarkerClusterer.
 */
/**
 * A cluster icon.
 *
 * @constructor
 * @extends google.maps.OverlayView
 * @param {Cluster} cluster The cluster with which the icon is to be associated.
 * @param {Array} [styles] An array of {@link ClusterIconStyle} defining the cluster icons
 *  to use for various cluster sizes.
 * @private
 */
function ClusterIcon(cluster, styles) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

  this.cluster_ = cluster;
  this.className_ = cluster.getMarkerClusterer().getClusterClass();
  this.styles_ = styles;
  this.center_ = null;
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;

  this.setMap(cluster.getMap()); // Note: this causes onAdd to be called
}


/**
 * Adds the icon to the DOM.
 */
ClusterIcon.prototype.onAdd = function () {
  var cClusterIcon = this;
  var cMouseDownInCluster;
  var cDraggingMapByCluster;

  this.div_ = document.createElement("div");
  this.div_.className = this.className_;
  if (this.visible_) {
    this.show();
  }

  this.getPanes().overlayMouseTarget.appendChild(this.div_);

  // Fix for Issue 157
  this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", function () {
    cDraggingMapByCluster = cMouseDownInCluster;
  });

  google.maps.event.addDomListener(this.div_, "mousedown", function () {
    cMouseDownInCluster = true;
    cDraggingMapByCluster = false;
  });

  google.maps.event.addDomListener(this.div_, "click", function (e) {
    cMouseDownInCluster = false;
    if (!cDraggingMapByCluster) {
      var theBounds;
      var mz;
      var mc = cClusterIcon.cluster_.getMarkerClusterer();
      /**
       * This event is fired when a cluster marker is clicked.
       * @name MarkerClusterer#click
       * @param {Cluster} c The cluster that was clicked.
       * @event
       */
      google.maps.event.trigger(mc, "click", cClusterIcon.cluster_);
      google.maps.event.trigger(mc, "clusterclick", cClusterIcon.cluster_); // deprecated name

      // The default click handler follows. Disable it by setting
      // the zoomOnClick property to false.
      if (mc.getZoomOnClick()) {
        // Zoom into the cluster.
        mz = mc.getMaxZoom();
        theBounds = cClusterIcon.cluster_.getBounds();
        mc.getMap().fitBounds(theBounds);
        // There is a fix for Issue 170 here:
        setTimeout(function () {
          mc.getMap().fitBounds(theBounds);
          // Don't zoom beyond the max zoom level
          if (mz !== null && (mc.getMap().getZoom() > mz)) {
            mc.getMap().setZoom(mz + 1);
          }
        }, 100);
      }

      // Prevent event propagation to the map:
      e.cancelBubble = true;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    }
  });

  google.maps.event.addDomListener(this.div_, "mouseover", function () {
    var mc = cClusterIcon.cluster_.getMarkerClusterer();
    /**
     * This event is fired when the mouse moves over a cluster marker.
     * @name MarkerClusterer#mouseover
     * @param {Cluster} c The cluster that the mouse moved over.
     * @event
     */
    google.maps.event.trigger(mc, "mouseover", cClusterIcon.cluster_);
  });

  google.maps.event.addDomListener(this.div_, "mouseout", function () {
    var mc = cClusterIcon.cluster_.getMarkerClusterer();
    /**
     * This event is fired when the mouse moves out of a cluster marker.
     * @name MarkerClusterer#mouseout
     * @param {Cluster} c The cluster that the mouse moved out of.
     * @event
     */
    google.maps.event.trigger(mc, "mouseout", cClusterIcon.cluster_);
  });
};


/**
 * Removes the icon from the DOM.
 */
ClusterIcon.prototype.onRemove = function () {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    google.maps.event.removeListener(this.boundsChangedListener_);
    google.maps.event.clearInstanceListeners(this.div_);
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};


/**
 * Draws the icon.
 */
ClusterIcon.prototype.draw = function () {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + "px";
    this.div_.style.left = pos.x + "px";
  }
};


/**
 * Hides the icon.
 */
ClusterIcon.prototype.hide = function () {
  if (this.div_) {
    this.div_.style.display = "none";
  }
  this.visible_ = false;
};


/**
 * Positions and shows the icon.
 */
ClusterIcon.prototype.show = function () {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    if (this.cluster_.printable_) {
      // (Would like to use "width: inherit;" below, but doesn't work with MSIE)
      this.div_.innerHTML = "<img src='" + this.url_ + "'><div style='position: absolute; top: 0px; left: 0px; width: " + this.width_ + "px;'>" + this.sums_.text + "</div>";
    } else {
      this.div_.innerHTML = this.sums_.text;
    }
    if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
      this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
    } else {
      this.div_.title = this.sums_.title;
    }
    this.div_.style.display = "";
  }
  this.visible_ = true;
};


/**
 * Sets the icon styles to the appropriate element in the styles array.
 *
 * @param {ClusterIconInfo} sums The icon label text and styles index.
 */
ClusterIcon.prototype.useStyle = function (sums) {
  this.sums_ = sums;
  var index = Math.max(0, sums.index - 1);
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style.url;
  this.height_ = style.height;
  this.width_ = style.width;
  this.anchor_ = style.anchor;
  this.anchorIcon_ = style.anchorIcon || [parseInt(this.height_ / 2, 10), parseInt(this.width_ / 2, 10)];
  this.textColor_ = style.textColor || "black";
  this.textSize_ = style.textSize || 11;
  this.textDecoration_ = style.textDecoration || "none";
  this.fontWeight_ = style.fontWeight || "bold";
  this.fontStyle_ = style.fontStyle || "normal";
  this.fontFamily_ = style.fontFamily || "Arial,sans-serif";
  this.backgroundPosition_ = style.backgroundPosition || "0 0";
};


/**
 * Sets the position at which to center the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function (center) {
  this.center_ = center;
};


/**
 * Creates the cssText style parameter based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position of the icon.
 * @return {string} The CSS style text.
 */
ClusterIcon.prototype.createCss = function (pos) {
  var style = [];
  if (!this.cluster_.printable_) {
    style.push('background-image:url(' + this.url_ + ');');
    style.push('background-position:' + this.backgroundPosition_ + ';');
  }

  if (typeof this.anchor_ === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
        this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) +
          'px; padding-top:' + this.anchor_[0] + 'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
          'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
        this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) +
          'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' +
        this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
      pos.x + 'px; color:' + this.textColor_ + '; position:absolute; font-size:' +
      this.textSize_ + 'px; font-family:' + this.fontFamily_ + '; font-weight:' +
      this.fontWeight_ + '; font-style:' + this.fontStyle_ + '; text-decoration:' +
      this.textDecoration_ + ';');

  return style.join("");
};


/**
 * Returns the position at which to place the DIV depending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 */
ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
  pos.x -= this.anchorIcon_[1];
  pos.y -= this.anchorIcon_[0];
  return pos;
};


/**
 * Creates a single cluster that manages a group of proximate markers.
 *  Used internally, do not call this constructor directly.
 * @constructor
 * @param {MarkerClusterer} mc The <code>MarkerClusterer</code> object with which this
 *  cluster is associated.
 */
function Cluster(mc) {
  this.markerClusterer_ = mc;
  this.map_ = mc.getMap();
  this.gridSize_ = mc.getGridSize();
  this.minClusterSize_ = mc.getMinimumClusterSize();
  this.averageCenter_ = mc.getAverageCenter();
  this.printable_ = mc.getPrintable();
  this.markers_ = [];
  this.center_ = null;
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, mc.getStyles());
}


/**
 * Returns the number of markers managed by the cluster. You can call this from
 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
 * for the <code>MarkerClusterer</code> object.
 *
 * @return {number} The number of markers in the cluster.
 */
Cluster.prototype.getSize = function () {
  return this.markers_.length;
};


/**
 * Returns the array of markers managed by the cluster. You can call this from
 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
 * for the <code>MarkerClusterer</code> object.
 *
 * @return {Array} The array of markers in the cluster.
 */
Cluster.prototype.getMarkers = function () {
  return this.markers_;
};


/**
 * Returns the center of the cluster. You can call this from
 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
 * for the <code>MarkerClusterer</code> object.
 *
 * @return {google.maps.LatLng} The center of the cluster.
 */
Cluster.prototype.getCenter = function () {
  return this.center_;
};


/**
 * Returns the map with which the cluster is associated.
 *
 * @return {google.maps.Map} The map.
 * @ignore
 */
Cluster.prototype.getMap = function () {
  return this.map_;
};


/**
 * Returns the <code>MarkerClusterer</code> object with which the cluster is associated.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 * @ignore
 */
Cluster.prototype.getMarkerClusterer = function () {
  return this.markerClusterer_;
};


/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 * @ignore
 */
Cluster.prototype.getBounds = function () {
  var i;
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }
  return bounds;
};


/**
 * Removes the cluster from the map.
 *
 * @ignore
 */
Cluster.prototype.remove = function () {
  this.clusterIcon_.setMap(null);
  this.markers_ = [];
  delete this.markers_;
};


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

  this.updateIcon_();
  return true;
};


/**
 * Determines if a marker lies within the cluster's bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 * @ignore
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
  return this.bounds_.contains(marker.getPosition());
};


/**
 * Calculates the extended bounds of the cluster with the grid.
 */
Cluster.prototype.calculateBounds_ = function () {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};


/**
 * Updates the cluster icon.
 */
Cluster.prototype.updateIcon_ = function () {
  var mCount = this.markers_.length;
  var mz = this.markerClusterer_.getMaxZoom();

  if (mz !== null && this.map_.getZoom() > mz) {
    this.clusterIcon_.hide();
    return;
  }

  if (mCount < this.minClusterSize_) {
    // Min cluster size not yet reached.
    this.clusterIcon_.hide();
    return;
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
  this.clusterIcon_.setCenter(this.center_);
  this.clusterIcon_.useStyle(sums);
  this.clusterIcon_.show();
};


/**
 * Determines if a marker has already been added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker has already been added.
 */
Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
  var i;
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) !== -1;
  } else {
    for (i = 0; i < this.markers_.length; i++) {
      if (marker === this.markers_[i]) {
        return true;
      }
    }
  }
  return false;
};


/**
 * @name MarkerClustererOptions
 * @class This class represents the optional parameter passed to
 *  the {@link MarkerClusterer} constructor.
 * @property {number} [gridSize=60] The grid size of a cluster in pixels. The grid is a square.
 * @property {number} [maxZoom=null] The maximum zoom level at which clustering is enabled or
 *  <code>null</code> if clustering is to be enabled at all zoom levels.
 * @property {boolean} [zoomOnClick=true] Whether to zoom the map when a cluster marker is
 *  clicked. You may want to set this to <code>false</code> if you have installed a handler
 *  for the <code>click</code> event and it deals with zooming on its own.
 * @property {boolean} [averageCenter=false] Whether the position of a cluster marker should be
 *  the average position of all markers in the cluster. If set to <code>false</code>, the
 *  cluster marker is positioned at the location of the first marker added to the cluster.
 * @property {number} [minimumClusterSize=2] The minimum number of markers needed in a cluster
 *  before the markers are hidden and a cluster marker appears.
 * @property {boolean} [ignoreHidden=false] Whether to ignore hidden markers in clusters. You
 *  may want to set this to <code>true</code> to ensure that hidden markers are not included
 *  in the marker count that appears on a cluster marker (this count is the value of the
 *  <code>text</code> property of the result returned by the default <code>calculator</code>).
 *  If set to <code>true</code> and you change the visibility of a marker being clustered, be
 *  sure to also call <code>MarkerClusterer.repaint()</code>.
 * @property {boolean} [printable=false] Whether to make the cluster icons printable. Do not
 *  set to <code>true</code> if the <code>url</code> fields in the <code>styles</code> array
 *  refer to image sprite files.
 * @property {string} [title=""] The tooltip to display when the mouse moves over a cluster
 *  marker. (Alternatively, you can use a custom <code>calculator</code> function to specify a
 *  different tooltip for each cluster marker.)
 * @property {function} [calculator=MarkerClusterer.CALCULATOR] The function used to determine
 *  the text to be displayed on a cluster marker and the index indicating which style to use
 *  for the cluster marker. The input parameters for the function are (1) the array of markers
 *  represented by a cluster marker and (2) the number of cluster icon styles. It returns a
 *  {@link ClusterIconInfo} object. The default <code>calculator</code> returns a
 *  <code>text</code> property which is the number of markers in the cluster and an
 *  <code>index</code> property which is one higher than the lowest integer such that
 *  <code>10^i</code> exceeds the number of markers in the cluster, or the size of the styles
 *  array, whichever is less. The <code>styles</code> array element used has an index of
 *  <code>index</code> minus 1. For example, the default <code>calculator</code> returns a
 *  <code>text</code> value of <code>"125"</code> and an <code>index</code> of <code>3</code>
 *  for a cluster icon representing 125 markers so the element used in the <code>styles</code>
 *  array is <code>2</code>. A <code>calculator</code> may also return a <code>title</code>
 *  property that contains the text of the tooltip to be used for the cluster marker. If
 *   <code>title</code> is not defined, the tooltip is set to the value of the <code>title</code>
 *   property for the MarkerClusterer.
 * @property {string} [clusterClass="cluster"] The name of the CSS class defining general styles
 *  for the cluster markers. Use this class to define CSS styles that are not set up by the code
 *  that processes the <code>styles</code> array.
 * @property {Array} [styles] An array of {@link ClusterIconStyle} elements defining the styles
 *  of the cluster markers to be used. The element to be used to style a given cluster marker
 *  is determined by the function defined by the <code>calculator</code> property.
 *  The default is an array of {@link ClusterIconStyle} elements whose properties are derived
 *  from the values for <code>imagePath</code>, <code>imageExtension</code>, and
 *  <code>imageSizes</code>.
 * @property {number} [batchSize=MarkerClusterer.BATCH_SIZE] Set this property to the
 *  number of markers to be processed in a single batch when using a browser other than
 *  Internet Explorer (for Internet Explorer, use the batchSizeIE property instead).
 * @property {number} [batchSizeIE=MarkerClusterer.BATCH_SIZE_IE] When Internet Explorer is
 *  being used, markers are processed in several batches with a small delay inserted between
 *  each batch in an attempt to avoid Javascript timeout errors. Set this property to the
 *  number of markers to be processed in a single batch; select as high a number as you can
 *  without causing a timeout error in the browser. This number might need to be as low as 100
 *  if 15,000 markers are being managed, for example.
 * @property {string} [imagePath=MarkerClusterer.IMAGE_PATH]
 *  The full URL of the root name of the group of image files to use for cluster icons.
 *  The complete file name is of the form <code>imagePath</code>n.<code>imageExtension</code>
 *  where n is the image file number (1, 2, etc.).
 * @property {string} [imageExtension=MarkerClusterer.IMAGE_EXTENSION]
 *  The extension name for the cluster icon image files (e.g., <code>"png"</code> or
 *  <code>"jpg"</code>).
 * @property {Array} [imageSizes=MarkerClusterer.IMAGE_SIZES]
 *  An array of numbers containing the widths of the group of
 *  <code>imagePath</code>n.<code>imageExtension</code> image files.
 *  (The images are assumed to be square.)
 */
/**
 * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
 * @constructor
 * @extends google.maps.OverlayView
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>} [opt_markers] The markers to be added to the cluster.
 * @param {MarkerClustererOptions} [opt_options] The optional parameters.
 */
function MarkerClusterer(map, opt_markers, opt_options) {
  // MarkerClusterer implements google.maps.OverlayView interface. We use the
  // extend function to extend MarkerClusterer with google.maps.OverlayView
  // because it might not always be available when the code is defined so we
  // look for it at the last possible moment. If it doesn't exist now then
  // there is no point going ahead :)
  this.extend(MarkerClusterer, google.maps.OverlayView);

  opt_markers = opt_markers || [];
  opt_options = opt_options || {};

  this.markers_ = [];
  this.clusters_ = [];
  this.listeners_ = [];
  this.activeMap_ = null;
  this.ready_ = false;

  this.gridSize_ = opt_options.gridSize || 60;
  this.minClusterSize_ = opt_options.minimumClusterSize || 2;
  this.maxZoom_ = opt_options.maxZoom || null;
  this.styles_ = opt_options.styles || [];
  this.title_ = opt_options.title || "";
  this.zoomOnClick_ = true;
  if (opt_options.zoomOnClick !== undefined) {
    this.zoomOnClick_ = opt_options.zoomOnClick;
  }
  this.averageCenter_ = false;
  if (opt_options.averageCenter !== undefined) {
    this.averageCenter_ = opt_options.averageCenter;
  }
  this.ignoreHidden_ = false;
  if (opt_options.ignoreHidden !== undefined) {
    this.ignoreHidden_ = opt_options.ignoreHidden;
  }
  this.printable_ = false;
  if (opt_options.printable !== undefined) {
    this.printable_ = opt_options.printable;
  }
  this.imagePath_ = opt_options.imagePath || MarkerClusterer.IMAGE_PATH;
  this.imageExtension_ = opt_options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;
  this.imageSizes_ = opt_options.imageSizes || MarkerClusterer.IMAGE_SIZES;
  this.calculator_ = opt_options.calculator || MarkerClusterer.CALCULATOR;
  this.batchSize_ = opt_options.batchSize || MarkerClusterer.BATCH_SIZE;
  this.batchSizeIE_ = opt_options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;
  this.clusterClass_ = opt_options.clusterClass || "cluster";

  if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {
    // Try to avoid IE timeout when processing a huge number of markers:
    this.batchSize_ = this.batchSizeIE_;
  }

  this.setupStyles_();

  this.addMarkers(opt_markers, true);
  this.setMap(map); // Note: this causes onAdd to be called
}


/**
 * Implementation of the onAdd interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function () {
  var cMarkerClusterer = this;

  this.activeMap_ = this.getMap();
  this.ready_ = true;

  this.repaint();

  // Add the map event listeners
  this.listeners_ = [
    google.maps.event.addListener(this.getMap(), "zoom_changed", function () {
      cMarkerClusterer.resetViewport_(false);
      // Workaround for this Google bug: when map is at level 0 and "-" of
      // zoom slider is clicked, a "zoom_changed" event is fired even though
      // the map doesn't zoom out any further. In this situation, no "idle"
      // event is triggered so the cluster markers that have been removed
      // do not get redrawn. Same goes for a zoom in at maxZoom.
      if (this.getZoom() === (this.get("minZoom") || 0) || this.getZoom() === this.get("maxZoom")) {
        google.maps.event.trigger(this, "idle");
      }
    }),
    google.maps.event.addListener(this.getMap(), "idle", function () {
      cMarkerClusterer.redraw_();
    })
  ];
};


/**
 * Implementation of the onRemove interface method.
 * Removes map event listeners and all cluster icons from the DOM.
 * All managed markers are also put back on the map.
 * @ignore
 */
MarkerClusterer.prototype.onRemove = function () {
  var i;

  // Put all the managed markers back on the map:
  for (i = 0; i < this.markers_.length; i++) {
    if (this.markers_[i].getMap() !== this.activeMap_) {
      this.markers_[i].setMap(this.activeMap_);
    }
  }

  // Remove all clusters:
  for (i = 0; i < this.clusters_.length; i++) {
    this.clusters_[i].remove();
  }
  this.clusters_ = [];

  // Remove map event listeners:
  for (i = 0; i < this.listeners_.length; i++) {
    google.maps.event.removeListener(this.listeners_[i]);
  }
  this.listeners_ = [];

  this.activeMap_ = null;
  this.ready_ = false;
};


/**
 * Implementation of the draw interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function () {};


/**
 * Sets up the styles object.
 */
MarkerClusterer.prototype.setupStyles_ = function () {
  var i, size;
  if (this.styles_.length > 0) {
    return;
  }

  for (i = 0; i < this.imageSizes_.length; i++) {
    size = this.imageSizes_[i];
    this.styles_.push({
      url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
      height: size,
      width: size
    });
  }
};


/**
 *  Fits the map to the bounds of the markers managed by the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function () {
  var i;
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds();
  for (i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }

  this.getMap().fitBounds(bounds);
};


/**
 * Returns the value of the <code>gridSize</code> property.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function () {
  return this.gridSize_;
};


/**
 * Sets the value of the <code>gridSize</code> property.
 *
 * @param {number} gridSize The grid size.
 */
MarkerClusterer.prototype.setGridSize = function (gridSize) {
  this.gridSize_ = gridSize;
};


/**
 * Returns the value of the <code>minimumClusterSize</code> property.
 *
 * @return {number} The minimum cluster size.
 */
MarkerClusterer.prototype.getMinimumClusterSize = function () {
  return this.minClusterSize_;
};

/**
 * Sets the value of the <code>minimumClusterSize</code> property.
 *
 * @param {number} minimumClusterSize The minimum cluster size.
 */
MarkerClusterer.prototype.setMinimumClusterSize = function (minimumClusterSize) {
  this.minClusterSize_ = minimumClusterSize;
};


/**
 *  Returns the value of the <code>maxZoom</code> property.
 *
 *  @return {number} The maximum zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function () {
  return this.maxZoom_;
};


/**
 *  Sets the value of the <code>maxZoom</code> property.
 *
 *  @param {number} maxZoom The maximum zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
  this.maxZoom_ = maxZoom;
};


/**
 *  Returns the value of the <code>styles</code> property.
 *
 *  @return {Array} The array of styles defining the cluster markers to be used.
 */
MarkerClusterer.prototype.getStyles = function () {
  return this.styles_;
};


/**
 *  Sets the value of the <code>styles</code> property.
 *
 *  @param {Array.<ClusterIconStyle>} styles The array of styles to use.
 */
MarkerClusterer.prototype.setStyles = function (styles) {
  this.styles_ = styles;
};


/**
 * Returns the value of the <code>title</code> property.
 *
 * @return {string} The content of the title text.
 */
MarkerClusterer.prototype.getTitle = function () {
  return this.title_;
};


/**
 *  Sets the value of the <code>title</code> property.
 *
 *  @param {string} title The value of the title property.
 */
MarkerClusterer.prototype.setTitle = function (title) {
  this.title_ = title;
};


/**
 * Returns the value of the <code>zoomOnClick</code> property.
 *
 * @return {boolean} True if zoomOnClick property is set.
 */
MarkerClusterer.prototype.getZoomOnClick = function () {
  return this.zoomOnClick_;
};


/**
 *  Sets the value of the <code>zoomOnClick</code> property.
 *
 *  @param {boolean} zoomOnClick The value of the zoomOnClick property.
 */
MarkerClusterer.prototype.setZoomOnClick = function (zoomOnClick) {
  this.zoomOnClick_ = zoomOnClick;
};


/**
 * Returns the value of the <code>averageCenter</code> property.
 *
 * @return {boolean} True if averageCenter property is set.
 */
MarkerClusterer.prototype.getAverageCenter = function () {
  return this.averageCenter_;
};


/**
 *  Sets the value of the <code>averageCenter</code> property.
 *
 *  @param {boolean} averageCenter The value of the averageCenter property.
 */
MarkerClusterer.prototype.setAverageCenter = function (averageCenter) {
  this.averageCenter_ = averageCenter;
};


/**
 * Returns the value of the <code>ignoreHidden</code> property.
 *
 * @return {boolean} True if ignoreHidden property is set.
 */
MarkerClusterer.prototype.getIgnoreHidden = function () {
  return this.ignoreHidden_;
};


/**
 *  Sets the value of the <code>ignoreHidden</code> property.
 *
 *  @param {boolean} ignoreHidden The value of the ignoreHidden property.
 */
MarkerClusterer.prototype.setIgnoreHidden = function (ignoreHidden) {
  this.ignoreHidden_ = ignoreHidden;
};


/**
 * Returns the value of the <code>imageExtension</code> property.
 *
 * @return {string} The value of the imageExtension property.
 */
MarkerClusterer.prototype.getImageExtension = function () {
  return this.imageExtension_;
};


/**
 *  Sets the value of the <code>imageExtension</code> property.
 *
 *  @param {string} imageExtension The value of the imageExtension property.
 */
MarkerClusterer.prototype.setImageExtension = function (imageExtension) {
  this.imageExtension_ = imageExtension;
};


/**
 * Returns the value of the <code>imagePath</code> property.
 *
 * @return {string} The value of the imagePath property.
 */
MarkerClusterer.prototype.getImagePath = function () {
  return this.imagePath_;
};


/**
 *  Sets the value of the <code>imagePath</code> property.
 *
 *  @param {string} imagePath The value of the imagePath property.
 */
MarkerClusterer.prototype.setImagePath = function (imagePath) {
  this.imagePath_ = imagePath;
};


/**
 * Returns the value of the <code>imageSizes</code> property.
 *
 * @return {Array} The value of the imageSizes property.
 */
MarkerClusterer.prototype.getImageSizes = function () {
  return this.imageSizes_;
};


/**
 *  Sets the value of the <code>imageSizes</code> property.
 *
 *  @param {Array} imageSizes The value of the imageSizes property.
 */
MarkerClusterer.prototype.setImageSizes = function (imageSizes) {
  this.imageSizes_ = imageSizes;
};


/**
 * Returns the value of the <code>calculator</code> property.
 *
 * @return {function} the value of the calculator property.
 */
MarkerClusterer.prototype.getCalculator = function () {
  return this.calculator_;
};


/**
 * Sets the value of the <code>calculator</code> property.
 *
 * @param {function(Array.<google.maps.Marker>, number)} calculator The value
 *  of the calculator property.
 */
MarkerClusterer.prototype.setCalculator = function (calculator) {
  this.calculator_ = calculator;
};


/**
 * Returns the value of the <code>printable</code> property.
 *
 * @return {boolean} the value of the printable property.
 */
MarkerClusterer.prototype.getPrintable = function () {
  return this.printable_;
};


/**
 * Sets the value of the <code>printable</code> property.
 *
 *  @param {boolean} printable The value of the printable property.
 */
MarkerClusterer.prototype.setPrintable = function (printable) {
  this.printable_ = printable;
};


/**
 * Returns the value of the <code>batchSizeIE</code> property.
 *
 * @return {number} the value of the batchSizeIE property.
 */
MarkerClusterer.prototype.getBatchSizeIE = function () {
  return this.batchSizeIE_;
};


/**
 * Sets the value of the <code>batchSizeIE</code> property.
 *
 *  @param {number} batchSizeIE The value of the batchSizeIE property.
 */
MarkerClusterer.prototype.setBatchSizeIE = function (batchSizeIE) {
  this.batchSizeIE_ = batchSizeIE;
};


/**
 * Returns the value of the <code>clusterClass</code> property.
 *
 * @return {string} the value of the clusterClass property.
 */
MarkerClusterer.prototype.getClusterClass = function () {
  return this.clusterClass_;
};


/**
 * Sets the value of the <code>clusterClass</code> property.
 *
 *  @param {string} clusterClass The value of the clusterClass property.
 */
MarkerClusterer.prototype.setClusterClass = function (clusterClass) {
  this.clusterClass_ = clusterClass;
};


/**
 *  Returns the array of markers managed by the clusterer.
 *
 *  @return {Array} The array of markers managed by the clusterer.
 */
MarkerClusterer.prototype.getMarkers = function () {
  return this.markers_;
};


/**
 *  Returns the number of markers managed by the clusterer.
 *
 *  @return {number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function () {
  return this.markers_.length;
};


/**
 * Returns the current array of clusters formed by the clusterer.
 *
 * @return {Array} The array of clusters formed by the clusterer.
 */
MarkerClusterer.prototype.getClusters = function () {
  return this.clusters_;
};


/**
 * Returns the number of clusters formed by the clusterer.
 *
 * @return {number} The number of clusters formed by the clusterer.
 */
MarkerClusterer.prototype.getTotalClusters = function () {
  return this.clusters_.length;
};


/**
 * Adds a marker to the clusterer. The clusters are redrawn unless
 *  <code>opt_nodraw</code> is set to <code>true</code>.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
 */
MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
  this.pushMarkerTo_(marker);
  if (!opt_nodraw) {
    this.redraw_();
  }
};


/**
 * Adds an array of markers to the clusterer. The clusters are redrawn unless
 *  <code>opt_nodraw</code> is set to <code>true</code>.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
 */
MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
  var i;
  for (i = 0; i < markers.length; i++) {
    this.pushMarkerTo_(markers[i]);
  }
  if (!opt_nodraw) {
    this.redraw_();
  }
};


/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 */
MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
  // If the marker is draggable add a listener so we can update the clusters on the dragend:
  if (marker.getDraggable()) {
    var cMarkerClusterer = this;
    google.maps.event.addListener(marker, "dragend", function () {
      if (cMarkerClusterer.ready_) {
        this.isAdded = false;
        cMarkerClusterer.repaint();
      }
    });
  }
  marker.isAdded = false;
  this.markers_.push(marker);
};


/**
 * Removes a marker from the cluster.  The clusters are redrawn unless
 *  <code>opt_nodraw</code> is set to <code>true</code>. Returns <code>true</code> if the
 *  marker was removed from the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
 * @return {boolean} True if the marker was removed from the clusterer.
 */
MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {
  var removed = this.removeMarker_(marker);

  if (!opt_nodraw && removed) {
    this.repaint();
  }

  return removed;
};


/**
 * Removes an array of markers from the cluster. The clusters are redrawn unless
 *  <code>opt_nodraw</code> is set to <code>true</code>. Returns <code>true</code> if markers
 *  were removed from the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean} [opt_nodraw] Set to <code>true</code> to prevent redrawing.
 * @return {boolean} True if markers were removed from the clusterer.
 */
MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {
  var i, r;
  var removed = false;

  for (i = 0; i < markers.length; i++) {
    r = this.removeMarker_(markers[i]);
    removed = removed || r;
  }

  if (!opt_nodraw && removed) {
    this.repaint();
  }

  return removed;
};


/**
 * Removes a marker and returns true if removed, false if not.
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 */
MarkerClusterer.prototype.removeMarker_ = function (marker) {
  var i;
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    for (i = 0; i < this.markers_.length; i++) {
      if (marker === this.markers_[i]) {
        index = i;
        break;
      }
    }
  }

  if (index === -1) {
    // Marker is not in our list of markers, so do nothing:
    return false;
  }

  marker.setMap(null);
  this.markers_.splice(index, 1); // Remove the marker from the list of managed markers
  return true;
};


/**
 * Removes all clusters and markers from the map and also removes all markers
 *  managed by the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function () {
  this.resetViewport_(true);
  this.markers_ = [];
};


/**
 * Recalculates and redraws all the marker clusters from scratch.
 *  Call this after changing any properties.
 */
MarkerClusterer.prototype.repaint = function () {
  var oldClusters = this.clusters_.slice();
  this.clusters_ = [];
  this.resetViewport_(false);
  this.redraw_();

  // Remove the old clusters.
  // Do it in a timeout to prevent blinking effect.
  setTimeout(function () {
    var i;
    for (i = 0; i < oldClusters.length; i++) {
      oldClusters[i].remove();
    }
  }, 0);
};


/**
 * Returns the current bounds extended by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 * @ignore
 */
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
  var projection = this.getProjection();

  // Turn the bounds into latlng.
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng());

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = projection.fromDivPixelToLatLng(trPix);
  var sw = projection.fromDivPixelToLatLng(blPix);

  // Extend the bounds to contain the new bounds.
  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};


/**
 * Redraws all the clusters.
 */
MarkerClusterer.prototype.redraw_ = function () {
  this.createClusters_(0);
};


/**
 * Removes all clusters from the map. The markers are also removed from the map
 *  if <code>opt_hide</code> is set to <code>true</code>.
 *
 * @param {boolean} [opt_hide] Set to <code>true</code> to also remove the markers
 *  from the map.
 */
MarkerClusterer.prototype.resetViewport_ = function (opt_hide) {
  var i, marker;
  // Remove all the clusters
  for (i = 0; i < this.clusters_.length; i++) {
    this.clusters_[i].remove();
  }
  this.clusters_ = [];

  // Reset the markers to not be added and to be removed from the map.
  for (i = 0; i < this.markers_.length; i++) {
    marker = this.markers_[i];
    marker.isAdded = false;
    if (opt_hide) {
      marker.setMap(null);
    }
  }
};


/**
 * Calculates the distance between two latlng locations in km.
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
*/
MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};


/**
 * Determines if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
  return bounds.contains(marker.getPosition());
};


/**
 * Adds a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 */
MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
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
    cluster = new Cluster(this);
    cluster.addMarker(marker);
    this.clusters_.push(cluster);
  }
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


/**
 * Extends an object's prototype by another's.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function (obj1, obj2) {
  return (function (object) {
    var property;
    for (property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};


/**
 * The default function for determining the label text and style
 * for a cluster icon.
 *
 * @param {Array.<google.maps.Marker>} markers The array of markers represented by the cluster.
 * @param {number} numStyles The number of marker styles available.
 * @return {ClusterIconInfo} The information resource for the cluster.
 * @constant
 * @ignore
 */
MarkerClusterer.CALCULATOR = function (markers, numStyles) {
  var index = 0;
  var title = "";
  var count = markers.length.toString();

  var dv = count;
  while (dv !== 0) {
    dv = parseInt(dv / 10, 10);
    index++;
  }

  index = Math.min(index, numStyles);
  return {
    text: count,
    index: index,
    title: title
  };
};


/**
 * The number of markers to process in one batch.
 *
 * @type {number}
 * @constant
 */
MarkerClusterer.BATCH_SIZE = 2000;


/**
 * The number of markers to process in one batch (IE only).
 *
 * @type {number}
 * @constant
 */
MarkerClusterer.BATCH_SIZE_IE = 500;


/**
 * The default root name for the marker cluster images.
 *
 * @type {string}
 * @constant
 */
MarkerClusterer.IMAGE_PATH = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/images/m";


/**
 * The default extension name for the marker cluster images.
 *
 * @type {string}
 * @constant
 */
MarkerClusterer.IMAGE_EXTENSION = "png";


/**
 * The default array of sizes for the marker cluster images.
 *
 * @type {Array.<number>}
 * @constant
 */
MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90];;angular.module("google-maps")
    .factory('array-sync',['add-events',function(mapEvents){

        return function LatLngArraySync(mapArray,scope,pathEval){
            var scopeArray = scope.$eval(pathEval);

            var mapArrayListener = mapEvents(mapArray,{
               'set_at':function(index){
                   var value = mapArray.getAt(index);
                   scopeArray[index].latitude = value.lat();
                   scopeArray[index].longitude = value.lng();
               },
               'insert_at':function(index){
                   var value = mapArray.getAt(index);
                   scopeArray.splice(index,0,{latitude:value.lat(),longitude:value.lng()});
               },
               'remove_at':function(index){
                   scopeArray.splice(index,1);
               }
            });

            var watchListener =  scope.$watch(pathEval, function (newArray) {
                var oldArray = mapArray;
                if (newArray) {
                    var i = 0;
                    var oldLength = oldArray.getLength();
                    var newLength = newArray.length;
                    var l = Math.min(oldLength,newLength);
                    var newValue;
                    for(;i < l; i++){
                        var oldValue = oldArray.getAt(i);
                        newValue = newArray[i];
                        if((oldValue.lat() != newValue.latitude) || (oldValue.lng() != newValue.longitude)){
                            oldArray.setAt(i,new google.maps.LatLng(newValue.latitude, newValue.longitude));
                        }
                    }
                    for(; i < newLength; i++){
                        newValue = newArray[i];
                        oldArray.push(new google.maps.LatLng(newValue.latitude, newValue.longitude));
                    }
                    for(; i < oldLength; i++){
                        oldArray.pop();
                    }
                }

            }, true);

            return function(){
                if(mapArrayListener){
                    mapArrayListener();
                    mapArrayListener = null;
                }
                if(watchListener){
                    watchListener();
                    watchListener = null;
                }
            };
        };
    }]);;angular.module('google-maps').factory('add-events', ['$timeout',function($timeout){

    function addEvent(target,eventName,handler){
        return google.maps.event.addListener(target,eventName,function(){
            handler.apply(this,arguments);
            $timeout(function(){},true);
        });
    }

    function addEvents(target,eventName,handler){
        if(handler){
            return addEvent(target,eventName,handler);
        }
        var remove = [];
        angular.forEach(eventName,function(_handler,key){
            console.log('adding listener: ' + key + ": " + _handler.toString() + " to : " + target);
            remove.push(addEvent(target,key,_handler));
        });

        return function(){
            angular.forEach(remove,function(fn){fn();});
            remove = null;
        };
    }

    return addEvents;

}]);;angular.module('google-maps').controller('PolylineDisplayController',['$scope',function($scope){
    $scope.toggleStrokeColor = function(){
        $scope.stroke.color = ($scope.stroke.color == "#6060FB") ? "red" : "#6060FB";
    };
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
                options: '=options',        // optional
                events: '=events',          // optional
                bounds: '=bounds'
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
                    opts.options = scope.options;
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
                    zoom: scope.zoom,
                    bounds: scope.bounds
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

                google.maps.event.addListener(_m, 'idle', function () {
                    var b = _m.getBounds();
                    var ne = b.getNorthEast();
                    var sw = b.getSouthWest();

                    $timeout(function () {

                      scope.$apply(function (s) {
                        if(s.bounds !== null && s.bounds !== undefined && s.bounds !== void 0){
                            s.bounds.northeast = {latitude: ne.lat(), longitude: ne.lng()} ;
                            s.bounds.southwest = {latitude: sw.lat(), longitude: sw.lng()} ;
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

				scope.$watch('bounds', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var ne = new google.maps.LatLng(newValue.northeast.latitude, newValue.northeast.longitude);
                    var sw = new google.maps.LatLng(newValue.southwest.latitude, newValue.southwest.longitude);
                    var bounds = new google.maps.LatLngBounds(sw, ne);

                    _m.fitBounds(bounds);
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
    .directive("polygon", ['$log', '$timeout', function ($log, $timeout) {

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
            var result = new google.maps.MVCArray();

            for (var i = 0; i < path.length; i++) {
                result.push(new google.maps.LatLng(path[i].latitude, path[i].longitude));
            }

            return result;
        }

        function extendMapBounds(map, points) {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < points.length; i++) {
                bounds.extend(points.getAt(i));
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
                stroke: '=stroke',
                clickable: '=',
                draggable: '=',
                editable: '=',
                geodesic: '=',
                icons:'=icons',
                visible:'='
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


                    angular.forEach({
                        clickable:true,
                        draggable:false,
                        editable:false,
                        geodesic:false,
                        visible:true
                    },function (defaultValue, key){
                        if(angular.isUndefined(scope[key]) || scope[key] === null){
                            opts[key] = defaultValue;
                        }
                        else {
                            opts[key] = scope[key];
                        }
                    });

                    var polyline = new google.maps.Polyline(opts);

                    if (isTrue(attrs.fit)) {
                        extendMapBounds(map, pathPoints);
                    }

                    if(angular.isDefined(scope.editable)) {
                        scope.$watch('editable',function(newValue,oldValue){
                            polyline.setEditable(newValue);
                        });
                    }
                    if(angular.isDefined(scope.draggable)){
                        scope.$watch('draggable',function(newValue,oldValue){
                            polyline.setDraggable(newValue);
                        });
                    }
                    if(angular.isDefined(scope.visible)){
                        scope.$watch('visible',function(newValue,oldValue){
                            polyline.setVisible(newValue);
                        });
                    }

                    var pathSetAtListener, pathInsertAtListener, pathRemoveAtListener;

                    var polyPath = polyline.getPath();

                    pathSetAtListener = google.maps.event.addListener(polyPath, 'set_at',function(index){
                        var value = polyPath.getAt(index);
                        scope.path[index].latitude = value.lat();
                        scope.path[index].longitude = value.lng();
                        scope.$apply();
                    });
                    pathInsertAtListener = google.maps.event.addListener(polyPath, 'insert_at',function(index){
                        var value = polyPath.getAt(index);
                        scope.path.splice(index,0,{latitude:value.lat(),longitude:value.lng()});
                        scope.$apply();
                    });
                    pathRemoveAtListener = google.maps.event.addListener(polyPath, 'remove_at',function(index){
                        scope.path.splice(index,1);
                        scope.$apply();
                    });



                    scope.$watch('path', function (newArray) {
                            var oldArray = polyline.getPath();
                            if (newArray !== oldArray) {
                                if (newArray) {

                                    polyline.setMap(map);


                                    var i = 0;
                                    var oldLength = oldArray.getLength();
                                    var newLength = newArray.length;
                                    var l = Math.min(oldLength,newLength);
                                    for(;i < l; i++){
                                        oldValue = oldArray.getAt(i);
                                        newValue = newArray[i];
                                        if((oldValue.lat() != newValue.latitude) || (oldValue.lng() != newValue.longitude)){
                                            oldArray.setAt(i,new google.maps.LatLng(newValue.latitude, newValue.longitude));
                                        }
                                    }
                                    for(; i < newLength; i++){
                                        newValue = newArray[i];
                                        oldArray.push(new google.maps.LatLng(newValue.latitude, newValue.longitude));
                                    }
                                    for(; i < oldLength; i++){
                                        oldArray.pop();
                                    }

                                    if (isTrue(attrs.fit)) {
                                        extendMapBounds(map, oldArray);
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
                        pathSetAtListener();
                        pathSetAtListener = null;
                        pathInsertAtListener();
                        pathInsertAtListener = null;
                        pathRemoveAtListener();
                        pathRemoveAtListener = null;

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

angular.module("google-maps")
    .directive("polyline", ['$log', '$timeout','array-sync', function ($log, $timeout,arraySync) {

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
            var result = new google.maps.MVCArray();

            for (var i = 0; i < path.length; i++) {
                result.push(new google.maps.LatLng(path[i].latitude, path[i].longitude));
            }

            return result;
        }

        function extendMapBounds(map, points) {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < points.length; i++) {
                bounds.extend(points.getAt(i));
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
                stroke: '=stroke',
                clickable: '=',
                draggable: '=',
                editable: '=',
                geodesic: '=',
                icons:'=icons',
                visible:'='
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




                    function buildOpts (pathPoints){


                        var opts = angular.extend({}, DEFAULTS, {
                            map: map,
                            path: pathPoints,
                            strokeColor: scope.stroke && scope.stroke.color,
                            strokeOpacity: scope.stroke && scope.stroke.opacity,
                            strokeWeight: scope.stroke && scope.stroke.weight
                        });


                        angular.forEach({
                            clickable:true,
                            draggable:false,
                            editable:false,
                            geodesic:false,
                            visible:true
                        },function (defaultValue, key){
                            if(angular.isUndefined(scope[key]) || scope[key] === null){
                                opts[key] = defaultValue;
                            }
                            else {
                                opts[key] = scope[key];
                            }
                        });

                        return opts;
                    }

                    var polyline = new google.maps.Polyline(buildOpts(convertPathPoints(scope.path)));

                    if (isTrue(attrs.fit)) {
                        extendMapBounds(map, pathPoints);
                    }

                    if(angular.isDefined(scope.editable)) {
                        scope.$watch('editable',function(newValue,oldValue){
                            polyline.setEditable(newValue);
                        });
                    }
                    if(angular.isDefined(scope.draggable)){
                        scope.$watch('draggable',function(newValue,oldValue){
                            polyline.setDraggable(newValue);
                        });
                    }
                    if(angular.isDefined(scope.visible)){
                        scope.$watch('visible',function(newValue,oldValue){
                            polyline.setVisible(newValue);
                        });
                    }
                    if(angular.isDefined(scope.geodesic)){
                        scope.$watch('geodesic',function(newValue,oldValue){
                            polyline.setOptions(buildOpts(polyline.getPath()));
                        });
                    }

                    if(angular.isDefined(scope.stroke) && angular.isDefined(scope.stroke.weight)){
                        scope.$watch('stroke.weight',function(newValue,oldValue){
                            polyline.setOptions(buildOpts(polyline.getPath()));
                        });
                    }


                    if(angular.isDefined(scope.stroke) && angular.isDefined(scope.stroke.color)){
                        scope.$watch('stroke.color',function(newValue,oldValue){
                            polyline.setOptions(buildOpts(polyline.getPath()));
                        });
                    }




                    var arraySyncer = arraySync(polyline.getPath(),scope,'path');





                    // Remove polyline on scope $destroy
                    scope.$on("$destroy", function () {
                        polyline.setMap(null);

                        if(arraySyncer) {
                            arraySyncer();
                            arraySyncer= null;
                        }

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
 *   - Nicolas Laplante https://plus.google.com/108189012221374960701
 *   - Nicholas McCready
 */

/**
 * Map TrafficLayer directive
 *
 * This directive is used to create a TrafficLayer on an existing map.
 * This directive creates a new scope.
 *
 * {attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
 */

angular.module('google-maps')
    .directive('trafficlayer', ['$log', '$timeout', function ($log, $timeout) {
        "use strict";
        return {
            restrict: 'ECMA',
            require: '^googleMap',
            priority: -1,
            transclude: true,
            template: '<span class="angular-google-map-trafficlayer" ng-transclude></span>',
            replace: true,
            scope: {
                show: '=show' //not required and will default to true
            },
            link: function (scope, element, attrs, mapCtrl) {
                var trafficLayer = new google.maps.TrafficLayer();
                var gMap;
                var doShow = true;
                // Wrap marker initialization inside a $timeout() call to make sure the map is created already
                $timeout(function () {
                    gMap = mapCtrl.getMap();
                    if (angular.isDefined(attrs.show))
                        doShow = scope.show;
                    if(doShow !== null && doShow && gMap !== null)                        
                        trafficLayer.setMap(gMap);

                    scope.$watch('show', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            doShow = newValue;
                            if (newValue)
                                trafficLayer.setMap(gMap);
                            else 
                                trafficLayer.setMap(null);
                            
                        }
                    }, true);

                    // remove marker on scope $destroy
                    scope.$on("$destroy", function () {
                        trafficLayer.setMap(null);
                    });
                });
            }
        };
    }]);
