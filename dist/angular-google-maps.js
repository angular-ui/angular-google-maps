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
      createMarkerOptions: function(map, coords, icon, defaults) {
        return angular.extend({}, defaults, {
          position: new google.maps.LatLng(coords.latitude, coords.longitude),
          map: map.getMap(),
          icon: icon,
          visible: (coords.latitude != null) && (coords.longitude != null)
        });
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

      function MarkerChildModel(index, model, parentScope, gMap, $timeout, defaults, doClick) {
        this.watchDestroy = __bind(this.watchDestroy, this);
        this.setOptions = __bind(this.setOptions, this);
        this.setIcon = __bind(this.setIcon, this);
        this.setCoords = __bind(this.setCoords, this);
        this.destroy = __bind(this.destroy, this);
        this.createMarker = __bind(this.createMarker, this);
        this.setMyScope = __bind(this.setMyScope, this);
        var _this = this;
        this.index = index;
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
              return gSetter(this.myScope);
            }
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
          this.gMarker.setMap(this.gMap.getMap());
          this.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
          return this.gMarker.setVisible((scope.coords.latitude != null) && (scope.coords.longitude != null));
        } else {
          return this.gMarker.setMap(null);
        }
      };

      MarkerChildModel.prototype.setIcon = function(scope) {
        if (scope.$id !== this.myScope.$id || this.gMarker === void 0) {
          return;
        }
        this.gMarker.setIcon(scope.icon);
        this.gMarker.setMap(null);
        this.gMarker.setMap(this.gMap.getMap());
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
          this.gMarker.setMap(null);
          delete this.gMarker;
        }
        if (!((_ref = scope.coords) != null ? _ref : typeof scope.icon === "function" ? scope.icon(scope.options != null) : void 0)) {
          return;
        }
        this.opts = this.createMarkerOptions(this.gMap, scope.coords, scope.icon, scope.options);
        this.gMarker = new google.maps.Marker(this.opts);
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
            _this.gMarker.setMap(null);
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
          return google.maps.event.addListener(this.gWin, 'closeclick', function() {
            _this.markerCtrl.setVisible(_this.initialMarkerVisibility);
            return _this.scope.closeClick();
          });
        }
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
        opts = this.createMarkerOptions(mapCtrl, scope.coords, scope.icon, scope.options);
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
              return this.gMarker = new google.maps.Marker(this.createMarkerOptions(this.mapCtrl, scope.coords, scope.icon, scope.options));
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
        this.bigGulp.handleLargeArray(scope.models, function(model) {
          scope.doRebuild = true;
          _this.markers.push(new directives.api.models.child.MarkerChildModel(_this.markersIndex, model, scope, _this.mapCtrl, _this.$timeout, _this.DEFAULTS, _this.doClick));
          return _this.markersIndex++;
        });
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
        if (propNameToWatch === 'options' && (newValue != null)) {
          this.DEFAULTS = newValue;
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
;angular.module("google-maps")
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
                events: '=events',           // optional
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
