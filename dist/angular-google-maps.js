/*! angular-google-maps 2.3.2 2016-05-13
 *  AngularJS directives for Google Maps
 *  git: https://github.com/angular-ui/angular-google-maps.git
 */
;
(function( window, angular, undefined ){
  'use strict';
/*
!
The MIT License

Copyright (c) 2010-2013 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

angular-google-maps
https://github.com/angular-ui/angular-google-maps

@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */

(function() {
  angular.module('uiGmapgoogle-maps.providers', ['nemLogging']);

  angular.module('uiGmapgoogle-maps.wrapped', []);

  angular.module('uiGmapgoogle-maps.extensions', ['uiGmapgoogle-maps.wrapped', 'uiGmapgoogle-maps.providers']);

  angular.module('uiGmapgoogle-maps.directives.api.utils', ['uiGmapgoogle-maps.extensions']);

  angular.module('uiGmapgoogle-maps.directives.api.managers', []);

  angular.module('uiGmapgoogle-maps.directives.api.options', ['uiGmapgoogle-maps.directives.api.utils']);

  angular.module('uiGmapgoogle-maps.directives.api.options.builders', []);

  angular.module('uiGmapgoogle-maps.directives.api.models.child', ['uiGmapgoogle-maps.directives.api.utils', 'uiGmapgoogle-maps.directives.api.options', 'uiGmapgoogle-maps.directives.api.options.builders']);

  angular.module('uiGmapgoogle-maps.directives.api.models.parent', ['uiGmapgoogle-maps.directives.api.managers', 'uiGmapgoogle-maps.directives.api.models.child', 'uiGmapgoogle-maps.providers']);

  angular.module('uiGmapgoogle-maps.directives.api', ['uiGmapgoogle-maps.directives.api.models.parent']);

  angular.module('uiGmapgoogle-maps', ['uiGmapgoogle-maps.directives.api', 'uiGmapgoogle-maps.providers']);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.providers').factory('uiGmapMapScriptLoader', [
    '$q', 'uiGmapuuid', function($q, uuid) {
      var getScriptUrl, includeScript, isGoogleMapsLoaded, scriptId, usedConfiguration;
      scriptId = void 0;
      usedConfiguration = void 0;
      getScriptUrl = function(options) {
        if (options.china) {
          return 'http://maps.google.cn/maps/api/js?';
        } else {
          if (options.transport === 'auto') {
            return '//maps.googleapis.com/maps/api/js?';
          } else {
            return options.transport + '://maps.googleapis.com/maps/api/js?';
          }
        }
      };
      includeScript = function(options) {
        var omitOptions, query, script, scriptElem;
        omitOptions = ['transport', 'isGoogleMapsForWork', 'china', 'preventLoad'];
        if (options.isGoogleMapsForWork) {
          omitOptions.push('key');
        }
        query = _.map(_.omit(options, omitOptions), function(v, k) {
          return k + '=' + v;
        });
        if (scriptId) {
          scriptElem = document.getElementById(scriptId);
          scriptElem.parentNode.removeChild(scriptElem);
        }
        query = query.join('&');
        script = document.createElement('script');
        script.id = scriptId = "ui_gmap_map_load_" + (uuid.generate());
        script.type = 'text/javascript';
        script.src = getScriptUrl(options) + query;
        return document.body.appendChild(script);
      };
      isGoogleMapsLoaded = function() {
        return angular.isDefined(window.google) && angular.isDefined(window.google.maps);
      };
      return {
        load: function(options) {
          var deferred, randomizedFunctionName;
          deferred = $q.defer();
          if (isGoogleMapsLoaded()) {
            deferred.resolve(window.google.maps);
            return deferred.promise;
          }
          randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000);
          window[randomizedFunctionName] = function() {
            window[randomizedFunctionName] = null;
            deferred.resolve(window.google.maps);
          };
          if (window.navigator.connection && window.Connection && window.navigator.connection.type === window.Connection.NONE && !options.preventLoad) {
            document.addEventListener('online', function() {
              if (!isGoogleMapsLoaded()) {
                return includeScript(options);
              }
            });
          } else if (!options.preventLoad) {
            includeScript(options);
          }
          usedConfiguration = options;
          usedConfiguration.randomizedFunctionName = randomizedFunctionName;
          return deferred.promise;
        },
        manualLoad: function() {
          var config;
          config = usedConfiguration;
          if (!isGoogleMapsLoaded()) {
            return includeScript(config);
          } else {
            if (window[config.randomizedFunctionName]) {
              return window[config.randomizedFunctionName]();
            }
          }
        }
      };
    }
  ]).provider('uiGmapGoogleMapApi', function() {
    this.options = {
      transport: 'https',
      isGoogleMapsForWork: false,
      china: false,
      v: '3',
      libraries: '',
      language: 'en',
      preventLoad: false
    };
    this.configure = function(options) {
      angular.extend(this.options, options);
    };
    this.$get = [
      'uiGmapMapScriptLoader', (function(_this) {
        return function(loader) {
          return loader.load(_this.options);
        };
      })(this)
    ];
    return this;
  }).service('uiGmapGoogleMapApiManualLoader', [
    'uiGmapMapScriptLoader', function(loader) {
      return {
        load: function() {
          loader.manualLoad();
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.extensions').service('uiGmapExtendGWin', function() {
    return {
      init: _.once(function() {
        var uiGmapInfoBox;
        if (!(google || (typeof google !== "undefined" && google !== null ? google.maps : void 0) || (google.maps.InfoWindow != null))) {
          return;
        }
        google.maps.InfoWindow.prototype._open = google.maps.InfoWindow.prototype.open;
        google.maps.InfoWindow.prototype._close = google.maps.InfoWindow.prototype.close;
        google.maps.InfoWindow.prototype._isOpen = false;
        google.maps.InfoWindow.prototype.open = function(map, anchor, recurse) {
          if (recurse != null) {
            return;
          }
          this._isOpen = true;
          this._open(map, anchor, true);
        };
        google.maps.InfoWindow.prototype.close = function(recurse) {
          if (recurse != null) {
            return;
          }
          this._isOpen = false;
          this._close(true);
        };
        google.maps.InfoWindow.prototype.isOpen = function(val) {
          if (val == null) {
            val = void 0;
          }
          if (val == null) {
            return this._isOpen;
          } else {
            return this._isOpen = val;
          }
        };

        /*
        Do the same for InfoBox
        TODO: Clean this up so the logic is defined once, wait until develop becomes master as this will be easier
         */
        if (window.InfoBox) {
          window.InfoBox.prototype._open = window.InfoBox.prototype.open;
          window.InfoBox.prototype._close = window.InfoBox.prototype.close;
          window.InfoBox.prototype._isOpen = false;
          window.InfoBox.prototype.open = function(map, anchor) {
            this._isOpen = true;
            this._open(map, anchor);
          };
          window.InfoBox.prototype.close = function() {
            this._isOpen = false;
            this._close();
          };
          window.InfoBox.prototype.isOpen = function(val) {
            if (val == null) {
              val = void 0;
            }
            if (val == null) {
              return this._isOpen;
            } else {
              return this._isOpen = val;
            }
          };
          uiGmapInfoBox = (function(superClass) {
            extend(uiGmapInfoBox, superClass);

            function uiGmapInfoBox(opts) {
              this.getOrigCloseBoxImg_ = bind(this.getOrigCloseBoxImg_, this);
              this.getCloseBoxDiv_ = bind(this.getCloseBoxDiv_, this);
              var box;
              box = new window.InfoBox(opts);
              _.extend(this, box);
              if (opts.closeBoxDiv != null) {
                this.closeBoxDiv_ = opts.closeBoxDiv;
              }
            }

            uiGmapInfoBox.prototype.getCloseBoxDiv_ = function() {
              return this.closeBoxDiv_;
            };

            uiGmapInfoBox.prototype.getCloseBoxImg_ = function() {
              var div, img;
              div = this.getCloseBoxDiv_();
              img = this.getOrigCloseBoxImg_();
              return div || img;
            };

            uiGmapInfoBox.prototype.getOrigCloseBoxImg_ = function() {
              var img;
              img = "";
              if (this.closeBoxURL_ !== "") {
                img = "<img";
                img += " src='" + this.closeBoxURL_ + "'";
                img += " align=right";
                img += " style='";
                img += " position: relative;";
                img += " cursor: pointer;";
                img += " margin: " + this.closeBoxMargin_ + ";";
                img += "'>";
              }
              return img;
            };

            return uiGmapInfoBox;

          })(window.InfoBox);
          window.uiGmapInfoBox = uiGmapInfoBox;
        }
        if (window.MarkerLabel_) {
          return window.MarkerLabel_.prototype.setContent = function() {
            var content;
            content = this.marker_.get('labelContent');
            if (!content || _.isEqual(this.oldContent, content)) {
              return;
            }
            if (typeof (content != null ? content.nodeType : void 0) === 'undefined') {
              this.labelDiv_.innerHTML = content;
              this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
              this.oldContent = content;
            } else {
              this.labelDiv_.innerHTML = '';
              this.labelDiv_.appendChild(content);
              content = content.cloneNode(true);
              this.labelDiv_.innerHTML = '';
              this.eventDiv_.appendChild(content);
              this.oldContent = content;
            }
          };
        }
      })
    };
  });

}).call(this);
;
/*global _:true, angular:true */

(function() {
  angular.module('uiGmapgoogle-maps.extensions').service('uiGmapLodash', function() {
    var baseGet, baseToString, fixLodash, get, reEscapeChar, rePropName, toObject, toPath;
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
    reEscapeChar = /\\(\\)?/g;

    /*
        For Lodash 4 compatibility (some aliases are removed)
     */
    fixLodash = function(arg) {
      var isProto, missingName, swapName;
      missingName = arg.missingName, swapName = arg.swapName, isProto = arg.isProto;
      if (_[missingName] == null) {
        _[missingName] = _[swapName];
        if (isProto) {
          return _.prototype[missingName] = _[swapName];
        }
      }
    };
    [
      {
        missingName: 'contains',
        swapName: 'includes',
        isProto: true
      }, {
        missingName: 'includes',
        swapName: 'contains',
        isProto: true
      }, {
        missingName: 'object',
        swapName: 'zipObject'
      }, {
        missingName: 'zipObject',
        swapName: 'object'
      }, {
        missingName: 'all',
        swapName: 'every'
      }, {
        missingName: 'every',
        swapName: 'all'
      }, {
        missingName: 'any',
        swapName: 'some'
      }, {
        missingName: 'some',
        swapName: 'any'
      }, {
        missingName: 'first',
        swapName: 'head'
      }, {
        missingName: 'head',
        swapName: 'first'
      }
    ].forEach(function(toMonkeyPatch) {
      return fixLodash(toMonkeyPatch);
    });
    if (_.get == null) {

      /**
       * Converts `value` to an object if it's not one.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {Object} Returns the object.
       */
      toObject = function(value) {
        if (_.isObject(value)) {
          return value;
        } else {
          return Object(value);
        }
      };

      /**
       * Converts `value` to a string if it's not one. An empty string is returned
       * for `null` or `undefined` values.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {string} Returns the string.
       */
      baseToString = function(value) {
        if (value === null) {
          return '';
        } else {
          return value + '';
        }
      };

      /**
       * Converts `value` to property path array if it's not one.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {Array} Returns the property path array.
       */
      toPath = function(value) {
        var result;
        if (_.isArray(value)) {
          return value;
        }
        result = [];
        baseToString(value).replace(rePropName, function(match, number, quote, string) {
          result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
        });
        return result;
      };

      /**
       * The base implementation of `get` without support for string paths
       * and default values.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array} path The path of the property to get.
       * @param {string} [pathKey] The key representation of path.
       * @returns {*} Returns the resolved value.
       */
      baseGet = function(object, path, pathKey) {
        var index, length;
        if (object === null) {
          return;
        }
        if (pathKey !== void 0 && pathKey in toObject(object)) {
          path = [pathKey];
        }
        index = 0;
        length = path.length;
        while (!_.isUndefined(object) && index < length) {
          object = object[path[index++]];
        }
        if (index && index === length) {
          return object;
        } else {
          return void 0;
        }
      };

      /**
       * Gets the property value at `path` of `object`. If the resolved value is
       * `undefined` the `defaultValue` is used in its place.
       *
       * @static
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the property to get.
       * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
       * @returns {*} Returns the resolved value.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }] };
       *
       * _.get(object, 'a[0].b.c');
       * // => 3
       *
       * _.get(object, ['a', '0', 'b', 'c']);
       * // => 3
       *
       * _.get(object, 'a.b.c', 'default');
       * // => 'default'
       */
      get = function(object, path, defaultValue) {
        var result;
        result = object === null ? void 0 : baseGet(object, toPath(path), path + '');
        if (result === void 0) {
          return defaultValue;
        } else {
          return result;
        }
      };
      _.get = get;
    }

    /*
        Author Nick McCready
        Intersection of Objects if the arrays have something in common each intersecting object will be returned
        in an new array.
     */
    this.intersectionObjects = function(array1, array2, comparison) {
      var res;
      if (comparison == null) {
        comparison = void 0;
      }
      res = _.map(array1, function(obj1) {
        return _.find(array2, function(obj2) {
          if (comparison != null) {
            return comparison(obj1, obj2);
          } else {
            return _.isEqual(obj1, obj2);
          }
        });
      });
      return _.filter(res, function(o) {
        return o != null;
      });
    };
    this.containsObject = _.includeObject = function(obj, target, comparison) {
      if (comparison == null) {
        comparison = void 0;
      }
      if (obj === null) {
        return false;
      }
      return _.some(obj, function(value) {
        if (comparison != null) {
          return comparison(value, target);
        } else {
          return _.isEqual(value, target);
        }
      });
    };
    this.differenceObjects = function(array1, array2, comparison) {
      if (comparison == null) {
        comparison = void 0;
      }
      return _.filter(array1, (function(_this) {
        return function(value) {
          return !_this.containsObject(array2, value, comparison);
        };
      })(this));
    };
    this.withoutObjects = this.differenceObjects;
    this.indexOfObject = function(array, item, comparison, isSorted) {
      var i, length;
      if (array == null) {
        return -1;
      }
      i = 0;
      length = array.length;
      if (isSorted) {
        if (typeof isSorted === "number") {
          i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
        } else {
          i = _.sortedIndex(array, item);
          return (array[i] === item ? i : -1);
        }
      }
      while (i < length) {
        if (comparison != null) {
          if (comparison(array[i], item)) {
            return i;
          }
        } else {
          if (_.isEqual(array[i], item)) {
            return i;
          }
        }
        i++;
      }
      return -1;
    };
    this.isNullOrUndefined = function(thing) {
      return _.isNull(thing || _.isUndefined(thing));
    };
    return this;
  });

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.extensions').factory('uiGmapString', function() {
    return function(str) {
      this.contains = function(value, fromIndex) {
        return str.indexOf(value, fromIndex) !== -1;
      };
      return this;
    };
  });

}).call(this);
;
/*global _:true,angular:true, */

(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmap_sync', [
    function() {
      return {
        fakePromise: function() {
          var _cb;
          _cb = void 0;
          return {
            then: function(cb) {
              return _cb = cb;
            },
            resolve: function() {
              return _cb.apply(void 0, arguments);
            }
          };
        }
      };
    }
  ]).service('uiGmap_async', [
    '$timeout', 'uiGmapPromise', 'uiGmapLogger', '$q', 'uiGmapDataStructures', 'uiGmapGmapUtil', function($timeout, uiGmapPromise, $log, $q, uiGmapDataStructures, uiGmapGmapUtil) {
      var ExposedPromise, PromiseQueueManager, SniffedPromise, _getIterateeValue, _ignoreFields, defaultChunkSize, doChunk, doSkippPromise, each, errorObject, getArrayAndKeys, isInProgress, kickPromise, logTryCatch, managePromiseQueue, map, maybeCancelPromises, promiseStatus, promiseTypes, tryCatch;
      promiseTypes = uiGmapPromise.promiseTypes;
      isInProgress = uiGmapPromise.isInProgress;
      promiseStatus = uiGmapPromise.promiseStatus;
      ExposedPromise = uiGmapPromise.ExposedPromise;
      SniffedPromise = uiGmapPromise.SniffedPromise;
      kickPromise = function(sniffedPromise, cancelCb) {
        var promise;
        promise = sniffedPromise.promise();
        promise.promiseType = sniffedPromise.promiseType;
        if (promise.$$state) {
          $log.debug("promiseType: " + promise.promiseType + ", state: " + (promiseStatus(promise.$$state.status)));
        }
        promise.cancelCb = cancelCb;
        return promise;
      };
      doSkippPromise = function(sniffedPromise, lastPromise) {
        if (sniffedPromise.promiseType === promiseTypes.create && lastPromise.promiseType !== promiseTypes["delete"] && lastPromise.promiseType !== promiseTypes.init) {
          $log.debug("lastPromise.promiseType " + lastPromise.promiseType + ", newPromiseType: " + sniffedPromise.promiseType + ", SKIPPED MUST COME AFTER DELETE ONLY");
          return true;
        }
        return false;
      };
      maybeCancelPromises = function(queue, sniffedPromise, lastPromise) {
        var first;
        if (sniffedPromise.promiseType === promiseTypes["delete"] && lastPromise.promiseType !== promiseTypes["delete"]) {
          if ((lastPromise.cancelCb != null) && _.isFunction(lastPromise.cancelCb) && isInProgress(lastPromise)) {
            $log.debug("promiseType: " + sniffedPromise.promiseType + ", CANCELING LAST PROMISE type: " + lastPromise.promiseType);
            lastPromise.cancelCb('cancel safe');
            first = queue.peek();
            if ((first != null) && isInProgress(first)) {
              if (first.hasOwnProperty("cancelCb") && _.isFunction(first.cancelCb)) {
                $log.debug("promiseType: " + first.promiseType + ", CANCELING FIRST PROMISE type: " + first.promiseType);
                return first.cancelCb('cancel safe');
              } else {
                return $log.warn('first promise was not cancelable');
              }
            }
          }
        }
      };

      /*
      From a High Level:
        This is a SniffedPromiseQueueManager (looking to rename) where the queue is existingPiecesObj.existingPieces.
        This is a function and should not be considered a class.
        So it is run to manage the state (cancel, skip, link) as needed.
      Purpose:
      The whole point is to check if there is existing async work going on. If so we wait on it.
      
      arguments:
      - existingPiecesObj =  Queue<Promises>
      - sniffedPromise = object wrapper holding a function to a pending (function) promise (promise: fnPromise)
      with its intended type.
      - cancelCb = callback which accepts a string, this string is intended to be returned at the end of _async.each iterator
      
        Where the cancelCb passed msg is 'cancel safe' _async.each will drop out and fall through. Thus canceling the promise
        gracefully without messing up state.
      
      Synopsis:
      
       - Promises have been broken down to 4 states create, update,delete (3 main) and init. (Helps boil down problems in ordering)
        where (init) is special to indicate that it is one of the first or to allow a create promise to work beyond being after a delete
      
       - Every Promise that comes in is enqueued and linked to the last promise in the queue.
      
       - A promise can be skipped or canceled to save cycles.
      
      Saved Cycles:
        - Skipped - This will only happen if async work comes in out of order. Where a pending create promise (un-executed) comes in
          after a delete promise.
        - Canceled - Where an incoming promise (un-executed promise) is of type delete and the any lastPromise is not a delete type.
      
      
      NOTE:
      - You should not muck with existingPieces as its state is dependent on this functional loop.
      - PromiseQueueManager should not be thought of as a class that has a life expectancy (it has none). It's sole
      purpose is to link, skip, and kill promises. It also manages the promise queue existingPieces.
       */
      PromiseQueueManager = function(existingPiecesObj, sniffedPromise, cancelCb) {
        var lastPromise, newPromise;
        if (!existingPiecesObj.existingPieces) {
          existingPiecesObj.existingPieces = new uiGmapDataStructures.Queue();
          return existingPiecesObj.existingPieces.enqueue(kickPromise(sniffedPromise, cancelCb));
        } else {
          lastPromise = _.last(existingPiecesObj.existingPieces._content);
          if (doSkippPromise(sniffedPromise, lastPromise)) {
            return;
          }
          maybeCancelPromises(existingPiecesObj.existingPieces, sniffedPromise, lastPromise);
          newPromise = ExposedPromise(lastPromise["finally"](function() {
            return kickPromise(sniffedPromise, cancelCb);
          }));
          newPromise.cancelCb = cancelCb;
          newPromise.promiseType = sniffedPromise.promiseType;
          existingPiecesObj.existingPieces.enqueue(newPromise);
          return lastPromise["finally"](function() {
            return existingPiecesObj.existingPieces.dequeue();
          });
        }
      };
      managePromiseQueue = function(objectToLock, promiseType, msg, cancelCb, fnPromise) {
        var cancelLogger;
        if (msg == null) {
          msg = '';
        }
        cancelLogger = function(msg) {
          $log.debug(msg + ": " + msg);
          if ((cancelCb != null) && _.isFunction(cancelCb)) {
            return cancelCb(msg);
          }
        };
        return PromiseQueueManager(objectToLock, SniffedPromise(fnPromise, promiseType), cancelLogger);
      };
      defaultChunkSize = 80;
      errorObject = {
        value: null
      };
      tryCatch = function(fn, ctx, args) {
        var e, error1;
        try {
          return fn.apply(ctx, args);
        } catch (error1) {
          e = error1;
          errorObject.value = e;
          return errorObject;
        }
      };
      logTryCatch = function(fn, ctx, deferred, args) {
        var msg, result;
        result = tryCatch(fn, ctx, args);
        if (result === errorObject) {
          msg = "error within chunking iterator: " + errorObject.value;
          $log.error(msg);
          deferred.reject(msg);
        }
        if (result === 'cancel safe') {
          return false;
        }
        return true;
      };
      _getIterateeValue = function(collection, array, index) {
        var _isArray, valOrKey;
        _isArray = collection === array;
        valOrKey = array[index];
        if (_isArray) {
          return valOrKey;
        }
        return collection[valOrKey];
      };
      _ignoreFields = ['length', 'forEach', 'map'];
      getArrayAndKeys = function(collection, keys, bailOutCb, cb) {
        var array, propName, val;
        if (angular.isArray(collection)) {
          array = collection;
        } else {
          if (keys) {
            array = keys;
          } else {
            array = [];
            for (propName in collection) {
              val = collection[propName];
              if (collection.hasOwnProperty(propName) && !_.includes(_ignoreFields, propName)) {
                array.push(propName);
              }
            }
          }
        }
        if (cb == null) {
          cb = bailOutCb;
        }
        if (angular.isArray(array) && !(array != null ? array.length : void 0)) {
          if (cb !== bailOutCb) {
            return bailOutCb();
          }
        }
        return cb(array, keys);
      };

      /*
        Author: Nicholas McCready & jfriend00
        _async handles things asynchronous-like :), to allow the UI to be free'd to do other things
        Code taken from http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui
      
        The design of any functionality of _async is to be like lodash/underscore and replicate it but call things
        asynchronously underneath. Each should be sufficient for most things to be derived from.
      
        Optional Asynchronous Chunking via promises.
       */
      doChunk = function(collection, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index, _keys) {
        return getArrayAndKeys(collection, _keys, function(array, keys) {
          var cnt, i, keepGoing, val;
          if (chunkSizeOrDontChunk && chunkSizeOrDontChunk < array.length) {
            cnt = chunkSizeOrDontChunk;
          } else {
            cnt = array.length;
          }
          i = index;
          keepGoing = true;
          while (keepGoing && cnt-- && i < (array ? array.length : i + 1)) {
            val = _getIterateeValue(collection, array, i);
            keepGoing = angular.isFunction(val) ? true : logTryCatch(chunkCb, void 0, overallD, [val, i]);
            ++i;
          }
          if (array) {
            if (keepGoing && i < array.length) {
              index = i;
              if (chunkSizeOrDontChunk) {
                if ((pauseCb != null) && _.isFunction(pauseCb)) {
                  logTryCatch(pauseCb, void 0, overallD, []);
                }
                return $timeout(function() {
                  return doChunk(collection, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index, keys);
                }, pauseMilli, false);
              }
            } else {
              return overallD.resolve();
            }
          }
        });
      };
      each = function(collection, chunk, chunkSizeOrDontChunk, pauseCb, index, pauseMilli, _keys) {
        var error, overallD, ret;
        if (chunkSizeOrDontChunk == null) {
          chunkSizeOrDontChunk = defaultChunkSize;
        }
        if (index == null) {
          index = 0;
        }
        if (pauseMilli == null) {
          pauseMilli = 1;
        }
        ret = void 0;
        overallD = uiGmapPromise.defer();
        ret = overallD.promise;
        if (!pauseMilli) {
          error = 'pause (delay) must be set from _async!';
          $log.error(error);
          overallD.reject(error);
          return ret;
        }
        return getArrayAndKeys(collection, _keys, function() {
          overallD.resolve();
          return ret;
        }, function(array, keys) {
          doChunk(collection, chunkSizeOrDontChunk, pauseMilli, chunk, pauseCb, overallD, index, keys);
          return ret;
        });
      };
      map = function(collection, iterator, chunkSizeOrDontChunk, pauseCb, index, pauseMilli, _keys) {
        var results;
        results = [];
        return getArrayAndKeys(collection, _keys, function() {
          return uiGmapPromise.resolve(results);
        }, function(array, keys) {
          return each(collection, function(o) {
            return results.push(iterator(o));
          }, chunkSizeOrDontChunk, pauseCb, index, pauseMilli, keys).then(function() {
            return results;
          });
        });
      };
      return {
        each: each,
        map: map,
        managePromiseQueue: managePromiseQueue,
        promiseLock: managePromiseQueue,
        defaultChunkSize: defaultChunkSize,
        getArrayAndKeys: getArrayAndKeys,
        chunkSizeFrom: function(fromSize, ret) {
          if (ret == null) {
            ret = void 0;
          }
          if (_.isNumber(fromSize)) {
            ret = fromSize;
          }
          if (uiGmapGmapUtil.isFalse(fromSize) || fromSize === false) {
            ret = false;
          }
          return ret;
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapBaseObject', function() {
    var BaseObject, baseObjectKeywords;
    baseObjectKeywords = ['extended', 'included'];
    BaseObject = (function() {
      function BaseObject() {}

      BaseObject.extend = function(obj) {
        var key, ref, value;
        for (key in obj) {
          value = obj[key];
          if (indexOf.call(baseObjectKeywords, key) < 0) {
            this[key] = value;
          }
        }
        if ((ref = obj.extended) != null) {
          ref.apply(this);
        }
        return this;
      };

      BaseObject.include = function(obj) {
        var key, ref, value;
        for (key in obj) {
          value = obj[key];
          if (indexOf.call(baseObjectKeywords, key) < 0) {
            this.prototype[key] = value;
          }
        }
        if ((ref = obj.included) != null) {
          ref.apply(this);
        }
        return this;
      };

      return BaseObject;

    })();
    return BaseObject;
  });

}).call(this);
;
/*
    Useful function callbacks that should be defined at later time.
    Mainly to be used for specs to verify creation / linking.

    This is to lead a common design in notifying child stuff.
 */

(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapChildEvents', function() {
    return {
      onChildCreation: function(child) {}
    };
  });

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapCtrlHandle', [
    '$q', function($q) {
      var CtrlHandle;
      return CtrlHandle = {
        handle: function($scope, $element) {
          $scope.$on('$destroy', function() {
            return CtrlHandle.handle($scope);
          });
          $scope.deferred = $q.defer();
          return {
            getScope: function() {
              return $scope;
            }
          };
        },
        mapPromise: function(scope, ctrl) {
          var mapScope;
          mapScope = ctrl.getScope();
          mapScope.deferred.promise.then(function(map) {
            return scope.map = map;
          });
          return mapScope.deferred.promise;
        }
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module("uiGmapgoogle-maps.directives.api.utils").service("uiGmapEventsHelper", [
    "uiGmapLogger", function($log) {
      var _getEventsObj, _hasEvents;
      _hasEvents = function(obj) {
        return angular.isDefined(obj.events) && (obj.events != null) && angular.isObject(obj.events);
      };
      _getEventsObj = function(scope, model) {
        if (_hasEvents(scope)) {
          return scope;
        }
        if (_hasEvents(model)) {
          return model;
        }
      };
      return {
        setEvents: function(gObject, scope, model, ignores) {
          var eventObj;
          eventObj = _getEventsObj(scope, model);
          if (eventObj != null) {
            return _.compact(_.map(eventObj.events, function(eventHandler, eventName) {
              var doIgnore;
              if (ignores) {
                doIgnore = _(ignores).includes(eventName);
              }
              if (eventObj.events.hasOwnProperty(eventName) && angular.isFunction(eventObj.events[eventName]) && !doIgnore) {
                return google.maps.event.addListener(gObject, eventName, function() {
                  if (!scope.$evalAsync) {
                    scope.$evalAsync = function() {};
                  }
                  return scope.$evalAsync(eventHandler.apply(scope, [gObject, eventName, model, arguments]));
                });
              }
            }));
          }
        },
        removeEvents: function(listeners) {
          var key, l;
          if (!listeners) {
            return;
          }
          for (key in listeners) {
            l = listeners[key];
            if (l && listeners.hasOwnProperty(key)) {
              google.maps.event.removeListener(l);
            }
          }
        }
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapFitHelper', [
    'uiGmapLogger', '$timeout', function($log, $timeout) {
      return {
        fit: function(markersOrPoints, gMap) {
          var bounds, everSet, key, markerOrPoint, point;
          if (gMap && (markersOrPoints != null ? markersOrPoints.length : void 0)) {
            bounds = new google.maps.LatLngBounds();
            everSet = false;
            for (key in markersOrPoints) {
              markerOrPoint = markersOrPoints[key];
              if (markerOrPoint) {
                if (!everSet) {
                  everSet = true;
                }
                point = _.isFunction(markerOrPoint.getPosition) ? markerOrPoint.getPosition() : markerOrPoint;
              }
              bounds.extend(point);
            }
            if (everSet) {
              return $timeout(function() {
                return gMap.fitBounds(bounds);
              });
            }
          }
        }
      };
    }
  ]);

}).call(this);
;
/*global _:true, angular:true, google:true */

(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapGmapUtil', [
    'uiGmapLogger', '$compile', function(Logger, $compile) {
      var _isFalse, _isTruthy, getCoords, getLatitude, getLongitude, validateCoords;
      _isTruthy = function(value, bool, optionsArray) {
        return value === bool || optionsArray.indexOf(value) !== -1;
      };
      _isFalse = function(value) {
        return _isTruthy(value, false, ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO']);
      };
      getLatitude = function(value) {
        if (Array.isArray(value) && value.length === 2) {
          return value[1];
        } else if (angular.isDefined(value.type) && value.type === 'Point') {
          return value.coordinates[1];
        } else {
          return value.latitude;
        }
      };
      getLongitude = function(value) {
        if (Array.isArray(value) && value.length === 2) {
          return value[0];
        } else if (angular.isDefined(value.type) && value.type === 'Point') {
          return value.coordinates[0];
        } else {
          return value.longitude;
        }
      };
      getCoords = function(value) {
        if (!value) {
          return;
        }
        if (value instanceof google.maps.LatLng) {
          return value;
        } else if (Array.isArray(value) && value.length === 2) {
          return new google.maps.LatLng(value[1], value[0]);
        } else if (angular.isDefined(value.type) && value.type === 'Point') {
          return new google.maps.LatLng(value.coordinates[1], value.coordinates[0]);
        } else {
          return new google.maps.LatLng(value.latitude, value.longitude);
        }
      };
      validateCoords = function(coords) {
        if (angular.isUndefined(coords)) {
          return false;
        }
        if (_.isArray(coords)) {
          if (coords.length === 2) {
            return true;
          }
        } else if ((coords != null) && (coords != null ? coords.type : void 0)) {
          if (coords.type === 'Point' && _.isArray(coords.coordinates) && coords.coordinates.length === 2) {
            return true;
          }
        }
        if (coords && angular.isDefined((coords != null ? coords.latitude : void 0) && angular.isDefined(coords != null ? coords.longitude : void 0))) {
          return true;
        }
        return false;
      };
      return {
        setCoordsFromEvent: function(prevValue, newLatLon) {
          if (!prevValue) {
            return;
          }
          if (Array.isArray(prevValue) && prevValue.length === 2) {
            prevValue[1] = newLatLon.lat();
            prevValue[0] = newLatLon.lng();
          } else if (angular.isDefined(prevValue.type) && prevValue.type === 'Point') {
            prevValue.coordinates[1] = newLatLon.lat();
            prevValue.coordinates[0] = newLatLon.lng();
          } else {
            prevValue.latitude = newLatLon.lat();
            prevValue.longitude = newLatLon.lng();
          }
          return prevValue;
        },
        getLabelPositionPoint: function(anchor) {
          var xPos, yPos;
          if (anchor === void 0) {
            return void 0;
          }
          anchor = /^([-\d\.]+)\s([-\d\.]+)$/.exec(anchor);
          xPos = parseFloat(anchor[1]);
          yPos = parseFloat(anchor[2]);
          if ((xPos != null) && (yPos != null)) {
            return new google.maps.Point(xPos, yPos);
          }
        },
        createWindowOptions: function(gMarker, scope, content, defaults) {
          var options;
          if ((content != null) && (defaults != null) && ($compile != null)) {
            options = angular.extend({}, defaults, {
              content: this.buildContent(scope, defaults, content),
              position: defaults.position != null ? defaults.position : angular.isObject(gMarker) ? gMarker.getPosition() : getCoords(scope.coords)
            });
            if ((gMarker != null) && ((options != null ? options.pixelOffset : void 0) == null)) {
              if (options.boxClass == null) {

              } else {
                options.pixelOffset = {
                  height: 0,
                  width: -2
                };
              }
            }
            return options;
          } else {
            if (!defaults) {
              Logger.error('infoWindow defaults not defined');
              if (!content) {
                return Logger.error('infoWindow content not defined');
              }
            } else {
              return defaults;
            }
          }
        },
        buildContent: function(scope, defaults, content) {
          var parsed, ret;
          if (defaults.content != null) {
            ret = defaults.content;
          } else {
            if ($compile != null) {
              content = content.replace(/^\s+|\s+$/g, '');
              parsed = content === '' ? '' : $compile(content)(scope);
              if (parsed.length > 0) {
                ret = parsed[0];
              }
            } else {
              ret = content;
            }
          }
          return ret;
        },
        defaultDelay: 50,
        isTrue: function(value) {
          return _isTruthy(value, true, ['true', 'TRUE', 1, 'y', 'Y', 'yes', 'YES']);
        },
        isFalse: _isFalse,
        isFalsy: function(value) {
          return _isTruthy(value, false, [void 0, null]) || _isFalse(value);
        },
        getCoords: getCoords,
        validateCoords: validateCoords,
        equalCoords: function(coord1, coord2) {
          return getLatitude(coord1) === getLatitude(coord2) && getLongitude(coord1) === getLongitude(coord2);
        },
        validatePath: function(path) {
          var array, i, polygon, trackMaxVertices;
          i = 0;
          if (angular.isUndefined(path.type)) {
            if (!Array.isArray(path) || path.length < 2) {
              return false;
            }
            while (i < path.length) {
              if (!((angular.isDefined(path[i].latitude) && angular.isDefined(path[i].longitude)) || (typeof path[i].lat === 'function' && typeof path[i].lng === 'function'))) {
                return false;
              }
              i++;
            }
            return true;
          } else {
            if (angular.isUndefined(path.coordinates)) {
              return false;
            }
            if (path.type === 'Polygon') {
              if (path.coordinates[0].length < 4) {
                return false;
              }
              array = path.coordinates[0];
            } else if (path.type === 'MultiPolygon') {
              trackMaxVertices = {
                max: 0,
                index: 0
              };
              _.forEach(path.coordinates, function(polygon, index) {
                if (polygon[0].length > this.max) {
                  this.max = polygon[0].length;
                  return this.index = index;
                }
              }, trackMaxVertices);
              polygon = path.coordinates[trackMaxVertices.index];
              array = polygon[0];
              if (array.length < 4) {
                return false;
              }
            } else if (path.type === 'LineString') {
              if (path.coordinates.length < 2) {
                return false;
              }
              array = path.coordinates;
            } else {
              return false;
            }
            while (i < array.length) {
              if (array[i].length !== 2) {
                return false;
              }
              i++;
            }
            return true;
          }
        },
        convertPathPoints: function(path) {
          var array, i, latlng, result, trackMaxVertices;
          i = 0;
          result = new google.maps.MVCArray();
          if (angular.isUndefined(path.type)) {
            while (i < path.length) {
              latlng;
              if (angular.isDefined(path[i].latitude) && angular.isDefined(path[i].longitude)) {
                latlng = new google.maps.LatLng(path[i].latitude, path[i].longitude);
              } else if (typeof path[i].lat === 'function' && typeof path[i].lng === 'function') {
                latlng = path[i];
              }
              result.push(latlng);
              i++;
            }
          } else {
            array;
            if (path.type === 'Polygon') {
              array = path.coordinates[0];
            } else if (path.type === 'MultiPolygon') {
              trackMaxVertices = {
                max: 0,
                index: 0
              };
              _.forEach(path.coordinates, function(polygon, index) {
                if (polygon[0].length > this.max) {
                  this.max = polygon[0].length;
                  return this.index = index;
                }
              }, trackMaxVertices);
              array = path.coordinates[trackMaxVertices.index][0];
            } else if (path.type === 'LineString') {
              array = path.coordinates;
            }
            while (i < array.length) {
              result.push(new google.maps.LatLng(array[i][1], array[i][0]));
              i++;
            }
          }
          return result;
        },
        getPath: function(object, key) {
          var obj;
          if ((key == null) || !_.isString(key)) {
            return key;
          }
          obj = object;
          _.each(key.split('.'), function(value) {
            if (obj) {
              return obj = obj[value];
            }
          });
          return obj;
        },
        validateBoundPoints: function(bounds) {
          if (angular.isUndefined(bounds.sw.latitude) || angular.isUndefined(bounds.sw.longitude) || angular.isUndefined(bounds.ne.latitude) || angular.isUndefined(bounds.ne.longitude)) {
            return false;
          }
          return true;
        },
        convertBoundPoints: function(bounds) {
          var result;
          result = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.sw.latitude, bounds.sw.longitude), new google.maps.LatLng(bounds.ne.latitude, bounds.ne.longitude));
          return result;
        },
        fitMapBounds: function(map, bounds) {
          return map.fitBounds(bounds);
        }
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapIsReady', [
    '$q', '$timeout', function($q, $timeout) {
      var _checkIfReady, _ctr, _promises, _proms;
      _ctr = 0;
      _proms = [];
      _promises = function() {
        return $q.all(_proms);
      };
      _checkIfReady = function(deferred, expectedInstances, retriesLeft) {
        return $timeout(function() {
          if (retriesLeft <= 0) {
            deferred.reject('Your maps are not found we have checked the maximum amount of times. :)');
            return;
          }
          if (_ctr !== expectedInstances) {
            _checkIfReady(deferred, expectedInstances, retriesLeft - 1);
          } else {
            deferred.resolve(_promises());
          }
        }, 100);
      };
      return {
        spawn: function() {
          var d;
          d = $q.defer();
          _proms.push(d.promise);
          _ctr += 1;
          return {
            instance: _ctr,
            deferred: d
          };
        },
        promises: _promises,
        instances: function() {
          return _ctr;
        },
        promise: function(expectedInstances, numRetries) {
          var d;
          if (expectedInstances == null) {
            expectedInstances = 1;
          }
          if (numRetries == null) {
            numRetries = 50;
          }
          d = $q.defer();
          _checkIfReady(d, expectedInstances, numRetries);
          return d.promise;
        },
        reset: function() {
          _ctr = 0;
          _proms.length = 0;
        },
        decrement: function() {
          if (_ctr > 0) {
            _ctr -= 1;
          }
          if (_proms.length) {
            _proms.length -= 1;
          }
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapLinked", [
    "uiGmapBaseObject", function(BaseObject) {
      var Linked;
      Linked = (function(superClass) {
        extend(Linked, superClass);

        function Linked(scope, element, attrs, ctrls) {
          this.scope = scope;
          this.element = element;
          this.attrs = attrs;
          this.ctrls = ctrls;
        }

        return Linked;

      })(BaseObject);
      return Linked;
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapLogger', [
    'nemSimpleLogger', function(nemSimpleLogger) {
      return nemSimpleLogger.spawn();
    }
  ]);

}).call(this);
;
/*global _:true, angular:true */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapModelKey', [
    'uiGmapBaseObject', 'uiGmapGmapUtil', function(BaseObject, GmapUtil) {
      return (function(superClass) {
        extend(_Class, superClass);

        function _Class(scope1, _interface) {
          this.scope = scope1;
          this["interface"] = _interface != null ? _interface : {
            scopeKeys: []
          };
          this.modelsLength = bind(this.modelsLength, this);
          this.updateChild = bind(this.updateChild, this);
          this.destroy = bind(this.destroy, this);
          this.setChildScope = bind(this.setChildScope, this);
          this.getChanges = bind(this.getChanges, this);
          this.getProp = bind(this.getProp, this);
          this.setIdKey = bind(this.setIdKey, this);
          this.modelKeyComparison = bind(this.modelKeyComparison, this);
          _Class.__super__.constructor.call(this);
          this.defaultIdKey = 'id';
          this.idKey = void 0;
        }

        _Class.prototype.evalModelHandle = function(model, modelKey) {
          if ((model == null) || (modelKey == null)) {
            return;
          }
          if (modelKey === 'self') {
            return model;
          } else {
            if (_.isFunction(modelKey)) {
              modelKey = modelKey();
            }
            return GmapUtil.getPath(model, modelKey);
          }
        };

        _Class.prototype.modelKeyComparison = function(model1, model2) {
          var coord1, coord2, hasCoords, isEqual, scope, without;
          hasCoords = this["interface"].scopeKeys.indexOf('coords') >= 0;
          if (hasCoords && (this.scope.coords != null) || !hasCoords) {
            scope = this.scope;
          }
          if (scope == null) {
            throw 'No scope set!';
          }
          if (hasCoords) {
            coord1 = this.scopeOrModelVal('coords', scope, model1);
            coord2 = this.scopeOrModelVal('coords', scope, model2);
            isEqual = GmapUtil.equalCoords(coord1, coord2);
            if (!isEqual) {
              return isEqual;
            }
          }
          without = _.without(this["interface"].scopeKeys, 'coords');
          isEqual = _.every(without, (function(_this) {
            return function(k) {
              return _this.scopeOrModelVal(scope[k], scope, model1) === _this.scopeOrModelVal(scope[k], scope, model2);
            };
          })(this));
          return isEqual;
        };

        _Class.prototype.setIdKey = function(scope) {
          return this.idKey = scope.idKey != null ? scope.idKey : this.defaultIdKey;
        };

        _Class.prototype.setVal = function(model, key, newValue) {
          this.modelOrKey(model, key = newValue);
          return model;
        };

        _Class.prototype.modelOrKey = function(model, key) {
          if (key == null) {
            return;
          }
          if (key !== 'self') {
            return GmapUtil.getPath(model, key);
          }
          return model;
        };

        _Class.prototype.getProp = function(propName, scope, model) {
          return this.scopeOrModelVal(propName, scope, model);
        };


        /*
        For the cases were watching a large object we only want to know the list of props
        that actually changed.
        Also we want to limit the amount of props we analyze to whitelisted props that are
        actually tracked by scope. (should make things faster with whitelisted)
         */

        _Class.prototype.getChanges = function(now, prev, whitelistedProps) {
          var c, changes, prop;
          if (whitelistedProps) {
            prev = _.pick(prev, whitelistedProps);
            now = _.pick(now, whitelistedProps);
          }
          changes = {};
          prop = {};
          c = {};
          for (prop in now) {
            if (!prev || prev[prop] !== now[prop]) {
              if (_.isArray(now[prop])) {
                changes[prop] = now[prop];
              } else if (_.isObject(now[prop])) {
                c = this.getChanges(now[prop], (prev ? prev[prop] : null));
                if (!_.isEmpty(c)) {
                  changes[prop] = c;
                }
              } else {
                changes[prop] = now[prop];
              }
            }
          }
          return changes;
        };

        _Class.prototype.scopeOrModelVal = function(key, scope, model, doWrap) {
          var maybeWrap, modelKey, modelProp, scopeProp;
          if (doWrap == null) {
            doWrap = false;
          }
          maybeWrap = function(isScope, ret, doWrap) {
            if (doWrap == null) {
              doWrap = false;
            }
            if (doWrap) {
              return {
                isScope: isScope,
                value: ret
              };
            }
            return ret;
          };
          scopeProp = _.get(scope, key);
          if (_.isFunction(scopeProp)) {
            return maybeWrap(true, scopeProp(model), doWrap);
          }
          if (_.isObject(scopeProp)) {
            return maybeWrap(true, scopeProp, doWrap);
          }
          if (!_.isString(scopeProp)) {
            return maybeWrap(true, scopeProp, doWrap);
          }
          modelKey = scopeProp;
          if (!modelKey) {
            modelProp = _.get(model, key);
          } else {
            modelProp = modelKey === 'self' ? model : _.get(model, modelKey);
          }
          if (_.isFunction(modelProp)) {
            return maybeWrap(false, modelProp(), doWrap);
          }
          return maybeWrap(false, modelProp, doWrap);
        };

        _Class.prototype.setChildScope = function(keys, childScope, model) {
          var isScopeObj, key, name, newValue;
          for (key in keys) {
            name = keys[key];
            isScopeObj = this.scopeOrModelVal(name, childScope, model, true);
            if ((isScopeObj != null ? isScopeObj.value : void 0) != null) {
              newValue = isScopeObj.value;
              if (newValue !== childScope[name]) {
                childScope[name] = newValue;
              }
            }
          }
          return childScope.model = model;
        };

        _Class.prototype.onDestroy = function(scope) {};

        _Class.prototype.destroy = function(manualOverride) {
          var ref;
          if (manualOverride == null) {
            manualOverride = false;
          }
          if ((this.scope != null) && !((ref = this.scope) != null ? ref.$$destroyed : void 0) && (this.needToManualDestroy || manualOverride)) {
            return this.scope.$destroy();
          } else {
            return this.clean();
          }
        };

        _Class.prototype.updateChild = function(child, model) {
          if (model[this.idKey] == null) {
            this.$log.error("Model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.");
            return;
          }
          return child.updateModel(model);
        };

        _Class.prototype.modelsLength = function(arrayOrObjModels) {
          var len, toCheck;
          if (arrayOrObjModels == null) {
            arrayOrObjModels = void 0;
          }
          len = 0;
          toCheck = arrayOrObjModels ? arrayOrObjModels : this.scope.models;
          if (toCheck == null) {
            return len;
          }
          if (angular.isArray(toCheck) || (toCheck.length != null)) {
            len = toCheck.length;
          } else {
            len = Object.keys(toCheck).length;
          }
          return len;
        };

        return _Class;

      })(BaseObject);
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapModelsWatcher', [
    'uiGmapLogger', 'uiGmap_async', '$q', 'uiGmapPromise', function(Logger, _async, $q, uiGmapPromise) {
      return {
        didQueueInitPromise: function(existingPiecesObj, scope) {
          if (scope.models.length === 0) {
            _async.promiseLock(existingPiecesObj, uiGmapPromise.promiseTypes.init, null, null, (function() {
              return uiGmapPromise.resolve();
            }));
            return true;
          }
          return false;
        },
        figureOutState: function(idKey, scope, childObjects, comparison, callBack) {
          var adds, children, mappedScopeModelIds, removals, updates;
          adds = [];
          mappedScopeModelIds = {};
          removals = [];
          updates = [];
          scope.models.forEach(function(m) {
            var child;
            if (m[idKey] != null) {
              mappedScopeModelIds[m[idKey]] = {};
              if (childObjects.get(m[idKey]) == null) {
                return adds.push(m);
              } else {
                child = childObjects.get(m[idKey]);
                if (!comparison(m, child.clonedModel, scope)) {
                  return updates.push({
                    model: m,
                    child: child
                  });
                }
              }
            } else {
              return Logger.error(' id missing for model #{m.toString()},\ncan not use do comparison/insertion');
            }
          });
          children = childObjects.values();
          children.forEach(function(c) {
            var id;
            if (c == null) {
              Logger.error('child undefined in ModelsWatcher.');
              return;
            }
            if (c.model == null) {
              Logger.error('child.model undefined in ModelsWatcher.');
              return;
            }
            id = c.model[idKey];
            if (mappedScopeModelIds[id] == null) {
              return removals.push(c);
            }
          });
          return {
            adds: adds,
            removals: removals,
            updates: updates
          };
        }
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapPromise', [
    '$q', '$timeout', 'uiGmapLogger', function($q, $timeout, $log) {
      var ExposedPromise, SniffedPromise, defer, isInProgress, isResolved, promise, promiseStatus, promiseStatuses, promiseTypes, resolve, strPromiseStatuses;
      promiseTypes = {
        create: 'create',
        update: 'update',
        "delete": 'delete',
        init: 'init'
      };
      promiseStatuses = {
        IN_PROGRESS: 0,
        RESOLVED: 1,
        REJECTED: 2
      };
      strPromiseStatuses = (function() {
        var obj;
        obj = {};
        obj["" + promiseStatuses.IN_PROGRESS] = 'in-progress';
        obj["" + promiseStatuses.RESOLVED] = 'resolved';
        obj["" + promiseStatuses.REJECTED] = 'rejected';
        return obj;
      })();
      isInProgress = function(promise) {
        if (promise.$$state) {
          return promise.$$state.status === promiseStatuses.IN_PROGRESS;
        }
        if (!promise.hasOwnProperty("$$v")) {
          return true;
        }
      };
      isResolved = function(promise) {
        if (promise.$$state) {
          return promise.$$state.status === promiseStatuses.RESOLVED;
        }
        if (promise.hasOwnProperty("$$v")) {
          return true;
        }
      };
      promiseStatus = function(status) {
        return strPromiseStatuses[status] || 'done w error';
      };
      ExposedPromise = function(promise) {
        var cancelDeferred, combined, wrapped;
        cancelDeferred = $q.defer();
        combined = $q.all([promise, cancelDeferred.promise]);
        wrapped = $q.defer();
        promise.then(cancelDeferred.resolve, (function() {}), function(notify) {
          cancelDeferred.notify(notify);
          return wrapped.notify(notify);
        });
        combined.then(function(successes) {
          return wrapped.resolve(successes[0] || successes[1]);
        }, function(error) {
          return wrapped.reject(error);
        });
        wrapped.promise.cancel = function(reason) {
          if (reason == null) {
            reason = 'canceled';
          }
          return cancelDeferred.reject(reason);
        };
        wrapped.promise.notify = function(msg) {
          if (msg == null) {
            msg = 'cancel safe';
          }
          wrapped.notify(msg);
          if (promise.hasOwnProperty('notify')) {
            return promise.notify(msg);
          }
        };
        if (promise.promiseType != null) {
          wrapped.promise.promiseType = promise.promiseType;
        }
        return wrapped.promise;
      };
      SniffedPromise = function(fnPromise, promiseType) {
        return {
          promise: fnPromise,
          promiseType: promiseType
        };
      };
      defer = function() {
        return $q.defer();
      };
      resolve = function() {
        var d;
        d = $q.defer();
        d.resolve.apply(void 0, arguments);
        return d.promise;
      };
      promise = function(fnToWrap) {
        var d;
        if (!_.isFunction(fnToWrap)) {
          $log.error("uiGmapPromise.promise() only accepts functions");
          return;
        }
        d = $q.defer();
        $timeout(function() {
          var result;
          result = fnToWrap();
          return d.resolve(result);
        });
        return d.promise;
      };
      return {
        defer: defer,
        promise: promise,
        resolve: resolve,
        promiseTypes: promiseTypes,
        isInProgress: isInProgress,
        isResolved: isResolved,
        promiseStatus: promiseStatus,
        ExposedPromise: ExposedPromise,
        SniffedPromise: SniffedPromise
      };
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapPropMap", function() {

    /*
      Simple Object Map with a length property to make it easy to track length/size
     */
    var PropMap;
    return PropMap = (function() {
      function PropMap() {
        this.removeAll = bind(this.removeAll, this);
        this.slice = bind(this.slice, this);
        this.push = bind(this.push, this);
        this.keys = bind(this.keys, this);
        this.values = bind(this.values, this);
        this.remove = bind(this.remove, this);
        this.put = bind(this.put, this);
        this.stateChanged = bind(this.stateChanged, this);
        this.get = bind(this.get, this);
        this.length = 0;
        this.dict = {};
        this.didValsStateChange = false;
        this.didKeysStateChange = false;
        this.allVals = [];
        this.allKeys = [];
      }

      PropMap.prototype.get = function(key) {
        return this.dict[key];
      };

      PropMap.prototype.stateChanged = function() {
        this.didValsStateChange = true;
        return this.didKeysStateChange = true;
      };

      PropMap.prototype.put = function(key, value) {
        if (this.get(key) == null) {
          this.length++;
        }
        this.stateChanged();
        return this.dict[key] = value;
      };

      PropMap.prototype.remove = function(key, isSafe) {
        var value;
        if (isSafe == null) {
          isSafe = false;
        }
        if (isSafe && !this.get(key)) {
          return void 0;
        }
        value = this.dict[key];
        delete this.dict[key];
        this.length--;
        this.stateChanged();
        return value;
      };

      PropMap.prototype.valuesOrKeys = function(str) {
        var keys, vals;
        if (str == null) {
          str = 'Keys';
        }
        if (!this["did" + str + "StateChange"]) {
          return this['all' + str];
        }
        vals = [];
        keys = [];
        _.each(this.dict, function(v, k) {
          vals.push(v);
          return keys.push(k);
        });
        this.didKeysStateChange = false;
        this.didValsStateChange = false;
        this.allVals = vals;
        this.allKeys = keys;
        return this['all' + str];
      };

      PropMap.prototype.values = function() {
        return this.valuesOrKeys('Vals');
      };

      PropMap.prototype.keys = function() {
        return this.valuesOrKeys();
      };

      PropMap.prototype.push = function(obj, key) {
        if (key == null) {
          key = "key";
        }
        return this.put(obj[key], obj);
      };

      PropMap.prototype.slice = function() {
        return this.keys().map((function(_this) {
          return function(k) {
            return _this.remove(k);
          };
        })(this));
      };

      PropMap.prototype.removeAll = function() {
        return this.slice();
      };

      PropMap.prototype.each = function(cb) {
        return _.each(this.dict, function(v, k) {
          return cb(v);
        });
      };

      PropMap.prototype.map = function(cb) {
        return _.map(this.dict, function(v, k) {
          return cb(v);
        });
      };

      return PropMap;

    })();
  });

}).call(this);
;
/*globals angular,_ */

(function() {
  angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapPropertyAction", [
    "uiGmapLogger", function(Logger) {
      var PropertyAction;
      PropertyAction = function(setterFn) {
        this.setIfChange = function(callingKey) {
          return function(newVal, oldVal) {
            if (!_.isEqual(oldVal, newVal)) {
              return setterFn(callingKey, newVal);
            }
          };
        };
        this.sic = this.setIfChange;
        return this;
      };
      return PropertyAction;
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('uiGmapgoogle-maps.directives.api.managers').factory('uiGmapClustererMarkerManager', [
    'uiGmapLogger', 'uiGmapFitHelper', 'uiGmapPropMap', 'uiGmapEventsHelper', function($log, FitHelper, PropMap, EventsHelper) {
      var ClustererMarkerManager;
      ClustererMarkerManager = (function() {
        ClustererMarkerManager.type = 'ClustererMarkerManager';

        function ClustererMarkerManager(gMap, opt_markers, opt_options, opt_events) {
          if (opt_markers == null) {
            opt_markers = {};
          }
          this.opt_options = opt_options != null ? opt_options : {};
          this.opt_events = opt_events;
          this.checkSync = bind(this.checkSync, this);
          this.getGMarkers = bind(this.getGMarkers, this);
          this.fit = bind(this.fit, this);
          this.destroy = bind(this.destroy, this);
          this.attachEvents = bind(this.attachEvents, this);
          this.clear = bind(this.clear, this);
          this.draw = bind(this.draw, this);
          this.removeMany = bind(this.removeMany, this);
          this.remove = bind(this.remove, this);
          this.addMany = bind(this.addMany, this);
          this.update = bind(this.update, this);
          this.add = bind(this.add, this);
          this.type = ClustererMarkerManager.type;
          this.clusterer = new NgMapMarkerClusterer(gMap, opt_markers, this.opt_options);
          this.propMapGMarkers = new PropMap();
          this.attachEvents(this.opt_events, 'opt_events');
          this.clusterer.setIgnoreHidden(true);
          this.noDrawOnSingleAddRemoves = true;
          $log.info(this);
        }

        ClustererMarkerManager.prototype.checkKey = function(gMarker) {
          var msg;
          if (gMarker.key == null) {
            msg = 'gMarker.key undefined and it is REQUIRED!!';
            return $log.error(msg);
          }
        };

        ClustererMarkerManager.prototype.add = function(gMarker) {
          this.checkKey(gMarker);
          this.clusterer.addMarker(gMarker, this.noDrawOnSingleAddRemoves);
          this.propMapGMarkers.put(gMarker.key, gMarker);
          return this.checkSync();
        };

        ClustererMarkerManager.prototype.update = function(gMarker) {
          this.remove(gMarker);
          return this.add(gMarker);
        };

        ClustererMarkerManager.prototype.addMany = function(gMarkers) {
          return gMarkers.forEach((function(_this) {
            return function(gMarker) {
              return _this.add(gMarker);
            };
          })(this));
        };

        ClustererMarkerManager.prototype.remove = function(gMarker) {
          var exists;
          this.checkKey(gMarker);
          exists = this.propMapGMarkers.get(gMarker.key);
          if (exists) {
            this.clusterer.removeMarker(gMarker, this.noDrawOnSingleAddRemoves);
            this.propMapGMarkers.remove(gMarker.key);
          }
          return this.checkSync();
        };

        ClustererMarkerManager.prototype.removeMany = function(gMarkers) {
          return gMarkers.forEach((function(_this) {
            return function(gMarker) {
              return _this.remove(gMarker);
            };
          })(this));
        };

        ClustererMarkerManager.prototype.draw = function() {
          return this.clusterer.repaint();
        };

        ClustererMarkerManager.prototype.clear = function() {
          this.removeMany(this.getGMarkers());
          return this.clusterer.repaint();
        };

        ClustererMarkerManager.prototype.attachEvents = function(options, optionsName) {
          var eventHandler, eventName, results;
          this.listeners = [];
          if (angular.isDefined(options) && (options != null) && angular.isObject(options)) {
            results = [];
            for (eventName in options) {
              eventHandler = options[eventName];
              if (options.hasOwnProperty(eventName) && angular.isFunction(options[eventName])) {
                $log.info(optionsName + ": Attaching event: " + eventName + " to clusterer");
                results.push(this.listeners.push(google.maps.event.addListener(this.clusterer, eventName, options[eventName])));
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        };

        ClustererMarkerManager.prototype.clearEvents = function() {
          EventsHelper.removeEvents(this.listeners);
          return this.listeners = [];
        };

        ClustererMarkerManager.prototype.destroy = function() {
          this.clearEvents();
          return this.clear();
        };

        ClustererMarkerManager.prototype.fit = function() {
          return FitHelper.fit(this.getGMarkers(), this.clusterer.getMap());
        };

        ClustererMarkerManager.prototype.getGMarkers = function() {
          return this.clusterer.getMarkers().values();
        };

        ClustererMarkerManager.prototype.checkSync = function() {};

        return ClustererMarkerManager;

      })();
      return ClustererMarkerManager;
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.managers').service('uiGmapGoogleMapObjectManager', [
    function() {
      var _availableInstances, _usedInstances;
      _availableInstances = [];
      _usedInstances = [];
      return {
        createMapInstance: function(parentElement, options) {
          var instance;
          instance = null;
          if (_availableInstances.length === 0) {
            instance = new google.maps.Map(parentElement, options);
            _usedInstances.push(instance);
          } else {
            instance = _availableInstances.pop();
            angular.element(parentElement).append(instance.getDiv());
            instance.setOptions(options);
            _usedInstances.push(instance);
          }
          return instance;
        },
        recycleMapInstance: function(instance) {
          var index;
          index = _usedInstances.indexOf(instance);
          if (index < 0) {
            throw new Error('Expected map instance to be a previously used instance');
          }
          _usedInstances.splice(index, 1);
          return _availableInstances.push(instance);
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module("uiGmapgoogle-maps.directives.api.managers").factory("uiGmapMarkerManager", [
    "uiGmapLogger", "uiGmapFitHelper", "uiGmapPropMap", function(Logger, FitHelper, PropMap) {
      var MarkerManager;
      MarkerManager = (function() {
        MarkerManager.type = 'MarkerManager';

        function MarkerManager(gMap, opt_markers, opt_options) {
          this.getGMarkers = bind(this.getGMarkers, this);
          this.fit = bind(this.fit, this);
          this.handleOptDraw = bind(this.handleOptDraw, this);
          this.clear = bind(this.clear, this);
          this.destroy = bind(this.destroy, this);
          this.draw = bind(this.draw, this);
          this.removeMany = bind(this.removeMany, this);
          this.remove = bind(this.remove, this);
          this.addMany = bind(this.addMany, this);
          this.update = bind(this.update, this);
          this.add = bind(this.add, this);
          this.type = MarkerManager.type;
          this.gMap = gMap;
          this.gMarkers = new PropMap();
          this.$log = Logger;
          this.$log.info(this);
        }

        MarkerManager.prototype.add = function(gMarker, optDraw) {
          var exists, msg;
          if (optDraw == null) {
            optDraw = true;
          }
          if (gMarker.key == null) {
            msg = "gMarker.key undefined and it is REQUIRED!!";
            Logger.error(msg);
            throw msg;
          }
          exists = this.gMarkers.get(gMarker.key);
          if (!exists) {
            this.handleOptDraw(gMarker, optDraw, true);
            return this.gMarkers.put(gMarker.key, gMarker);
          }
        };

        MarkerManager.prototype.update = function(gMarker, optDraw) {
          if (optDraw == null) {
            optDraw = true;
          }
          this.remove(gMarker, optDraw);
          return this.add(gMarker, optDraw);
        };

        MarkerManager.prototype.addMany = function(gMarkers) {
          return gMarkers.forEach((function(_this) {
            return function(gMarker) {
              return _this.add(gMarker);
            };
          })(this));
        };

        MarkerManager.prototype.remove = function(gMarker, optDraw) {
          if (optDraw == null) {
            optDraw = true;
          }
          this.handleOptDraw(gMarker, optDraw, false);
          if (this.gMarkers.get(gMarker.key)) {
            return this.gMarkers.remove(gMarker.key);
          }
        };

        MarkerManager.prototype.removeMany = function(gMarkers) {
          return gMarkers.forEach((function(_this) {
            return function(marker) {
              return _this.remove(marker);
            };
          })(this));
        };

        MarkerManager.prototype.draw = function() {
          var deletes;
          deletes = [];
          this.gMarkers.each((function(_this) {
            return function(gMarker) {
              if (!gMarker.isDrawn) {
                if (gMarker.doAdd) {
                  gMarker.setMap(_this.gMap);
                  return gMarker.isDrawn = true;
                } else {
                  return deletes.push(gMarker);
                }
              }
            };
          })(this));
          return deletes.forEach((function(_this) {
            return function(gMarker) {
              gMarker.isDrawn = false;
              return _this.remove(gMarker, true);
            };
          })(this));
        };

        MarkerManager.prototype.destroy = function() {
          return this.clear();
        };

        MarkerManager.prototype.clear = function() {
          this.gMarkers.each(function(gMarker) {
            return gMarker.setMap(null);
          });
          delete this.gMarkers;
          return this.gMarkers = new PropMap();
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

        MarkerManager.prototype.fit = function() {
          return FitHelper.fit(this.getGMarkers(), this.gMap);
        };

        MarkerManager.prototype.getGMarkers = function() {
          return this.gMarkers.values();
        };

        return MarkerManager;

      })();
      return MarkerManager;
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('uiGmapgoogle-maps.directives.api.managers').factory('uiGmapSpiderfierMarkerManager', [
    'uiGmapLogger', 'uiGmapFitHelper', 'uiGmapPropMap', 'uiGmapMarkerSpiderfier', function($log, FitHelper, PropMap, MarkerSpiderfier) {
      var SpiderfierMarkerManager;
      return SpiderfierMarkerManager = (function() {
        SpiderfierMarkerManager.type = 'SpiderfierMarkerManager';

        function SpiderfierMarkerManager(gMap, opt_markers, opt_options, opt_events, scope) {
          if (opt_markers == null) {
            opt_markers = {};
          }
          this.opt_options = opt_options != null ? opt_options : {};
          this.opt_events = opt_events;
          this.scope = scope;
          this.checkSync = bind(this.checkSync, this);
          this.isSpiderfied = bind(this.isSpiderfied, this);
          this.getGMarkers = bind(this.getGMarkers, this);
          this.fit = bind(this.fit, this);
          this.destroy = bind(this.destroy, this);
          this.attachEvents = bind(this.attachEvents, this);
          this.clear = bind(this.clear, this);
          this.draw = bind(this.draw, this);
          this.removeMany = bind(this.removeMany, this);
          this.remove = bind(this.remove, this);
          this.addMany = bind(this.addMany, this);
          this.update = bind(this.update, this);
          this.add = bind(this.add, this);
          this.type = SpiderfierMarkerManager.type;
          this.markerSpiderfier = new MarkerSpiderfier(gMap, this.opt_options);
          this.propMapGMarkers = new PropMap();
          this.attachEvents(this.opt_events, 'opt_events');
          this.noDrawOnSingleAddRemoves = true;
          $log.info(this);
        }

        SpiderfierMarkerManager.prototype.checkKey = function(gMarker) {
          var msg;
          if (gMarker.key == null) {
            msg = 'gMarker.key undefined and it is REQUIRED!!';
            return $log.error(msg);
          }
        };

        SpiderfierMarkerManager.prototype.add = function(gMarker) {
          gMarker.setMap(this.markerSpiderfier.map);
          this.checkKey(gMarker);
          this.markerSpiderfier.addMarker(gMarker, this.noDrawOnSingleAddRemoves);
          this.propMapGMarkers.put(gMarker.key, gMarker);
          return this.checkSync();
        };

        SpiderfierMarkerManager.prototype.update = function(gMarker) {
          this.remove(gMarker);
          return this.add(gMarker);
        };

        SpiderfierMarkerManager.prototype.addMany = function(gMarkers) {
          return gMarkers.forEach((function(_this) {
            return function(gMarker) {
              return _this.add(gMarker);
            };
          })(this));
        };

        SpiderfierMarkerManager.prototype.remove = function(gMarker) {
          var exists;
          this.checkKey(gMarker);
          exists = this.propMapGMarkers.get(gMarker.key);
          if (exists) {
            gMarker.setMap(null);
            this.markerSpiderfier.removeMarker(gMarker, this.noDrawOnSingleAddRemoves);
            this.propMapGMarkers.remove(gMarker.key);
          }
          return this.checkSync();
        };

        SpiderfierMarkerManager.prototype.removeMany = function(gMarkers) {
          return gMarkers.forEach((function(_this) {
            return function(gMarker) {
              return _this.remove(gMarker);
            };
          })(this));
        };

        SpiderfierMarkerManager.prototype.draw = function() {};

        SpiderfierMarkerManager.prototype.clear = function() {
          return this.removeMany(this.getGMarkers());
        };

        SpiderfierMarkerManager.prototype.attachEvents = function(options, optionsName) {
          if (angular.isDefined(options) && (options != null) && angular.isObject(options)) {
            return _.each(options, (function(_this) {
              return function(eventHandler, eventName) {
                if (options.hasOwnProperty(eventName) && angular.isFunction(options[eventName])) {
                  $log.info(optionsName + ": Attaching event: " + eventName + " to markerSpiderfier");
                  return _this.markerSpiderfier.addListener(eventName, function() {
                    if (eventName === 'spiderfy' || eventName === 'unspiderfy') {
                      return _this.scope.$evalAsync(options[eventName].apply(options, arguments));
                    } else {
                      return _this.scope.$evalAsync(options[eventName].apply(options, [arguments[0], eventName, arguments[0].model, arguments]));
                    }
                  });
                }
              };
            })(this));
          }
        };

        SpiderfierMarkerManager.prototype.clearEvents = function(options, optionsName) {
          var eventHandler, eventName;
          if (angular.isDefined(options) && (options != null) && angular.isObject(options)) {
            for (eventName in options) {
              eventHandler = options[eventName];
              if (options.hasOwnProperty(eventName) && angular.isFunction(options[eventName])) {
                $log.info(optionsName + ": Clearing event: " + eventName + " to markerSpiderfier");
                this.markerSpiderfier.clearListeners(eventName);
              }
            }
          }
        };

        SpiderfierMarkerManager.prototype.destroy = function() {
          this.clearEvents(this.opt_events, 'opt_events');
          return this.clear();
        };

        SpiderfierMarkerManager.prototype.fit = function() {
          return FitHelper.fit(this.getGMarkers(), this.markerSpiderfier.map);
        };

        SpiderfierMarkerManager.prototype.getGMarkers = function() {
          return this.markerSpiderfier.getMarkers();
        };

        SpiderfierMarkerManager.prototype.isSpiderfied = function() {
          return _.find(this.getGMarkers(), function(gMarker) {
            return (gMarker != null ? gMarker._omsData : void 0) != null;
          });
        };

        SpiderfierMarkerManager.prototype.checkSync = function() {};

        return SpiderfierMarkerManager;

      })();
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps').factory('uiGmapadd-events', [
    '$timeout', function($timeout) {
      var addEvent, addEvents;
      addEvent = function(target, eventName, handler) {
        return google.maps.event.addListener(target, eventName, function() {
          handler.apply(this, arguments);
          return $timeout((function() {}), true);
        });
      };
      addEvents = function(target, eventName, handler) {
        var remove;
        if (handler) {
          return addEvent(target, eventName, handler);
        }
        remove = [];
        angular.forEach(eventName, function(_handler, key) {
          return remove.push(addEvent(target, key, _handler));
        });
        return function() {
          angular.forEach(remove, function(listener) {
            return google.maps.event.removeListener(listener);
          });
          return remove = null;
        };
      };
      return addEvents;
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps').factory('uiGmaparray-sync', [
    'uiGmapadd-events', function(mapEvents) {
      return function(mapArray, scope, pathEval, pathChangedFn) {
        var geojsonArray, geojsonHandlers, geojsonWatcher, isSetFromScope, legacyHandlers, legacyWatcher, mapArrayListener, scopePath, watchListener;
        isSetFromScope = false;
        scopePath = scope.$eval(pathEval);
        if (!scope["static"]) {
          legacyHandlers = {
            set_at: function(index) {
              var value;
              if (isSetFromScope) {
                return;
              }
              value = mapArray.getAt(index);
              if (!value) {
                return;
              }
              if (!value.lng || !value.lat) {
                return scopePath[index] = value;
              } else {
                scopePath[index].latitude = value.lat();
                return scopePath[index].longitude = value.lng();
              }
            },
            insert_at: function(index) {
              var value;
              if (isSetFromScope) {
                return;
              }
              value = mapArray.getAt(index);
              if (!value) {
                return;
              }
              if (!value.lng || !value.lat) {
                return scopePath.splice(index, 0, value);
              } else {
                return scopePath.splice(index, 0, {
                  latitude: value.lat(),
                  longitude: value.lng()
                });
              }
            },
            remove_at: function(index) {
              if (isSetFromScope) {
                return;
              }
              return scopePath.splice(index, 1);
            }
          };
          geojsonArray;
          if (scopePath.type === 'Polygon') {
            geojsonArray = scopePath.coordinates[0];
          } else if (scopePath.type === 'LineString') {
            geojsonArray = scopePath.coordinates;
          }
          geojsonHandlers = {
            set_at: function(index) {
              var value;
              if (isSetFromScope) {
                return;
              }
              value = mapArray.getAt(index);
              if (!(value && value.lng && value.lat)) {
                return;
              }
              geojsonArray[index][1] = value.lat();
              return geojsonArray[index][0] = value.lng();
            },
            insert_at: function(index) {
              var value;
              if (isSetFromScope) {
                return;
              }
              value = mapArray.getAt(index);
              if (!value) {
                return;
              }
              if (!value.lng || !value.lat) {
                return;
              }
              return geojsonArray.splice(index, 0, [value.lng(), value.lat()]);
            },
            remove_at: function(index) {
              if (isSetFromScope) {
                return;
              }
              return geojsonArray.splice(index, 1);
            }
          };
          mapArrayListener = mapEvents(mapArray, angular.isUndefined(scopePath.type) ? legacyHandlers : geojsonHandlers);
        }
        legacyWatcher = function(newPath) {
          var changed, i, l, newLength, newValue, oldArray, oldLength, oldValue;
          isSetFromScope = true;
          oldArray = mapArray;
          changed = false;
          if (newPath) {
            i = 0;
            oldLength = oldArray.getLength();
            newLength = newPath.length;
            l = Math.min(oldLength, newLength);
            newValue = void 0;
            while (i < l) {
              oldValue = oldArray.getAt(i);
              newValue = newPath[i];
              if (typeof newValue.equals === 'function') {
                if (!newValue.equals(oldValue)) {
                  oldArray.setAt(i, newValue);
                  changed = true;
                }
              } else {
                if ((oldValue.lat() !== newValue.latitude) || (oldValue.lng() !== newValue.longitude)) {
                  oldArray.setAt(i, new google.maps.LatLng(newValue.latitude, newValue.longitude));
                  changed = true;
                }
              }
              i++;
            }
            while (i < newLength) {
              newValue = newPath[i];
              if (typeof newValue.lat === 'function' && typeof newValue.lng === 'function') {
                oldArray.push(newValue);
              } else {
                oldArray.push(new google.maps.LatLng(newValue.latitude, newValue.longitude));
              }
              changed = true;
              i++;
            }
            while (i < oldLength) {
              oldArray.pop();
              changed = true;
              i++;
            }
          }
          isSetFromScope = false;
          if (changed) {
            return pathChangedFn(oldArray);
          }
        };
        geojsonWatcher = function(newPath) {
          var array, changed, i, l, newLength, newValue, oldArray, oldLength, oldValue;
          isSetFromScope = true;
          oldArray = mapArray;
          changed = false;
          if (newPath) {
            array;
            if (scopePath.type === 'Polygon') {
              array = newPath.coordinates[0];
            } else if (scopePath.type === 'LineString') {
              array = newPath.coordinates;
            }
            i = 0;
            oldLength = oldArray.getLength();
            newLength = array.length;
            l = Math.min(oldLength, newLength);
            newValue = void 0;
            while (i < l) {
              oldValue = oldArray.getAt(i);
              newValue = array[i];
              if ((oldValue.lat() !== newValue[1]) || (oldValue.lng() !== newValue[0])) {
                oldArray.setAt(i, new google.maps.LatLng(newValue[1], newValue[0]));
                changed = true;
              }
              i++;
            }
            while (i < newLength) {
              newValue = array[i];
              oldArray.push(new google.maps.LatLng(newValue[1], newValue[0]));
              changed = true;
              i++;
            }
            while (i < oldLength) {
              oldArray.pop();
              changed = true;
              i++;
            }
          }
          isSetFromScope = false;
          if (changed) {
            return pathChangedFn(oldArray);
          }
        };
        watchListener;
        if (!scope["static"]) {
          if (angular.isUndefined(scopePath.type)) {
            watchListener = scope.$watchCollection(pathEval, legacyWatcher);
          } else {
            watchListener = scope.$watch(pathEval, geojsonWatcher, true);
          }
        }
        return function() {
          if (mapArrayListener) {
            mapArrayListener();
            mapArrayListener = null;
          }
          if (watchListener) {
            watchListener();
            return watchListener = null;
          }
        };
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapChromeFixes", [
    '$timeout', function($timeout) {
      return {
        maybeRepaint: function(el) {
          if (el) {
            el.style.opacity = 0.9;
            return $timeout(function() {
              return el.style.opacity = 1;
            });
          }
        }
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps').service('uiGmapObjectIterators', function() {
    var _ignores, _iterators, _slapForEach, _slapMap;
    _ignores = ['length', 'forEach', 'map'];
    _iterators = [];
    _slapForEach = function(object) {
      object.forEach = function(cb) {
        return _.each(_.omit(object, _ignores), function(val) {
          if (!_.isFunction(val)) {
            return cb(val);
          }
        });
      };
      return object;
    };
    _iterators.push(_slapForEach);
    _slapMap = function(object) {
      object.map = function(cb) {
        return _.map(_.omit(object, _ignores), function(val) {
          if (!_.isFunction(val)) {
            return cb(val);
          }
        });
      };
      return object;
    };
    _iterators.push(_slapMap);
    return {
      slapMap: _slapMap,
      slapForEach: _slapForEach,
      slapAll: function(object) {
        _iterators.forEach(function(it) {
          return it(object);
        });
        return object;
      }
    };
  });

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.options.builders').service('uiGmapCommonOptionsBuilder', [
    'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapModelKey', function(BaseObject, $log, ModelKey) {
      var CommonOptionsBuilder;
      return CommonOptionsBuilder = (function(superClass) {
        extend(CommonOptionsBuilder, superClass);

        function CommonOptionsBuilder() {
          this.watchProps = bind(this.watchProps, this);
          this.buildOpts = bind(this.buildOpts, this);
          return CommonOptionsBuilder.__super__.constructor.apply(this, arguments);
        }

        CommonOptionsBuilder.prototype.props = [
          'clickable', 'draggable', 'editable', 'visible', {
            prop: 'stroke',
            isColl: true
          }
        ];

        CommonOptionsBuilder.prototype.getCorrectModel = function(scope) {
          if (angular.isDefined(scope != null ? scope.model : void 0)) {
            return scope.model;
          } else {
            return scope;
          }
        };

        CommonOptionsBuilder.prototype.buildOpts = function(customOpts, cachedEval, forEachOpts) {
          var model, opts, stroke;
          if (customOpts == null) {
            customOpts = {};
          }
          if (forEachOpts == null) {
            forEachOpts = {};
          }
          if (!this.scope) {
            $log.error('this.scope not defined in CommonOptionsBuilder can not buildOpts');
            return;
          }
          if (!this.gMap) {
            $log.error('this.map not defined in CommonOptionsBuilder can not buildOpts');
            return;
          }
          model = this.getCorrectModel(this.scope);
          stroke = this.scopeOrModelVal('stroke', this.scope, model);
          opts = angular.extend(customOpts, this.DEFAULTS, {
            map: this.gMap,
            strokeColor: stroke != null ? stroke.color : void 0,
            strokeOpacity: stroke != null ? stroke.opacity : void 0,
            strokeWeight: stroke != null ? stroke.weight : void 0
          });
          angular.forEach(angular.extend(forEachOpts, {
            clickable: true,
            draggable: false,
            editable: false,
            "static": false,
            fit: false,
            visible: true,
            zIndex: 0,
            icons: []
          }), (function(_this) {
            return function(defaultValue, key) {
              var val;
              val = cachedEval ? cachedEval[key] : _this.scopeOrModelVal(key, _this.scope, model);
              if (angular.isUndefined(val)) {
                return opts[key] = defaultValue;
              } else {
                return opts[key] = model[key];
              }
            };
          })(this));
          if (opts["static"]) {
            opts.editable = false;
          }
          return opts;
        };

        CommonOptionsBuilder.prototype.watchProps = function(props) {
          if (props == null) {
            props = this.props;
          }
          return props.forEach((function(_this) {
            return function(prop) {
              if ((_this.attrs[prop] != null) || (_this.attrs[prop != null ? prop.prop : void 0] != null)) {
                if (prop != null ? prop.isColl : void 0) {
                  return _this.scope.$watchCollection(prop.prop, _this.setMyOptions);
                } else {
                  return _this.scope.$watch(prop, _this.setMyOptions);
                }
              }
            };
          })(this));
        };

        return CommonOptionsBuilder;

      })(ModelKey);
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.options.builders').factory('uiGmapPolylineOptionsBuilder', [
    'uiGmapCommonOptionsBuilder', function(CommonOptionsBuilder) {
      var PolylineOptionsBuilder;
      return PolylineOptionsBuilder = (function(superClass) {
        extend(PolylineOptionsBuilder, superClass);

        function PolylineOptionsBuilder() {
          return PolylineOptionsBuilder.__super__.constructor.apply(this, arguments);
        }

        PolylineOptionsBuilder.prototype.buildOpts = function(pathPoints, cachedEval) {
          return PolylineOptionsBuilder.__super__.buildOpts.call(this, {
            path: pathPoints
          }, cachedEval, {
            geodesic: false
          });
        };

        return PolylineOptionsBuilder;

      })(CommonOptionsBuilder);
    }
  ]).factory('uiGmapShapeOptionsBuilder', [
    'uiGmapCommonOptionsBuilder', function(CommonOptionsBuilder) {
      var ShapeOptionsBuilder;
      return ShapeOptionsBuilder = (function(superClass) {
        extend(ShapeOptionsBuilder, superClass);

        function ShapeOptionsBuilder() {
          return ShapeOptionsBuilder.__super__.constructor.apply(this, arguments);
        }

        ShapeOptionsBuilder.prototype.buildOpts = function(customOpts, cachedEval, forEachOpts) {
          var fill, model;
          model = this.getCorrectModel(this.scope);
          fill = cachedEval ? cachedEval['fill'] : this.scopeOrModelVal('fill', this.scope, model);
          customOpts = angular.extend(customOpts, {
            fillColor: fill != null ? fill.color : void 0,
            fillOpacity: fill != null ? fill.opacity : void 0
          });
          return ShapeOptionsBuilder.__super__.buildOpts.call(this, customOpts, cachedEval, forEachOpts);
        };

        return ShapeOptionsBuilder;

      })(CommonOptionsBuilder);
    }
  ]).factory('uiGmapPolygonOptionsBuilder', [
    'uiGmapShapeOptionsBuilder', function(ShapeOptionsBuilder) {
      var PolygonOptionsBuilder;
      return PolygonOptionsBuilder = (function(superClass) {
        extend(PolygonOptionsBuilder, superClass);

        function PolygonOptionsBuilder() {
          return PolygonOptionsBuilder.__super__.constructor.apply(this, arguments);
        }

        PolygonOptionsBuilder.prototype.buildOpts = function(pathPoints, cachedEval) {
          return PolygonOptionsBuilder.__super__.buildOpts.call(this, {
            path: pathPoints
          }, cachedEval, {
            geodesic: false
          });
        };

        return PolygonOptionsBuilder;

      })(ShapeOptionsBuilder);
    }
  ]).factory('uiGmapRectangleOptionsBuilder', [
    'uiGmapShapeOptionsBuilder', function(ShapeOptionsBuilder) {
      var RectangleOptionsBuilder;
      return RectangleOptionsBuilder = (function(superClass) {
        extend(RectangleOptionsBuilder, superClass);

        function RectangleOptionsBuilder() {
          return RectangleOptionsBuilder.__super__.constructor.apply(this, arguments);
        }

        RectangleOptionsBuilder.prototype.buildOpts = function(bounds, cachedEval) {
          return RectangleOptionsBuilder.__super__.buildOpts.call(this, {
            bounds: bounds
          }, cachedEval);
        };

        return RectangleOptionsBuilder;

      })(ShapeOptionsBuilder);
    }
  ]).factory('uiGmapCircleOptionsBuilder', [
    'uiGmapShapeOptionsBuilder', function(ShapeOptionsBuilder) {
      var CircleOptionsBuilder;
      return CircleOptionsBuilder = (function(superClass) {
        extend(CircleOptionsBuilder, superClass);

        function CircleOptionsBuilder() {
          return CircleOptionsBuilder.__super__.constructor.apply(this, arguments);
        }

        CircleOptionsBuilder.prototype.buildOpts = function(center, radius, cachedEval) {
          return CircleOptionsBuilder.__super__.buildOpts.call(this, {
            center: center,
            radius: radius
          }, cachedEval);
        };

        return CircleOptionsBuilder;

      })(ShapeOptionsBuilder);
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api.options').service('uiGmapMarkerOptions', [
    'uiGmapLogger', 'uiGmapGmapUtil', function($log, GmapUtil) {
      return _.extend(GmapUtil, {
        createOptions: function(coords, icon, defaults, map) {
          var opts;
          if (defaults == null) {
            defaults = {};
          }
          opts = angular.extend({}, defaults, {
            position: defaults.position != null ? defaults.position : GmapUtil.getCoords(coords),
            visible: defaults.visible != null ? defaults.visible : GmapUtil.validateCoords(coords)
          });
          if ((defaults.icon != null) || (icon != null)) {
            opts = angular.extend(opts, {
              icon: defaults.icon != null ? defaults.icon : icon
            });
          }
          if (map != null) {
            opts.map = map;
          }
          return opts;
        },
        isLabel: function(options) {
          if (options == null) {
            return false;
          }
          return (options.labelContent != null) || (options.labelAnchor != null) || (options.labelClass != null) || (options.labelStyle != null) || (options.labelVisible != null);
        }
      });
    }
  ]);

}).call(this);
;
/*global _,angular */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapBasePolyChildModel', [
    'uiGmapLogger', '$timeout', 'uiGmaparray-sync', 'uiGmapGmapUtil', 'uiGmapEventsHelper', function($log, $timeout, arraySync, GmapUtil, EventsHelper) {
      return function(Builder, gFactory) {
        var BasePolyChildModel;
        return BasePolyChildModel = (function(superClass) {
          extend(BasePolyChildModel, superClass);

          BasePolyChildModel.include(GmapUtil);

          function BasePolyChildModel(arg) {
            var create, gObjectChangeCb, ref;
            this.scope = arg.scope, this.attrs = arg.attrs, this.gMap = arg.gMap, this.defaults = arg.defaults, this.model = arg.model, gObjectChangeCb = arg.gObjectChangeCb, this.isScopeModel = (ref = arg.isScopeModel) != null ? ref : false;
            this.clean = bind(this.clean, this);
            if (this.isScopeModel) {
              this.clonedModel = _.clone(this.model, true);
            }
            this.isDragging = false;
            this.internalEvents = {
              dragend: (function(_this) {
                return function() {
                  return _.defer(function() {
                    return _this.isDragging = false;
                  });
                };
              })(this),
              dragstart: (function(_this) {
                return function() {
                  return _this.isDragging = true;
                };
              })(this)
            };
            create = (function(_this) {
              return function() {
                var maybeCachedEval;
                if (_this.isDragging) {
                  return;
                }
                _this.pathPoints = _this.convertPathPoints(_this.scope.path);
                if (_this.gObject != null) {
                  _this.clean();
                }
                if (_this.scope.model != null) {
                  maybeCachedEval = _this.scope;
                }
                if (_this.pathPoints.length > 0) {
                  _this.gObject = gFactory(_this.buildOpts(_this.pathPoints, maybeCachedEval));
                }
                if (_this.gObject) {
                  arraySync(_this.gObject.getPath(), _this.scope, 'path', function(pathPoints) {
                    _this.pathPoints = pathPoints;
                    if (gObjectChangeCb != null) {
                      return gObjectChangeCb();
                    }
                  });
                  if (angular.isDefined(_this.scope.events) && angular.isObject(_this.scope.events)) {
                    _this.listeners = _this.model ? EventsHelper.setEvents(_this.gObject, _this.scope, _this.model) : EventsHelper.setEvents(_this.gObject, _this.scope, _this.scope);
                  }
                  return _this.internalListeners = _this.model ? EventsHelper.setEvents(_this.gObject, {
                    events: _this.internalEvents
                  }, _this.model) : EventsHelper.setEvents(_this.gObject, {
                    events: _this.internalEvents
                  }, _this.scope);
                }
              };
            })(this);
            create();
            this.scope.$watch('path', (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue) || !_this.gObject) {
                  return create();
                }
              };
            })(this), true);
            if (!this.scope["static"] && angular.isDefined(this.scope.editable)) {
              this.scope.$watch('editable', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    newValue = !_this.isFalse(newValue);
                    return (ref1 = _this.gObject) != null ? ref1.setEditable(newValue) : void 0;
                  }
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.draggable)) {
              this.scope.$watch('draggable', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    newValue = !_this.isFalse(newValue);
                    return (ref1 = _this.gObject) != null ? ref1.setDraggable(newValue) : void 0;
                  }
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.visible)) {
              this.scope.$watch('visible', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    newValue = !_this.isFalse(newValue);
                  }
                  return (ref1 = _this.gObject) != null ? ref1.setVisible(newValue) : void 0;
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.geodesic)) {
              this.scope.$watch('geodesic', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    newValue = !_this.isFalse(newValue);
                    return (ref1 = _this.gObject) != null ? ref1.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                  }
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.stroke) && angular.isDefined(this.scope.stroke.weight)) {
              this.scope.$watch('stroke.weight', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    return (ref1 = _this.gObject) != null ? ref1.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                  }
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.stroke) && angular.isDefined(this.scope.stroke.color)) {
              this.scope.$watch('stroke.color', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    return (ref1 = _this.gObject) != null ? ref1.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                  }
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.stroke) && angular.isDefined(this.scope.stroke.opacity)) {
              this.scope.$watch('stroke.opacity', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    return (ref1 = _this.gObject) != null ? ref1.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                  }
                };
              })(this), true);
            }
            if (angular.isDefined(this.scope.icons)) {
              this.scope.$watch('icons', (function(_this) {
                return function(newValue, oldValue) {
                  var ref1;
                  if (newValue !== oldValue) {
                    return (ref1 = _this.gObject) != null ? ref1.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                  }
                };
              })(this), true);
            }
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                _this.clean();
                return _this.scope = null;
              };
            })(this));
            if (angular.isDefined(this.scope.fill) && angular.isDefined(this.scope.fill.color)) {
              this.scope.$watch('fill.color', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    return _this.gObject.setOptions(_this.buildOpts(_this.gObject.getPath()));
                  }
                };
              })(this));
            }
            if (angular.isDefined(this.scope.fill) && angular.isDefined(this.scope.fill.opacity)) {
              this.scope.$watch('fill.opacity', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    return _this.gObject.setOptions(_this.buildOpts(_this.gObject.getPath()));
                  }
                };
              })(this));
            }
            if (angular.isDefined(this.scope.zIndex)) {
              this.scope.$watch('zIndex', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    return _this.gObject.setOptions(_this.buildOpts(_this.gObject.getPath()));
                  }
                };
              })(this));
            }
          }

          BasePolyChildModel.prototype.clean = function() {
            var ref;
            EventsHelper.removeEvents(this.listeners);
            EventsHelper.removeEvents(this.internalListeners);
            if ((ref = this.gObject) != null) {
              ref.setMap(null);
            }
            return this.gObject = null;
          };

          return BasePolyChildModel;

        })(Builder);
      };
    }
  ]);

}).call(this);
;
/*
@authors
Nicholas McCready - https://twitter.com/nmccready
Original idea from: http://stackoverflow.com/questions/22758950/google-map-drawing-freehand  , &
  http://jsfiddle.net/YsQdh/88/
 */

(function() {
  angular.module('uiGmapgoogle-maps.directives.api.models.child').factory('uiGmapDrawFreeHandChildModel', [
    'uiGmapLogger', '$q', function($log, $q) {
      var drawFreeHand, freeHandMgr;
      drawFreeHand = function(map, polys, done) {
        var move, poly;
        poly = new google.maps.Polyline({
          map: map,
          clickable: false
        });
        move = google.maps.event.addListener(map, 'mousemove', function(e) {
          return poly.getPath().push(e.latLng);
        });
        google.maps.event.addListenerOnce(map, 'mouseup', function(e) {
          var path;
          google.maps.event.removeListener(move);
          path = poly.getPath();
          poly.setMap(null);
          polys.push(new google.maps.Polygon({
            map: map,
            path: path
          }));
          poly = null;
          google.maps.event.clearListeners(map.getDiv(), 'mousedown');
          return done();
        });
        return void 0;
      };
      freeHandMgr = function(map1, scope) {
        var disableMap, enableMap;
        this.map = map1;
        disableMap = (function(_this) {
          return function() {
            var mapOptions;
            mapOptions = {
              draggable: false,
              disableDefaultUI: true,
              scrollwheel: false,
              disableDoubleClickZoom: false
            };
            $log.info('disabling map move');
            return _this.map.setOptions(mapOptions);
          };
        })(this);
        enableMap = (function(_this) {
          return function() {
            var mapOptions, ref;
            mapOptions = {
              draggable: true,
              disableDefaultUI: false,
              scrollwheel: true,
              disableDoubleClickZoom: true
            };
            if ((ref = _this.deferred) != null) {
              ref.resolve();
            }
            return _.defer(function() {
              return _this.map.setOptions(_.extend(mapOptions, scope.options));
            });
          };
        })(this);
        this.engage = (function(_this) {
          return function(polys1) {
            _this.polys = polys1;
            _this.deferred = $q.defer();
            disableMap();
            $log.info('DrawFreeHandChildModel is engaged (drawing).');
            google.maps.event.addDomListener(_this.map.getDiv(), 'mousedown', function(e) {
              return drawFreeHand(_this.map, _this.polys, enableMap);
            });
            return _this.deferred.promise;
          };
        })(this);
        return this;
      };
      return freeHandMgr;
    }
  ]);

}).call(this);
;
/*global _:true,angular:true,google:true, RichMarker:true */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.child').factory('uiGmapMarkerChildModel', [
    'uiGmapModelKey', 'uiGmapGmapUtil', 'uiGmapLogger', 'uiGmapEventsHelper', 'uiGmapPropertyAction', 'uiGmapMarkerOptions', 'uiGmapIMarker', 'uiGmapMarkerManager', 'uiGmapPromise', function(ModelKey, GmapUtil, $log, EventsHelper, PropertyAction, MarkerOptions, IMarker, MarkerManager, uiGmapPromise) {
      var MarkerChildModel;
      MarkerChildModel = (function(superClass) {
        var destroy;

        extend(MarkerChildModel, superClass);

        MarkerChildModel.include(GmapUtil);

        MarkerChildModel.include(EventsHelper);

        MarkerChildModel.include(MarkerOptions);

        destroy = function(child) {
          if ((child != null ? child.gObject : void 0) != null) {
            child.removeEvents(child.externalListeners);
            child.removeEvents(child.internalListeners);
            if (child != null ? child.gObject : void 0) {
              if (child.removeFromManager) {
                child.gManager.remove(child.gObject);
              }
              child.gObject.setMap(null);
              return child.gObject = null;
            }
          }
        };

        function MarkerChildModel(opts) {
          this.internalEvents = bind(this.internalEvents, this);
          this.setLabelOptions = bind(this.setLabelOptions, this);
          this.setOptions = bind(this.setOptions, this);
          this.setIcon = bind(this.setIcon, this);
          this.setCoords = bind(this.setCoords, this);
          this.isNotValid = bind(this.isNotValid, this);
          this.maybeSetScopeValue = bind(this.maybeSetScopeValue, this);
          this.createMarker = bind(this.createMarker, this);
          this.setMyScope = bind(this.setMyScope, this);
          this.updateModel = bind(this.updateModel, this);
          this.handleModelChanges = bind(this.handleModelChanges, this);
          this.destroy = bind(this.destroy, this);
          var action, ref, ref1, ref2, ref3, ref4, scope;
          scope = opts.scope, this.model = opts.model, this.keys = opts.keys, this.gMap = opts.gMap, this.defaults = (ref = opts.defaults) != null ? ref : {}, this.doClick = opts.doClick, this.gManager = opts.gManager, this.doDrawSelf = (ref1 = opts.doDrawSelf) != null ? ref1 : true, this.trackModel = (ref2 = opts.trackModel) != null ? ref2 : true, this.needRedraw = (ref3 = opts.needRedraw) != null ? ref3 : false, this.isScopeModel = (ref4 = opts.isScopeModel) != null ? ref4 : false;
          if (this.isScopeModel) {
            this.clonedModel = _.clone(this.model, true);
          }
          this.deferred = uiGmapPromise.defer();
          _.each(this.keys, (function(_this) {
            return function(v, k) {
              var keyValue;
              keyValue = _this.keys[k];
              if ((keyValue != null) && !_.isFunction(keyValue) && _.isString(keyValue)) {
                return _this[k + 'Key'] = keyValue;
              }
            };
          })(this));
          this.idKey = this.idKeyKey || 'id';
          if (this.model[this.idKey] != null) {
            this.id = this.model[this.idKey];
          }
          MarkerChildModel.__super__.constructor.call(this, scope);
          this.scope.getGMarker = (function(_this) {
            return function() {
              return _this.gObject;
            };
          })(this);
          this.firstTime = true;
          if (this.trackModel) {
            this.scope.model = this.model;
            this.scope.$watch('model', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  return _this.handleModelChanges(newValue, oldValue);
                }
              };
            })(this), true);
          } else {
            action = new PropertyAction((function(_this) {
              return function(calledKey) {
                if (_.isFunction(calledKey)) {
                  calledKey = 'all';
                }
                if (!_this.firstTime) {
                  return _this.setMyScope(calledKey, scope);
                }
              };
            })(this), false);
            _.each(this.keys, function(v, k) {
              return scope.$watch(k, action.sic(k), true);
            });
          }
          this.scope.$on('$destroy', (function(_this) {
            return function() {
              return destroy(_this);
            };
          })(this));
          this.createMarker(this.model);
          $log.info(this);
        }

        MarkerChildModel.prototype.destroy = function(removeFromManager) {
          if (removeFromManager == null) {
            removeFromManager = true;
          }
          this.removeFromManager = removeFromManager;
          return this.scope.$destroy();
        };

        MarkerChildModel.prototype.handleModelChanges = function(newValue, oldValue) {
          var changes, ctr, len;
          changes = this.getChanges(newValue, oldValue, IMarker.keys);
          if (!this.firstTime) {
            ctr = 0;
            len = _.keys(changes).length;
            return _.each(changes, (function(_this) {
              return function(v, k) {
                var doDraw;
                ctr += 1;
                doDraw = len === ctr;
                _this.setMyScope(k, newValue, oldValue, false, true, doDraw);
                return _this.needRedraw = true;
              };
            })(this));
          }
        };

        MarkerChildModel.prototype.updateModel = function(model) {
          if (this.isScopeModel) {
            this.clonedModel = _.clone(model, true);
          }
          return this.setMyScope('all', model, this.model);
        };

        MarkerChildModel.prototype.renderGMarker = function(doDraw, validCb) {
          var coords, isSpiderfied, ref;
          if (doDraw == null) {
            doDraw = true;
          }
          coords = this.getProp('coords', this.scope, this.model);
          if (((ref = this.gManager) != null ? ref.isSpiderfied : void 0) != null) {
            isSpiderfied = this.gManager.isSpiderfied();
          }
          if (coords != null) {
            if (!this.validateCoords(coords)) {
              $log.debug('MarkerChild does not have coords yet. They may be defined later.');
              return;
            }
            if (validCb != null) {
              validCb();
            }
            if (doDraw && this.gObject) {
              this.gManager.add(this.gObject);
            }
            if (isSpiderfied) {
              return this.gManager.markerSpiderfier.spiderListener(this.gObject, window.event);
            }
          } else {
            if (doDraw && this.gObject) {
              return this.gManager.remove(this.gObject);
            }
          }
        };

        MarkerChildModel.prototype.setMyScope = function(thingThatChanged, model, oldModel, isInit, doDraw) {
          var justCreated;
          if (oldModel == null) {
            oldModel = void 0;
          }
          if (isInit == null) {
            isInit = false;
          }
          if (doDraw == null) {
            doDraw = true;
          }
          if (model == null) {
            model = this.model;
          } else {
            this.model = model;
          }
          if (!this.gObject) {
            this.setOptions(this.scope, doDraw);
            justCreated = true;
          }
          switch (thingThatChanged) {
            case 'all':
              return _.each(this.keys, (function(_this) {
                return function(v, k) {
                  return _this.setMyScope(k, model, oldModel, isInit, doDraw);
                };
              })(this));
            case 'icon':
              return this.maybeSetScopeValue({
                gSetter: this.setIcon,
                doDraw: doDraw
              });
            case 'coords':
              return this.maybeSetScopeValue({
                gSetter: this.setCoords,
                doDraw: doDraw
              });
            case 'options':
              if (!justCreated) {
                return this.createMarker(model, oldModel, isInit, doDraw);
              }
          }
        };

        MarkerChildModel.prototype.createMarker = function(model, oldModel, isInit, doDraw) {
          if (oldModel == null) {
            oldModel = void 0;
          }
          if (isInit == null) {
            isInit = false;
          }
          if (doDraw == null) {
            doDraw = true;
          }
          this.maybeSetScopeValue({
            gSetter: this.setOptions,
            doDraw: doDraw
          });
          return this.firstTime = false;
        };

        MarkerChildModel.prototype.maybeSetScopeValue = function(arg) {
          var doDraw, gSetter, ref;
          gSetter = arg.gSetter, doDraw = (ref = arg.doDraw) != null ? ref : true;
          if (gSetter != null) {
            gSetter(this.scope, doDraw);
          }
          if (this.doDrawSelf && doDraw) {
            return this.gManager.draw();
          }
        };

        MarkerChildModel.prototype.isNotValid = function(scope, doCheckGmarker) {
          var hasIdenticalScopes, hasNoGmarker;
          if (doCheckGmarker == null) {
            doCheckGmarker = true;
          }
          hasNoGmarker = !doCheckGmarker ? false : this.gObject === void 0;
          hasIdenticalScopes = !this.trackModel ? scope.$id !== this.scope.$id : false;
          return hasIdenticalScopes || hasNoGmarker;
        };

        MarkerChildModel.prototype.setCoords = function(scope, doDraw) {
          if (doDraw == null) {
            doDraw = true;
          }
          if (this.isNotValid(scope) || (this.gObject == null)) {
            return;
          }
          return this.renderGMarker(doDraw, (function(_this) {
            return function() {
              var newGValue, newModelVal, oldGValue;
              newModelVal = _this.getProp('coords', scope, _this.model);
              newGValue = _this.getCoords(newModelVal);
              oldGValue = _this.gObject.getPosition();
              if ((oldGValue != null) && (newGValue != null)) {
                if (newGValue.lng() === oldGValue.lng() && newGValue.lat() === oldGValue.lat()) {
                  return;
                }
              }
              _this.gObject.setPosition(newGValue);
              return _this.gObject.setVisible(_this.validateCoords(newModelVal));
            };
          })(this));
        };

        MarkerChildModel.prototype.setIcon = function(scope, doDraw) {
          if (doDraw == null) {
            doDraw = true;
          }
          if (this.isNotValid(scope) || (this.gObject == null)) {
            return;
          }
          return this.renderGMarker(doDraw, (function(_this) {
            return function() {
              var coords, newValue, oldValue;
              oldValue = _this.gObject.getIcon();
              newValue = _this.getProp('icon', scope, _this.model);
              if (oldValue === newValue) {
                return;
              }
              _this.gObject.setIcon(newValue);
              coords = _this.getProp('coords', scope, _this.model);
              _this.gObject.setPosition(_this.getCoords(coords));
              return _this.gObject.setVisible(_this.validateCoords(coords));
            };
          })(this));
        };

        MarkerChildModel.prototype.setOptions = function(scope, doDraw) {
          var ref;
          if (doDraw == null) {
            doDraw = true;
          }
          if (this.isNotValid(scope, false)) {
            return;
          }
          this.renderGMarker(doDraw, (function(_this) {
            return function() {
              var _options, coords, icon;
              coords = _this.getProp('coords', scope, _this.model);
              icon = _this.getProp('icon', scope, _this.model);
              _options = _this.getProp('options', scope, _this.model);
              _this.opts = _this.createOptions(coords, icon, _options);
              if (_this.isLabel(_this.gObject) !== _this.isLabel(_this.opts) && (_this.gObject != null)) {
                _this.gManager.remove(_this.gObject);
                _this.gObject = void 0;
              }
              if (_this.gObject != null) {
                _this.gObject.setOptions(_this.setLabelOptions(_this.opts));
              }
              if (!_this.gObject) {
                if (_this.isLabel(_this.opts)) {
                  _this.gObject = new MarkerWithLabel(_this.setLabelOptions(_this.opts));
                } else if (_this.opts.content) {
                  _this.gObject = new RichMarker(_this.opts);
                  _this.gObject.getIcon = _this.gObject.getContent;
                  _this.gObject.setIcon = _this.gObject.setContent;
                } else {
                  _this.gObject = new google.maps.Marker(_this.opts);
                }
                _.extend(_this.gObject, {
                  model: _this.model
                });
              }
              if (_this.externalListeners) {
                _this.removeEvents(_this.externalListeners);
              }
              if (_this.internalListeners) {
                _this.removeEvents(_this.internalListeners);
              }
              _this.externalListeners = _this.setEvents(_this.gObject, _this.scope, _this.model, ['dragend']);
              _this.internalListeners = _this.setEvents(_this.gObject, {
                events: _this.internalEvents(),
                $evalAsync: function() {}
              }, _this.model);
              if (_this.id != null) {
                return _this.gObject.key = _this.id;
              }
            };
          })(this));
          if (this.gObject && (this.gObject.getMap() || this.gManager.type !== MarkerManager.type)) {
            this.deferred.resolve(this.gObject);
          } else {
            if (!this.gObject) {
              return this.deferred.reject('gObject is null');
            }
            if (!(((ref = this.gObject) != null ? ref.getMap() : void 0) && this.gManager.type === MarkerManager.type)) {
              $log.debug('gObject has no map yet');
              this.deferred.resolve(this.gObject);
            }
          }
          if (this.model[this.fitKey]) {
            return this.gManager.fit();
          }
        };

        MarkerChildModel.prototype.setLabelOptions = function(opts) {
          if (opts.labelAnchor) {
            opts.labelAnchor = this.getLabelPositionPoint(opts.labelAnchor);
          }
          return opts;
        };

        MarkerChildModel.prototype.internalEvents = function() {
          return {
            dragend: (function(_this) {
              return function(marker, eventName, model, mousearg) {
                var events, modelToSet, newCoords;
                modelToSet = _this.trackModel ? _this.scope.model : _this.model;
                newCoords = _this.setCoordsFromEvent(_this.modelOrKey(modelToSet, _this.coordsKey), _this.gObject.getPosition());
                modelToSet = _this.setVal(model, _this.coordsKey, newCoords);
                events = _this.scope.events;
                if ((events != null ? events.dragend : void 0) != null) {
                  events.dragend(marker, eventName, modelToSet, mousearg);
                }
                return _this.scope.$apply();
              };
            })(this),
            click: (function(_this) {
              return function(marker, eventName, model, mousearg) {
                var click;
                click = _this.getProp('click', _this.scope, _this.model);
                if (_this.doClick && angular.isFunction(click)) {
                  return _this.scope.$evalAsync(click(marker, eventName, _this.model, mousearg));
                }
              };
            })(this)
          };
        };

        return MarkerChildModel;

      })(ModelKey);
      return MarkerChildModel;
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolygonChildModel', [
    'uiGmapBasePolyChildModel', 'uiGmapPolygonOptionsBuilder', function(BaseGen, Builder) {
      var PolygonChildModel, base, gFactory;
      gFactory = function(opts) {
        return new google.maps.Polygon(opts);
      };
      base = new BaseGen(Builder, gFactory);
      return PolygonChildModel = (function(superClass) {
        extend(PolygonChildModel, superClass);

        function PolygonChildModel() {
          return PolygonChildModel.__super__.constructor.apply(this, arguments);
        }

        return PolygonChildModel;

      })(base);
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolylineChildModel', [
    'uiGmapBasePolyChildModel', 'uiGmapPolylineOptionsBuilder', function(BaseGen, Builder) {
      var PolylineChildModel, base, gFactory;
      gFactory = function(opts) {
        return new google.maps.Polyline(opts);
      };
      base = BaseGen(Builder, gFactory);
      return PolylineChildModel = (function(superClass) {
        extend(PolylineChildModel, superClass);

        function PolylineChildModel() {
          return PolylineChildModel.__super__.constructor.apply(this, arguments);
        }

        return PolylineChildModel;

      })(base);
    }
  ]);

}).call(this);
;
/*global _:true,angular:true,google:true */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.child').factory('uiGmapWindowChildModel', [
    'uiGmapBaseObject', 'uiGmapGmapUtil', 'uiGmapLogger', '$compile', '$http', '$templateCache', 'uiGmapChromeFixes', 'uiGmapEventsHelper', function(BaseObject, GmapUtil, $log, $compile, $http, $templateCache, ChromeFixes, EventsHelper) {
      var WindowChildModel;
      WindowChildModel = (function(superClass) {
        extend(WindowChildModel, superClass);

        WindowChildModel.include(GmapUtil);

        WindowChildModel.include(EventsHelper);

        function WindowChildModel(opts) {
          this.updateModel = bind(this.updateModel, this);
          this.destroy = bind(this.destroy, this);
          this.remove = bind(this.remove, this);
          this.getLatestPosition = bind(this.getLatestPosition, this);
          this.hideWindow = bind(this.hideWindow, this);
          this.showWindow = bind(this.showWindow, this);
          this.handleClick = bind(this.handleClick, this);
          this.watchOptions = bind(this.watchOptions, this);
          this.watchCoords = bind(this.watchCoords, this);
          this.createGWin = bind(this.createGWin, this);
          this.watchElement = bind(this.watchElement, this);
          this.watchAndDoShow = bind(this.watchAndDoShow, this);
          this.doShow = bind(this.doShow, this);
          var maybeMarker, ref, ref1, ref2, ref3;
          this.model = (ref = opts.model) != null ? ref : {}, this.scope = opts.scope, this.opts = opts.opts, this.isIconVisibleOnClick = opts.isIconVisibleOnClick, this.gMap = opts.gMap, this.markerScope = opts.markerScope, this.element = opts.element, this.needToManualDestroy = (ref1 = opts.needToManualDestroy) != null ? ref1 : false, this.markerIsVisibleAfterWindowClose = (ref2 = opts.markerIsVisibleAfterWindowClose) != null ? ref2 : true, this.isScopeModel = (ref3 = opts.isScopeModel) != null ? ref3 : false;
          if (this.isScopeModel) {
            this.clonedModel = _.clone(this.model, true);
          }
          this.getGmarker = function() {
            var ref4, ref5;
            if (((ref4 = this.markerScope) != null ? ref4['getGMarker'] : void 0) != null) {
              return (ref5 = this.markerScope) != null ? ref5.getGMarker() : void 0;
            }
          };
          this.listeners = [];
          this.createGWin();
          maybeMarker = this.getGmarker();
          if (maybeMarker != null) {
            maybeMarker.setClickable(true);
          }
          this.watchElement();
          this.watchOptions();
          this.watchCoords();
          this.watchAndDoShow();
          this.scope.$on('$destroy', (function(_this) {
            return function() {
              return _this.destroy();
            };
          })(this));
          $log.info(this);
        }

        WindowChildModel.prototype.doShow = function(wasOpen) {
          if (this.scope.show === true || wasOpen) {
            return this.showWindow();
          } else {
            return this.hideWindow();
          }
        };

        WindowChildModel.prototype.watchAndDoShow = function() {
          if (this.model.show != null) {
            this.scope.show = this.model.show;
          }
          this.scope.$watch('show', this.doShow, true);
          return this.doShow();
        };

        WindowChildModel.prototype.watchElement = function() {
          return this.scope.$watch((function(_this) {
            return function() {
              var ref, wasOpen;
              if (!(_this.element || _this.html)) {
                return;
              }
              if (_this.html !== _this.element.html() && _this.gObject) {
                if ((ref = _this.opts) != null) {
                  ref.content = void 0;
                }
                wasOpen = _this.gObject.isOpen();
                _this.remove();
                return _this.createGWin(wasOpen);
              }
            };
          })(this));
        };

        WindowChildModel.prototype.createGWin = function(isOpen) {
          var _opts, defaults, maybeMarker, ref, ref1;
          if (isOpen == null) {
            isOpen = false;
          }
          maybeMarker = this.getGmarker();
          defaults = {};
          if (this.opts != null) {
            if (this.scope.coords) {
              this.opts.position = this.getCoords(this.scope.coords);
            }
            defaults = this.opts;
          }
          if (this.element) {
            this.html = _.isObject(this.element) ? this.element.html() : this.element;
          }
          _opts = this.scope.options ? this.scope.options : defaults;
          this.opts = this.createWindowOptions(maybeMarker, this.markerScope || this.scope, this.html, _opts);
          if (this.opts != null) {
            if (!this.gObject) {
              if (this.opts.boxClass && (window.InfoBox && typeof window.InfoBox === 'function')) {
                this.gObject = new window.InfoBox(this.opts);
              } else {
                this.gObject = new google.maps.InfoWindow(this.opts);
              }
              this.listeners.push(google.maps.event.addListener(this.gObject, 'domready', function() {
                return ChromeFixes.maybeRepaint(this.content);
              }));
              this.listeners.push(google.maps.event.addListener(this.gObject, 'closeclick', (function(_this) {
                return function() {
                  if (maybeMarker) {
                    maybeMarker.setAnimation(_this.oldMarkerAnimation);
                    if (_this.markerIsVisibleAfterWindowClose) {
                      _.delay(function() {
                        maybeMarker.setVisible(false);
                        return maybeMarker.setVisible(_this.markerIsVisibleAfterWindowClose);
                      }, 250);
                    }
                  }
                  _this.gObject.close();
                  _this.model.show = false;
                  if (_this.scope.closeClick != null) {
                    return _this.scope.$evalAsync(_this.scope.closeClick());
                  } else {
                    return _this.scope.$evalAsync();
                  }
                };
              })(this)));
            }
            this.gObject.setContent(this.opts.content);
            this.handleClick(((ref = this.scope) != null ? (ref1 = ref.options) != null ? ref1.forceClick : void 0 : void 0) || isOpen);
            return this.doShow(this.gObject.isOpen());
          }
        };

        WindowChildModel.prototype.watchCoords = function() {
          var scope;
          scope = this.markerScope != null ? this.markerScope : this.scope;
          return scope.$watch('coords', (function(_this) {
            return function(newValue, oldValue) {
              var pos;
              if (newValue !== oldValue) {
                if (newValue == null) {
                  _this.hideWindow();
                } else if (!_this.validateCoords(newValue)) {
                  $log.error("WindowChildMarker cannot render marker as scope.coords as no position on marker: " + (JSON.stringify(_this.model)));
                  return;
                }
                pos = _this.getCoords(newValue);
                _this.doShow();
                _this.gObject.setPosition(pos);
                if (_this.opts) {
                  return _this.opts.position = pos;
                }
              }
            };
          })(this), true);
        };

        WindowChildModel.prototype.watchOptions = function() {
          return this.scope.$watch('options', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue) {
                _this.opts = newValue;
                if (_this.gObject != null) {
                  _this.gObject.setOptions(_this.opts);
                  if ((_this.opts.visible != null) && _this.opts.visible) {
                    return _this.showWindow();
                  } else if (_this.opts.visible != null) {
                    return _this.hideWindow();
                  }
                }
              }
            };
          })(this), true);
        };

        WindowChildModel.prototype.handleClick = function(forceClick) {
          var click, maybeMarker;
          if (this.gObject == null) {
            return;
          }
          maybeMarker = this.getGmarker();
          click = (function(_this) {
            return function() {
              if (_this.gObject == null) {
                _this.createGWin();
              }
              _this.showWindow();
              if (maybeMarker != null) {
                _this.initialMarkerVisibility = maybeMarker.getVisible();
                _this.oldMarkerAnimation = maybeMarker.getAnimation();
                return maybeMarker.setVisible(_this.isIconVisibleOnClick);
              }
            };
          })(this);
          if (forceClick) {
            click();
          }
          if (maybeMarker) {
            return this.listeners = this.listeners.concat(this.setEvents(maybeMarker, {
              events: {
                click: click
              }
            }, this.model));
          }
        };

        WindowChildModel.prototype.showWindow = function() {
          var compiled, show, templateScope;
          if (this.gObject == null) {
            return;
          }
          templateScope = null;
          show = (function(_this) {
            return function() {
              var isOpen, maybeMarker, pos;
              if (!_this.gObject.isOpen()) {
                maybeMarker = _this.getGmarker();
                if ((_this.gObject != null) && (_this.gObject.getPosition != null)) {
                  pos = _this.gObject.getPosition();
                }
                if (maybeMarker) {
                  pos = maybeMarker.getPosition();
                }
                if (!pos) {
                  return;
                }
                _this.gObject.open(_this.gMap, maybeMarker);
                isOpen = _this.gObject.isOpen();
                if (_this.model.show !== isOpen) {
                  return _this.model.show = isOpen;
                }
              }
            };
          })(this);
          if (this.scope.templateUrl) {
            $http.get(this.scope.templateUrl, {
              cache: $templateCache
            }).then((function(_this) {
              return function(content) {
                var compiled;
                templateScope = _this.scope.$new();
                if (angular.isDefined(_this.scope.templateParameter)) {
                  templateScope.parameter = _this.scope.templateParameter;
                }
                compiled = $compile(content.data)(templateScope);
                _this.gObject.setContent(compiled[0]);
                return show();
              };
            })(this));
          } else if (this.scope.template) {
            templateScope = this.scope.$new();
            if (angular.isDefined(this.scope.templateParameter)) {
              templateScope.parameter = this.scope.templateParameter;
            }
            compiled = $compile(this.scope.template)(templateScope);
            this.gObject.setContent(compiled[0]);
            show();
          } else {
            show();
          }
          return this.scope.$on('destroy', function() {
            return templateScope.$destroy();
          });
        };

        WindowChildModel.prototype.hideWindow = function() {
          if ((this.gObject != null) && this.gObject.isOpen()) {
            return this.gObject.close();
          }
        };

        WindowChildModel.prototype.getLatestPosition = function(overridePos) {
          var maybeMarker;
          maybeMarker = this.getGmarker();
          if ((this.gObject != null) && (maybeMarker != null) && !overridePos) {
            return this.gObject.setPosition(maybeMarker.getPosition());
          } else {
            if (overridePos) {
              return this.gObject.setPosition(overridePos);
            }
          }
        };

        WindowChildModel.prototype.remove = function() {
          this.hideWindow();
          this.removeEvents(this.listeners);
          this.listeners.length = 0;
          delete this.gObject;
          return delete this.opts;
        };

        WindowChildModel.prototype.destroy = function(manualOverride) {
          var ref;
          if (manualOverride == null) {
            manualOverride = false;
          }
          this.remove();
          if (((this.scope != null) && !((ref = this.scope) != null ? ref.$$destroyed : void 0)) && (this.needToManualDestroy || manualOverride)) {
            return this.scope.$destroy();
          }
        };

        WindowChildModel.prototype.updateModel = function(model) {
          if (this.isScopeModel) {
            this.clonedModel = _.clone(model, true);
          }
          return _.extend(this.model, this.clonedModel || model);
        };

        return WindowChildModel;

      })(BaseObject);
      return WindowChildModel;
    }
  ]);

}).call(this);
;
/*global _, angular */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapBasePolysParentModel', [
    '$timeout', 'uiGmapLogger', 'uiGmapModelKey', 'uiGmapModelsWatcher', 'uiGmapPropMap', 'uiGmap_async', 'uiGmapPromise', 'uiGmapFitHelper', function($timeout, $log, ModelKey, ModelsWatcher, PropMap, _async, uiGmapPromise, FitHelper) {
      return function(IPoly, PolyChildModel, gObjectName) {
        var BasePolysParentModel;
        return BasePolysParentModel = (function(superClass) {
          extend(BasePolysParentModel, superClass);

          BasePolysParentModel.include(ModelsWatcher);

          function BasePolysParentModel(scope, element, attrs, gMap1, defaults) {
            this.element = element;
            this.attrs = attrs;
            this.gMap = gMap1;
            this.defaults = defaults;
            this.maybeFit = bind(this.maybeFit, this);
            this.createChild = bind(this.createChild, this);
            this.pieceMeal = bind(this.pieceMeal, this);
            this.createAllNew = bind(this.createAllNew, this);
            this.watchIdKey = bind(this.watchIdKey, this);
            this.createChildScopes = bind(this.createChildScopes, this);
            this.watchDestroy = bind(this.watchDestroy, this);
            this.onDestroy = bind(this.onDestroy, this);
            this.rebuildAll = bind(this.rebuildAll, this);
            this.doINeedToWipe = bind(this.doINeedToWipe, this);
            this.watchModels = bind(this.watchModels, this);
            BasePolysParentModel.__super__.constructor.call(this, scope);
            this["interface"] = IPoly;
            this.$log = $log;
            this.plurals = new PropMap();
            _.each(IPoly.scopeKeys, (function(_this) {
              return function(name) {
                return _this[name + 'Key'] = void 0;
              };
            })(this));
            this.models = void 0;
            this.firstTime = true;
            this.$log.info(this);
            this.createChildScopes();
          }

          BasePolysParentModel.prototype.watchModels = function(scope) {

            /*
              This was watchCollection but not all model changes were being caught.
              TODO: Make the directive flexible in overriding whether we watch models (and depth) via watch or watchColleciton.
             */
            return scope.$watch('models', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  if (_this.doINeedToWipe(newValue) || scope.doRebuildAll) {
                    return _this.rebuildAll(scope, true, true);
                  } else {
                    return _this.createChildScopes(false);
                  }
                }
              };
            })(this), true);
          };

          BasePolysParentModel.prototype.doINeedToWipe = function(newValue) {
            var newValueIsEmpty;
            newValueIsEmpty = newValue != null ? newValue.length === 0 : true;
            return this.plurals.length > 0 && newValueIsEmpty;
          };

          BasePolysParentModel.prototype.rebuildAll = function(scope, doCreate, doDelete) {
            return this.onDestroy(doDelete).then((function(_this) {
              return function() {
                if (doCreate) {
                  return _this.createChildScopes();
                }
              };
            })(this));
          };

          BasePolysParentModel.prototype.onDestroy = function() {
            BasePolysParentModel.__super__.onDestroy.call(this, this.scope);
            return _async.promiseLock(this, uiGmapPromise.promiseTypes["delete"], void 0, void 0, (function(_this) {
              return function() {
                return _async.each(_this.plurals.values(), function(child) {
                  return child.destroy(true);
                }, _async.chunkSizeFrom(_this.scope.cleanchunk, false)).then(function() {
                  var ref;
                  return (ref = _this.plurals) != null ? ref.removeAll() : void 0;
                });
              };
            })(this));
          };

          BasePolysParentModel.prototype.watchDestroy = function(scope) {
            return scope.$on('$destroy', (function(_this) {
              return function() {
                return _this.rebuildAll(scope, false, true);
              };
            })(this));
          };

          BasePolysParentModel.prototype.createChildScopes = function(isCreatingFromScratch) {
            if (isCreatingFromScratch == null) {
              isCreatingFromScratch = true;
            }
            if (angular.isUndefined(this.scope.models)) {
              this.$log.error("No models to create " + gObjectName + "s from! I Need direct models!");
              return;
            }
            if ((this.gMap == null) || (this.scope.models == null)) {
              return;
            }
            this.watchIdKey(this.scope);
            if (isCreatingFromScratch) {
              return this.createAllNew(this.scope, false);
            } else {
              return this.pieceMeal(this.scope, false);
            }
          };

          BasePolysParentModel.prototype.watchIdKey = function(scope) {
            this.setIdKey(scope);
            return scope.$watch('idKey', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue && (newValue == null)) {
                  _this.idKey = newValue;
                  return _this.rebuildAll(scope, true, true);
                }
              };
            })(this));
          };

          BasePolysParentModel.prototype.createAllNew = function(scope, isArray) {
            var maybeCanceled;
            if (isArray == null) {
              isArray = false;
            }
            this.models = scope.models;
            if (this.firstTime) {
              this.watchModels(scope);
              this.watchDestroy(scope);
            }
            if (this.didQueueInitPromise(this, scope)) {
              return;
            }
            maybeCanceled = null;
            return _async.promiseLock(this, uiGmapPromise.promiseTypes.create, 'createAllNew', (function(canceledMsg) {
              return maybeCanceled = canceledMsg;
            }), (function(_this) {
              return function() {
                return _async.map(scope.models, function(model) {
                  var child;
                  child = _this.createChild(model, _this.gMap);
                  if (maybeCanceled) {
                    $log.debug('createNew should fall through safely');
                    child.isEnabled = false;
                  }
                  maybeCanceled;
                  return child.pathPoints.getArray();
                }, _async.chunkSizeFrom(scope.chunk)).then(function(pathPoints) {
                  _this.maybeFit(pathPoints);
                  return _this.firstTime = false;
                });
              };
            })(this));
          };

          BasePolysParentModel.prototype.pieceMeal = function(scope, isArray) {
            var maybeCanceled, payload;
            if (isArray == null) {
              isArray = true;
            }
            if (scope.$$destroyed) {
              return;
            }
            maybeCanceled = null;
            payload = null;
            this.models = scope.models;
            if ((scope != null) && this.modelsLength() && this.plurals.length) {
              return _async.promiseLock(this, uiGmapPromise.promiseTypes.update, 'pieceMeal', (function(canceledMsg) {
                return maybeCanceled = canceledMsg;
              }), (function(_this) {
                return function() {
                  return uiGmapPromise.promise(function() {
                    return _this.figureOutState(_this.idKey, scope, _this.plurals, _this.modelKeyComparison);
                  }).then(function(state) {
                    payload = state;
                    if (payload.updates.length) {
                      _async.each(payload.updates, function(obj) {
                        _.extend(obj.child.scope, obj.model);
                        return obj.child.model = obj.model;
                      });
                    }
                    return _async.each(payload.removals, function(child) {
                      if (child != null) {
                        child.destroy();
                        _this.plurals.remove(child.model[_this.idKey]);
                        return maybeCanceled;
                      }
                    }, _async.chunkSizeFrom(scope.chunk));
                  }).then(function() {
                    return _async.each(payload.adds, function(modelToAdd) {
                      if (maybeCanceled) {
                        $log.debug('pieceMeal should fall through safely');
                      }
                      _this.createChild(modelToAdd, _this.gMap);
                      return maybeCanceled;
                    }, _async.chunkSizeFrom(scope.chunk)).then(function() {
                      return _this.maybeFit();
                    });
                  });
                };
              })(this));
            } else {
              this.inProgress = false;
              return this.rebuildAll(this.scope, true, true);
            }
          };

          BasePolysParentModel.prototype.createChild = function(model, gMap) {
            var child, childScope;
            childScope = this.scope.$new(false);
            this.setChildScope(IPoly.scopeKeys, childScope, model);
            childScope.$watch('model', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  return _this.setChildScope(childScope, newValue);
                }
              };
            })(this), true);
            childScope["static"] = this.scope["static"];
            child = new PolyChildModel({
              isScopeModel: true,
              scope: childScope,
              attrs: this.attrs,
              gMap: gMap,
              defaults: this.defaults,
              model: model,
              gObjectChangeCb: (function(_this) {
                return function() {
                  return _this.maybeFit();
                };
              })(this)
            });
            if (model[this.idKey] == null) {
              this.$log.error(gObjectName + " model has no id to assign a child to.\nThis is required for performance. Please assign id,\nor redirect id to a different key.");
              return;
            }
            this.plurals.put(model[this.idKey], child);
            return child;
          };

          BasePolysParentModel.prototype.maybeFit = function(pathPoints) {
            if (pathPoints == null) {
              pathPoints = this.plurals.map(function(p) {
                return p.pathPoints;
              });
            }
            if (this.scope.fit) {
              pathPoints = _.flatten(pathPoints);
              return FitHelper.fit(pathPoints, this.gMap);
            }
          };

          return BasePolysParentModel;

        })(ModelKey);
      };
    }
  ]);

}).call(this);
;
/*globals angular, _, google */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapCircleParentModel', [
    'uiGmapLogger', '$timeout', 'uiGmapGmapUtil', 'uiGmapEventsHelper', 'uiGmapCircleOptionsBuilder', function($log, $timeout, GmapUtil, EventsHelper, Builder) {
      var CircleParentModel, _settingFromDirective;
      _settingFromDirective = function(scope, fn) {
        scope.settingFromDirective = true;
        fn();
        return $timeout(function() {
          return scope.settingFromDirective = false;
        });
      };
      return CircleParentModel = (function(superClass) {
        extend(CircleParentModel, superClass);

        CircleParentModel.include(GmapUtil);

        CircleParentModel.include(EventsHelper);

        function CircleParentModel(scope, element, attrs, gMap, DEFAULTS) {
          var clean, gObject, lastRadius;
          this.attrs = attrs;
          this.gMap = gMap;
          this.DEFAULTS = DEFAULTS;
          this.scope = scope;
          lastRadius = null;
          clean = (function(_this) {
            return function() {
              lastRadius = null;
              if (_this.listeners != null) {
                _this.removeEvents(_this.listeners);
                return _this.listeners = void 0;
              }
            };
          })(this);
          gObject = new google.maps.Circle(this.buildOpts(GmapUtil.getCoords(scope.center), scope.radius));
          this.setMyOptions = (function(_this) {
            return function(newVals, oldVals) {
              if (scope.settingFromDirective) {
                return;
              }
              if (!(_.isEqual(newVals, oldVals) && newVals === oldVals && ((newVals != null) && (oldVals != null) ? newVals.coordinates === oldVals.coordinates : true))) {
                return gObject.setOptions(_this.buildOpts(GmapUtil.getCoords(scope.center), scope.radius));
              }
            };
          })(this);
          this.props = this.props.concat([
            {
              prop: 'center',
              isColl: true
            }, {
              prop: 'fill',
              isColl: true
            }, 'radius', 'zIndex'
          ]);
          this.watchProps();
          if (this.scope.control != null) {
            this.scope.control.getCircle = function() {
              return gObject;
            };
          }
          clean();
          this.listeners = this.setEvents(gObject, scope, scope, ['radius_changed']) || [];
          this.listeners.push(google.maps.event.addListener(gObject, 'radius_changed', function() {

            /*
              possible google bug, and or because a circle has two radii
              radius_changed appears to fire twice (original and new) which is not too helpful
              therefore we will check for radius changes manually and bail out if nothing has changed
             */
            var newRadius, work;
            newRadius = gObject.getRadius();
            if (newRadius === lastRadius) {
              return;
            }
            lastRadius = newRadius;
            work = function() {
              return _settingFromDirective(scope, function() {
                var ref, ref1;
                if (newRadius !== scope.radius) {
                  scope.radius = newRadius;
                }
                if (((ref = scope.events) != null ? ref.radius_changed : void 0) && _.isFunction((ref1 = scope.events) != null ? ref1.radius_changed : void 0)) {
                  return scope.events.radius_changed(gObject, 'radius_changed', scope, arguments);
                }
              });
            };
            if (!angular.mock) {
              return scope.$evalAsync(function() {
                return work();
              });
            } else {
              return work();
            }
          }));
          this.listeners.push(google.maps.event.addListener(gObject, 'center_changed', function() {
            return scope.$evalAsync(function() {
              return _settingFromDirective(scope, function() {
                if (angular.isDefined(scope.center.type)) {
                  scope.center.coordinates[1] = gObject.getCenter().lat();
                  return scope.center.coordinates[0] = gObject.getCenter().lng();
                } else {
                  scope.center.latitude = gObject.getCenter().lat();
                  return scope.center.longitude = gObject.getCenter().lng();
                }
              });
            });
          }));
          scope.$on('$destroy', function() {
            clean();
            return gObject.setMap(null);
          });
          $log.info(this);
        }

        return CircleParentModel;

      })(Builder);
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapDrawingManagerParentModel', [
    'uiGmapLogger', '$timeout', 'uiGmapBaseObject', 'uiGmapEventsHelper', function($log, $timeout, BaseObject, EventsHelper) {
      var DrawingManagerParentModel;
      return DrawingManagerParentModel = (function(superClass) {
        extend(DrawingManagerParentModel, superClass);

        DrawingManagerParentModel.include(EventsHelper);

        function DrawingManagerParentModel(scope, element, attrs, map) {
          var gObject, listeners;
          this.scope = scope;
          this.attrs = attrs;
          this.map = map;
          gObject = new google.maps.drawing.DrawingManager(this.scope.options);
          gObject.setMap(this.map);
          listeners = void 0;
          if (this.scope.control != null) {
            this.scope.control.getDrawingManager = function() {
              return gObject;
            };
          }
          if (!this.scope["static"] && this.scope.options) {
            this.scope.$watch('options', function(newValue) {
              return gObject != null ? gObject.setOptions(newValue) : void 0;
            }, true);
          }
          if (this.scope.events != null) {
            listeners = this.setEvents(gObject, this.scope, this.scope);
            this.scope.$watch('events', (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue)) {
                  if (listeners != null) {
                    _this.removeEvents(listeners);
                  }
                  return listeners = _this.setEvents(gObject, _this.scope, _this.scope);
                }
              };
            })(this));
          }
          this.scope.$on('$destroy', (function(_this) {
            return function() {
              if (listeners != null) {
                _this.removeEvents(listeners);
              }
              gObject.setMap(null);
              return gObject = null;
            };
          })(this));
        }

        return DrawingManagerParentModel;

      })(BaseObject);
    }
  ]);

}).call(this);
;
/*
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api.models.parent").factory("uiGmapIMarkerParentModel", [
    "uiGmapModelKey", "uiGmapLogger", function(ModelKey, Logger) {
      var IMarkerParentModel;
      IMarkerParentModel = (function(superClass) {
        extend(IMarkerParentModel, superClass);

        IMarkerParentModel.prototype.DEFAULTS = {};

        function IMarkerParentModel(scope1, element, attrs, map) {
          this.scope = scope1;
          this.element = element;
          this.attrs = attrs;
          this.map = map;
          this.onWatch = bind(this.onWatch, this);
          this.watch = bind(this.watch, this);
          this.validateScope = bind(this.validateScope, this);
          IMarkerParentModel.__super__.constructor.call(this, this.scope);
          this.$log = Logger;
          if (!this.validateScope(this.scope)) {
            throw new String("Unable to construct IMarkerParentModel due to invalid scope");
          }
          this.doClick = angular.isDefined(this.attrs.click);
          if (this.scope.options != null) {
            this.DEFAULTS = this.scope.options;
          }
          this.watch('coords', this.scope);
          this.watch('icon', this.scope);
          this.watch('options', this.scope);
          this.scope.$on("$destroy", (function(_this) {
            return function() {
              return _this.onDestroy(_this.scope);
            };
          })(this));
        }

        IMarkerParentModel.prototype.validateScope = function(scope) {
          var ret;
          if (scope == null) {
            this.$log.error(this.constructor.name + ": invalid scope used");
            return false;
          }
          ret = scope.coords != null;
          if (!ret) {
            this.$log.error(this.constructor.name + ": no valid coords attribute found");
            return false;
          }
          return ret;
        };

        IMarkerParentModel.prototype.watch = function(propNameToWatch, scope, equalityCheck) {
          if (equalityCheck == null) {
            equalityCheck = true;
          }
          return scope.$watch(propNameToWatch, (function(_this) {
            return function(newValue, oldValue) {
              if (!_.isEqual(newValue, oldValue)) {
                return _this.onWatch(propNameToWatch, scope, newValue, oldValue);
              }
            };
          })(this), equalityCheck);
        };

        IMarkerParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {};

        return IMarkerParentModel;

      })(ModelKey);
      return IMarkerParentModel;
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api.models.parent").factory("uiGmapIWindowParentModel", [
    "uiGmapModelKey", "uiGmapGmapUtil", "uiGmapLogger", function(ModelKey, GmapUtil, Logger) {
      var IWindowParentModel;
      return IWindowParentModel = (function(superClass) {
        extend(IWindowParentModel, superClass);

        IWindowParentModel.include(GmapUtil);

        function IWindowParentModel(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) {
          IWindowParentModel.__super__.constructor.call(this, scope);
          this.$log = Logger;
          this.$timeout = $timeout;
          this.$compile = $compile;
          this.$http = $http;
          this.$templateCache = $templateCache;
          this.DEFAULTS = {};
          if (scope.options != null) {
            this.DEFAULTS = scope.options;
          }
        }

        IWindowParentModel.prototype.getItem = function(scope, modelsPropToIterate, index) {
          if (modelsPropToIterate === 'models') {
            return scope[modelsPropToIterate][index];
          }
          return scope[modelsPropToIterate].get(index);
        };

        return IWindowParentModel;

      })(ModelKey);
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapLayerParentModel', [
    'uiGmapBaseObject', 'uiGmapLogger', '$timeout', function(BaseObject, Logger, $timeout) {
      var LayerParentModel;
      LayerParentModel = (function(superClass) {
        extend(LayerParentModel, superClass);

        function LayerParentModel(scope, element, attrs, gMap, onLayerCreated, $log) {
          this.scope = scope;
          this.element = element;
          this.attrs = attrs;
          this.gMap = gMap;
          this.onLayerCreated = onLayerCreated != null ? onLayerCreated : void 0;
          this.$log = $log != null ? $log : Logger;
          this.createGoogleLayer = bind(this.createGoogleLayer, this);
          if (this.attrs.type == null) {
            this.$log.info('type attribute for the layer directive is mandatory. Layer creation aborted!!');
            return;
          }
          this.createGoogleLayer();
          this.doShow = true;
          if (angular.isDefined(this.attrs.show)) {
            this.doShow = this.scope.show;
          }
          if (this.doShow && (this.gMap != null)) {
            this.gObject.setMap(this.gMap);
          }
          this.scope.$watch('show', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue) {
                _this.doShow = newValue;
                if (newValue) {
                  return _this.gObject.setMap(_this.gMap);
                } else {
                  return _this.gObject.setMap(null);
                }
              }
            };
          })(this), true);
          this.scope.$watch('options', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue && _this.doShow) {
                return _this.gObject.setOptions(newValue);
              }
            };
          })(this), true);
          this.scope.$on('$destroy', (function(_this) {
            return function() {
              return _this.gObject.setMap(null);
            };
          })(this));
        }

        LayerParentModel.prototype.createGoogleLayer = function() {
          var base;
          if (this.attrs.options == null) {
            this.gObject = this.attrs.namespace === void 0 ? new google.maps[this.attrs.type]() : new google.maps[this.attrs.namespace][this.attrs.type]();
          } else {
            this.gObject = this.attrs.namespace === void 0 ? new google.maps[this.attrs.type](this.scope.options) : new google.maps[this.attrs.namespace][this.attrs.type](this.scope.options);
          }
          if ((this.gObject != null) && this.doShow) {
            this.gObject.setMap(this.gMap);
          }
          if ((this.gObject != null) && (this.onLayerCreated != null)) {
            return typeof (base = this.onLayerCreated(this.scope, this.gObject)) === "function" ? base(this.gObject) : void 0;
          }
        };

        return LayerParentModel;

      })(BaseObject);
      return LayerParentModel;
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapMapTypeParentModel', [
    'uiGmapBaseObject', 'uiGmapLogger', function(BaseObject, Logger) {
      var MapTypeParentModel;
      MapTypeParentModel = (function(superClass) {
        extend(MapTypeParentModel, superClass);

        function MapTypeParentModel(scope, element, attrs, gMap, $log) {
          this.scope = scope;
          this.element = element;
          this.attrs = attrs;
          this.gMap = gMap;
          this.$log = $log != null ? $log : Logger;
          this.hideOverlay = bind(this.hideOverlay, this);
          this.showOverlay = bind(this.showOverlay, this);
          this.refreshMapType = bind(this.refreshMapType, this);
          this.createMapType = bind(this.createMapType, this);
          if (this.attrs.options == null) {
            this.$log.info('options attribute for the map-type directive is mandatory. Map type creation aborted!!');
            return;
          }
          this.id = this.gMap.overlayMapTypesCount = this.gMap.overlayMapTypesCount + 1 || 0;
          this.doShow = true;
          this.createMapType();
          if (angular.isDefined(this.attrs.show)) {
            this.doShow = this.scope.show;
          }
          if (this.doShow && (this.gMap != null)) {
            this.showOverlay();
          }
          this.scope.$watch('show', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue) {
                _this.doShow = newValue;
                if (newValue) {
                  return _this.showOverlay();
                } else {
                  return _this.hideOverlay();
                }
              }
            };
          })(this), true);
          this.scope.$watchCollection('options', (function(_this) {
            return function(newValue, oldValue) {
              var different, mapTypeProps;
              if (!_.isEqual(newValue, oldValue)) {
                mapTypeProps = ['tileSize', 'maxZoom', 'minZoom', 'name', 'alt'];
                different = _.some(mapTypeProps, function(prop) {
                  return !oldValue || !newValue || !_.isEqual(newValue[prop], oldValue[prop]);
                });
                if (different) {
                  return _this.refreshMapType();
                }
              }
            };
          })(this));
          if (angular.isDefined(this.attrs.refresh)) {
            this.scope.$watch('refresh', (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue)) {
                  return _this.refreshMapType();
                }
              };
            })(this), true);
          }
          this.scope.$on('$destroy', (function(_this) {
            return function() {
              _this.hideOverlay();
              return _this.mapType = null;
            };
          })(this));
        }

        MapTypeParentModel.prototype.createMapType = function() {
          if (this.scope.options.getTile != null) {
            this.mapType = this.scope.options;
          } else if (this.scope.options.getTileUrl != null) {
            this.mapType = new google.maps.ImageMapType(this.scope.options);
          } else {
            this.$log.info('options should provide either getTile or getTileUrl methods. Map type creation aborted!!');
            return;
          }
          if (this.attrs.id && this.scope.id) {
            this.gMap.mapTypes.set(this.scope.id, this.mapType);
            if (!angular.isDefined(this.attrs.show)) {
              this.doShow = false;
            }
          }
          return this.mapType.layerId = this.id;
        };

        MapTypeParentModel.prototype.refreshMapType = function() {
          this.hideOverlay();
          this.mapType = null;
          this.createMapType();
          if (this.doShow && (this.gMap != null)) {
            return this.showOverlay();
          }
        };

        MapTypeParentModel.prototype.showOverlay = function() {
          return this.gMap.overlayMapTypes.push(this.mapType);
        };

        MapTypeParentModel.prototype.hideOverlay = function() {
          var found;
          found = false;
          return this.gMap.overlayMapTypes.forEach((function(_this) {
            return function(mapType, index) {
              if (!found && mapType.layerId === _this.id) {
                found = true;
                _this.gMap.overlayMapTypes.removeAt(index);
              }
            };
          })(this));
        };

        return MapTypeParentModel;

      })(BaseObject);
      return MapTypeParentModel;
    }
  ]);

}).call(this);
;
/*global _:true,angular:true, */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api.models.parent").factory("uiGmapMarkersParentModel", [
    "uiGmapIMarkerParentModel", "uiGmapModelsWatcher", "uiGmapPropMap", "uiGmapMarkerChildModel", "uiGmap_async", "uiGmapClustererMarkerManager", "uiGmapMarkerManager", "$timeout", "uiGmapIMarker", "uiGmapPromise", "uiGmapGmapUtil", "uiGmapLogger", "uiGmapSpiderfierMarkerManager", function(IMarkerParentModel, ModelsWatcher, PropMap, MarkerChildModel, _async, ClustererMarkerManager, MarkerManager, $timeout, IMarker, uiGmapPromise, GmapUtil, $log, SpiderfierMarkerManager) {
      var MarkersParentModel, _setPlurals;
      _setPlurals = function(val, objToSet) {
        objToSet.plurals = new PropMap();
        objToSet.scope.plurals = objToSet.plurals;
        return objToSet;
      };
      MarkersParentModel = (function(superClass) {
        extend(MarkersParentModel, superClass);

        MarkersParentModel.include(GmapUtil);

        MarkersParentModel.include(ModelsWatcher);

        function MarkersParentModel(scope, element, attrs, map) {
          this.maybeExecMappedEvent = bind(this.maybeExecMappedEvent, this);
          this.onDestroy = bind(this.onDestroy, this);
          this.newChildMarker = bind(this.newChildMarker, this);
          this.pieceMeal = bind(this.pieceMeal, this);
          this.rebuildAll = bind(this.rebuildAll, this);
          this.createAllNew = bind(this.createAllNew, this);
          this.bindToTypeEvents = bind(this.bindToTypeEvents, this);
          this.createChildScopes = bind(this.createChildScopes, this);
          this.validateScope = bind(this.validateScope, this);
          this.onWatch = bind(this.onWatch, this);
          MarkersParentModel.__super__.constructor.call(this, scope, element, attrs, map);
          this["interface"] = IMarker;
          _setPlurals(new PropMap(), this);
          this.scope.pluralsUpdate = {
            updateCtr: 0
          };
          this.$log.info(this);
          this.doRebuildAll = this.scope.doRebuildAll != null ? this.scope.doRebuildAll : false;
          this.setIdKey(this.scope);
          this.scope.$watch('doRebuildAll', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue) {
                return _this.doRebuildAll = newValue;
              }
            };
          })(this));
          if (!this.modelsLength()) {
            this.modelsRendered = false;
          }
          this.scope.$watch('models', (function(_this) {
            return function(newValue, oldValue) {
              if (!_.isEqual(newValue, oldValue) || !_this.modelsRendered) {
                if (newValue.length === 0 && oldValue.length === 0) {
                  return;
                }
                _this.modelsRendered = true;
                return _this.onWatch('models', _this.scope, newValue, oldValue);
              }
            };
          })(this), !this.isTrue(attrs.modelsbyref));
          this.watch('doCluster', this.scope);
          this.watch('type', this.scope);
          this.watch('clusterOptions', this.scope);
          this.watch('clusterEvents', this.scope);
          this.watch('typeOptions', this.scope);
          this.watch('typeEvents', this.scope);
          this.watch('fit', this.scope);
          this.watch('idKey', this.scope);
          this.gManager = void 0;
          this.createAllNew(this.scope);
        }

        MarkersParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {
          if (propNameToWatch === "idKey" && newValue !== oldValue) {
            this.idKey = newValue;
          }
          if (this.doRebuildAll || (propNameToWatch === 'doCluster' || propNameToWatch === 'type')) {
            return this.rebuildAll(scope);
          } else {
            return this.pieceMeal(scope);
          }
        };

        MarkersParentModel.prototype.validateScope = function(scope) {
          var modelsNotDefined;
          modelsNotDefined = angular.isUndefined(scope.models) || scope.models === void 0;
          if (modelsNotDefined) {
            this.$log.error(this.constructor.name + ": no valid models attribute found");
          }
          return MarkersParentModel.__super__.validateScope.call(this, scope) || modelsNotDefined;
        };


        /*
        Not used internally by this parent
        created for consistency for external control in the API
         */

        MarkersParentModel.prototype.createChildScopes = function(isCreatingFromScratch) {
          if ((this.gMap == null) || (this.scope.models == null)) {
            return;
          }
          if (isCreatingFromScratch) {
            return this.createAllNew(this.scope, false);
          } else {
            return this.pieceMeal(this.scope, false);
          }
        };

        MarkersParentModel.prototype.bindToTypeEvents = function(typeEvents, events) {
          var internalHandles, self;
          if (events == null) {
            events = ['click', 'mouseout', 'mouseover'];
          }

          /*
            You should only be binding to events that produce groups/clusters of somthing.
            Otherwise use the orginal event handle.
            For Example: Click on a cluster pushes a cluster/group obj through which has getMarkers
            However Spiderfy's click is for a single marker so this is not ideal for that.
           */
          self = this;
          if (!this.origTypeEvents) {
            this.origTypeEvents = {};
            _.each(events, (function(_this) {
              return function(eventName) {
                return _this.origTypeEvents[eventName] = typeEvents != null ? typeEvents[eventName] : void 0;
              };
            })(this));
          } else {
            angular.extend(typeEvents, this.origTypeEvents);
          }
          internalHandles = {};
          _.each(events, function(eventName) {
            return internalHandles[eventName] = function(group) {
              return self.maybeExecMappedEvent(group, eventName);
            };
          });
          return angular.extend(typeEvents, internalHandles);
        };

        MarkersParentModel.prototype.createAllNew = function(scope) {
          var isSpiderfied, maybeCanceled, typeEvents, typeOptions;
          if (this.gManager != null) {
            if (this.gManager instanceof SpiderfierMarkerManager) {
              isSpiderfied = this.gManager.isSpiderfied();
            }
            this.gManager.clear();
            delete this.gManager;
          }
          typeEvents = scope.typeEvents || scope.clusterEvents;
          typeOptions = scope.typeOptions || scope.clusterOptions;
          if (scope.doCluster || scope.type === 'cluster') {
            if (typeEvents != null) {
              this.bindToTypeEvents(typeEvents);
            }
            this.gManager = new ClustererMarkerManager(this.map, void 0, typeOptions, typeEvents);
          } else if (scope.type === 'spider') {
            if (typeEvents != null) {
              this.bindToTypeEvents(typeEvents, ['spiderfy', 'unspiderfy']);
            }
            this.gManager = new SpiderfierMarkerManager(this.map, void 0, typeOptions, typeEvents, this.scope);
            if (isSpiderfied) {
              this.gManager.spiderfy();
            }
          } else {
            this.gManager = new MarkerManager(this.map);
          }
          if (this.didQueueInitPromise(this, scope)) {
            return;
          }
          maybeCanceled = null;
          return _async.promiseLock(this, uiGmapPromise.promiseTypes.create, 'createAllNew', (function(canceledMsg) {
            return maybeCanceled = canceledMsg;
          }), (function(_this) {
            return function() {
              return _async.each(scope.models, function(model) {
                _this.newChildMarker(model, scope);
                return maybeCanceled;
              }, _async.chunkSizeFrom(scope.chunk)).then(function() {
                _this.modelsRendered = true;
                if (scope.fit) {
                  _this.gManager.fit();
                }
                _this.gManager.draw();
                return _this.scope.pluralsUpdate.updateCtr += 1;
              }, _async.chunkSizeFrom(scope.chunk));
            };
          })(this));
        };

        MarkersParentModel.prototype.rebuildAll = function(scope) {
          var ref;
          if (!scope.doRebuild && scope.doRebuild !== void 0) {
            return;
          }
          if ((ref = this.scope.plurals) != null ? ref.length : void 0) {
            return this.onDestroy(scope).then((function(_this) {
              return function() {
                return _this.createAllNew(scope);
              };
            })(this));
          } else {
            return this.createAllNew(scope);
          }
        };

        MarkersParentModel.prototype.pieceMeal = function(scope) {
          var maybeCanceled, payload;
          if (scope.$$destroyed) {
            return;
          }
          maybeCanceled = null;
          payload = null;
          if (this.modelsLength() && this.scope.plurals.length) {
            return _async.promiseLock(this, uiGmapPromise.promiseTypes.update, 'pieceMeal', (function(canceledMsg) {
              return maybeCanceled = canceledMsg;
            }), (function(_this) {
              return function() {
                return uiGmapPromise.promise((function() {
                  return _this.figureOutState(_this.idKey, scope, _this.scope.plurals, _this.modelKeyComparison);
                })).then(function(state) {
                  payload = state;
                  return _async.each(payload.removals, function(child) {
                    if (child != null) {
                      if (child.destroy != null) {
                        child.destroy();
                      }
                      _this.scope.plurals.remove(child.id);
                      return maybeCanceled;
                    }
                  }, _async.chunkSizeFrom(scope.chunk));
                }).then(function() {
                  return _async.each(payload.adds, function(modelToAdd) {
                    _this.newChildMarker(modelToAdd, scope);
                    return maybeCanceled;
                  }, _async.chunkSizeFrom(scope.chunk));
                }).then(function() {
                  return _async.each(payload.updates, function(update) {
                    _this.updateChild(update.child, update.model);
                    return maybeCanceled;
                  }, _async.chunkSizeFrom(scope.chunk));
                }).then(function() {
                  if (payload.adds.length > 0 || payload.removals.length > 0 || payload.updates.length > 0) {
                    scope.plurals = _this.scope.plurals;
                    if (scope.fit) {
                      _this.gManager.fit();
                    }
                    _this.gManager.draw();
                  }
                  return _this.scope.pluralsUpdate.updateCtr += 1;
                });
              };
            })(this));
          } else {
            this.inProgress = false;
            return this.rebuildAll(scope);
          }
        };

        MarkersParentModel.prototype.newChildMarker = function(model, scope) {
          var child, childScope, keys;
          if (!model) {
            throw 'model undefined';
          }
          if (model[this.idKey] == null) {
            this.$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.");
            return;
          }
          this.$log.info('child', child, 'markers', this.scope.markerModels);
          childScope = scope.$new(false);
          childScope.events = scope.events;
          keys = {};
          IMarker.scopeKeys.forEach(function(k) {
            return keys[k] = scope[k];
          });
          child = new MarkerChildModel({
            scope: childScope,
            model: model,
            keys: keys,
            gMap: this.map,
            defaults: this.DEFAULTS,
            doClick: this.doClick,
            gManager: this.gManager,
            doDrawSelf: false,
            isScopeModel: true
          });
          this.scope.plurals.put(model[this.idKey], child);
          return child;
        };

        MarkersParentModel.prototype.onDestroy = function(scope) {
          MarkersParentModel.__super__.onDestroy.call(this, scope);
          return _async.promiseLock(this, uiGmapPromise.promiseTypes["delete"], void 0, void 0, (function(_this) {
            return function() {
              return _async.each(_this.scope.plurals.values(), function(model) {
                if (model != null) {
                  return model.destroy(false);
                }
              }, _async.chunkSizeFrom(_this.scope.cleanchunk, false)).then(function() {
                if (_this.gManager != null) {
                  _this.gManager.destroy();
                }
                _this.plurals.removeAll();
                if (_this.plurals !== _this.scope.plurals) {
                  console.error('plurals out of sync for MarkersParentModel');
                }
                return _this.scope.pluralsUpdate.updateCtr += 1;
              });
            };
          })(this));
        };

        MarkersParentModel.prototype.maybeExecMappedEvent = function(group, fnName) {
          var pair, typeEvents;
          if (this.scope.$$destroyed) {
            return;
          }
          typeEvents = this.scope.typeEvents || this.scope.clusterEvents;
          if (_.isFunction(typeEvents != null ? typeEvents[fnName] : void 0)) {
            pair = this.mapTypeToPlurals(group);
            if (this.origTypeEvents[fnName]) {
              return this.origTypeEvents[fnName](pair.group, pair.mapped);
            }
          }
        };

        MarkersParentModel.prototype.mapTypeToPlurals = function(group) {
          var arrayToMap, mapped, ref;
          if (_.isArray(group)) {
            arrayToMap = group;
          } else if (_.isFunction(group.getMarkers)) {
            arrayToMap = group.getMarkers();
          }
          if (arrayToMap == null) {
            $log.error("Unable to map event as we cannot find the array group to map");
            return;
          }
          if ((ref = this.scope.plurals.values()) != null ? ref.length : void 0) {
            mapped = arrayToMap.map((function(_this) {
              return function(g) {
                return _this.scope.plurals.get(g.key).model;
              };
            })(this));
          } else {
            mapped = [];
          }
          return {
            cluster: group,
            mapped: mapped,
            group: group
          };
        };

        MarkersParentModel.prototype.getItem = function(scope, modelsPropToIterate, index) {
          if (modelsPropToIterate === 'models') {
            return scope[modelsPropToIterate][index];
          }
          return scope[modelsPropToIterate].get(index);
        };

        return MarkersParentModel;

      })(IMarkerParentModel);
      return MarkersParentModel;
    }
  ]);

}).call(this);
;(function() {
  ['Polygon', 'Polyline'].forEach(function(name) {
    return angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory("uiGmap" + name + "sParentModel", [
      'uiGmapBasePolysParentModel', "uiGmap" + name + "ChildModel", "uiGmapI" + name, function(BasePolysParentModel, ChildModel, IPoly) {
        return BasePolysParentModel(IPoly, ChildModel, name);
      }
    ]);
  });

}).call(this);
;
/*globals angular, _, google */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapRectangleParentModel', [
    'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapEventsHelper', 'uiGmapRectangleOptionsBuilder', function($log, GmapUtil, EventsHelper, Builder) {
      var RectangleParentModel;
      return RectangleParentModel = (function(superClass) {
        extend(RectangleParentModel, superClass);

        RectangleParentModel.include(GmapUtil);

        RectangleParentModel.include(EventsHelper);

        function RectangleParentModel(scope, element, attrs, gMap, DEFAULTS) {
          var bounds, clear, createBounds, dragging, fit, gObject, init, listeners, myListeners, settingBoundsFromScope, updateBounds;
          this.scope = scope;
          this.attrs = attrs;
          this.gMap = gMap;
          this.DEFAULTS = DEFAULTS;
          bounds = void 0;
          dragging = false;
          myListeners = [];
          listeners = void 0;
          fit = (function(_this) {
            return function() {
              if (_this.isTrue(_this.attrs.fit)) {
                return _this.fitMapBounds(_this.gMap, bounds);
              }
            };
          })(this);
          createBounds = (function(_this) {
            return function() {
              var ref, ref1, ref2;
              if ((_this.scope.bounds != null) && (((ref = _this.scope.bounds) != null ? ref.sw : void 0) != null) && (((ref1 = _this.scope.bounds) != null ? ref1.ne : void 0) != null) && _this.validateBoundPoints(_this.scope.bounds)) {
                bounds = _this.convertBoundPoints(_this.scope.bounds);
                return $log.info("new new bounds created: " + (JSON.stringify(bounds)));
              } else if ((_this.scope.bounds.getNorthEast != null) && (_this.scope.bounds.getSouthWest != null)) {
                return bounds = _this.scope.bounds;
              } else {
                if (_this.scope.bounds != null) {
                  return $log.error("Invalid bounds for newValue: " + (JSON.stringify((ref2 = _this.scope) != null ? ref2.bounds : void 0)));
                }
              }
            };
          })(this);
          createBounds();
          gObject = new google.maps.Rectangle(this.buildOpts(bounds));
          $log.info("gObject (rectangle) created: " + gObject);
          settingBoundsFromScope = false;
          updateBounds = (function(_this) {
            return function() {
              var b, ne, sw;
              b = gObject.getBounds();
              ne = b.getNorthEast();
              sw = b.getSouthWest();
              if (settingBoundsFromScope) {
                return;
              }
              return _this.scope.$evalAsync(function(s) {
                if ((s.bounds != null) && (s.bounds.sw != null) && (s.bounds.ne != null)) {
                  s.bounds.ne = {
                    latitude: ne.lat(),
                    longitude: ne.lng()
                  };
                  s.bounds.sw = {
                    latitude: sw.lat(),
                    longitude: sw.lng()
                  };
                }
                if ((s.bounds.getNorthEast != null) && (s.bounds.getSouthWest != null)) {
                  return s.bounds = b;
                }
              });
            };
          })(this);
          init = (function(_this) {
            return function() {
              fit();
              _this.removeEvents(myListeners);
              myListeners.push(google.maps.event.addListener(gObject, 'dragstart', function() {
                return dragging = true;
              }));
              myListeners.push(google.maps.event.addListener(gObject, 'dragend', function() {
                dragging = false;
                return updateBounds();
              }));
              return myListeners.push(google.maps.event.addListener(gObject, 'bounds_changed', function() {
                if (dragging) {
                  return;
                }
                return updateBounds();
              }));
            };
          })(this);
          clear = (function(_this) {
            return function() {
              _this.removeEvents(myListeners);
              if (listeners != null) {
                _this.removeEvents(listeners);
              }
              return gObject.setMap(null);
            };
          })(this);
          if (bounds != null) {
            init();
          }
          this.scope.$watch('bounds', (function(newValue, oldValue) {
            var isNew;
            if (_.isEqual(newValue, oldValue) && (bounds != null) || dragging) {
              return;
            }
            settingBoundsFromScope = true;
            if (newValue == null) {
              clear();
              return;
            }
            if (bounds == null) {
              isNew = true;
            } else {
              fit();
            }
            createBounds();
            gObject.setBounds(bounds);
            settingBoundsFromScope = false;
            if (isNew && (bounds != null)) {
              return init();
            }
          }), true);
          this.setMyOptions = (function(_this) {
            return function(newVals, oldVals) {
              if (!_.isEqual(newVals, oldVals)) {
                if ((bounds != null) && (newVals != null)) {
                  return gObject.setOptions(_this.buildOpts(bounds));
                }
              }
            };
          })(this);
          this.props.push('bounds');
          this.watchProps(this.props);
          if (this.attrs.events != null) {
            listeners = this.setEvents(gObject, this.scope, this.scope);
            this.scope.$watch('events', (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue)) {
                  if (listeners != null) {
                    _this.removeEvents(listeners);
                  }
                  return listeners = _this.setEvents(gObject, _this.scope, _this.scope);
                }
              };
            })(this));
          }
          this.scope.$on('$destroy', function() {
            return clear();
          });
          $log.info(this);
        }

        return RectangleParentModel;

      })(Builder);
    }
  ]);

}).call(this);
;
/*global angular:true, google:true */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapSearchBoxParentModel', [
    'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapEventsHelper', function(BaseObject, Logger, EventsHelper) {
      var SearchBoxParentModel;
      SearchBoxParentModel = (function(superClass) {
        extend(SearchBoxParentModel, superClass);

        SearchBoxParentModel.include(EventsHelper);

        function SearchBoxParentModel(scope, element, attrs, gMap, ctrlPosition, template, $log) {
          var controlDiv;
          this.scope = scope;
          this.element = element;
          this.attrs = attrs;
          this.gMap = gMap;
          this.ctrlPosition = ctrlPosition;
          this.template = template;
          this.$log = $log != null ? $log : Logger;
          this.setVisibility = bind(this.setVisibility, this);
          this.getBounds = bind(this.getBounds, this);
          this.setBounds = bind(this.setBounds, this);
          this.createSearchBox = bind(this.createSearchBox, this);
          this.addToParentDiv = bind(this.addToParentDiv, this);
          this.addAsMapControl = bind(this.addAsMapControl, this);
          this.init = bind(this.init, this);
          if (this.attrs.template == null) {
            this.$log.error('template attribute for the search-box directive is mandatory. Places Search Box creation aborted!!');
            return;
          }
          if (angular.isUndefined(this.scope.options)) {
            this.scope.options = {};
            this.scope.options.visible = true;
          }
          if (angular.isUndefined(this.scope.options.visible)) {
            this.scope.options.visible = true;
          }
          if (angular.isUndefined(this.scope.options.autocomplete)) {
            this.scope.options.autocomplete = false;
          }
          this.visible = this.scope.options.visible;
          this.autocomplete = this.scope.options.autocomplete;
          controlDiv = angular.element('<div></div>');
          controlDiv.append(this.template);
          this.input = controlDiv.find('input')[0];
          this.init();
        }

        SearchBoxParentModel.prototype.init = function() {
          this.createSearchBox();
          this.scope.$watch('options', (function(_this) {
            return function(newValue, oldValue) {
              if (angular.isObject(newValue)) {
                if (newValue.bounds != null) {
                  _this.setBounds(newValue.bounds);
                }
                if (newValue.visible != null) {
                  if (_this.visible !== newValue.visible) {
                    return _this.setVisibility(newValue.visible);
                  }
                }
              }
            };
          })(this), true);
          if (this.attrs.parentdiv != null) {
            this.addToParentDiv();
          } else {
            this.addAsMapControl();
          }
          if (!this.visible) {
            this.setVisibility(this.visible);
          }
          if (this.autocomplete) {
            this.listener = google.maps.event.addListener(this.gObject, 'place_changed', (function(_this) {
              return function() {
                return _this.places = _this.gObject.getPlace();
              };
            })(this));
          } else {
            this.listener = google.maps.event.addListener(this.gObject, 'places_changed', (function(_this) {
              return function() {
                return _this.places = _this.gObject.getPlaces();
              };
            })(this));
          }
          this.listeners = this.setEvents(this.gObject, this.scope, this.scope);
          this.$log.info(this);
          this.scope.$on('$stateChangeSuccess', (function(_this) {
            return function() {
              if (_this.attrs.parentdiv != null) {
                return _this.addToParentDiv();
              }
            };
          })(this));
          return this.scope.$on('$destroy', (function(_this) {
            return function() {
              return _this.gObject = null;
            };
          })(this));
        };

        SearchBoxParentModel.prototype.addAsMapControl = function() {
          return this.gMap.controls[google.maps.ControlPosition[this.ctrlPosition]].push(this.input);
        };

        SearchBoxParentModel.prototype.addToParentDiv = function() {
          var ref;
          this.parentDiv = angular.element(document.getElementById(this.scope.parentdiv));
          if ((ref = this.parentDiv) != null ? ref.length : void 0) {
            return this.parentDiv.append(this.input);
          }
        };

        SearchBoxParentModel.prototype.createSearchBox = function() {
          if (this.autocomplete) {
            return this.gObject = new google.maps.places.Autocomplete(this.input, this.scope.options);
          } else {
            return this.gObject = new google.maps.places.SearchBox(this.input, this.scope.options);
          }
        };

        SearchBoxParentModel.prototype.setBounds = function(bounds) {
          if (angular.isUndefined(bounds.isEmpty)) {
            this.$log.error('Error: SearchBoxParentModel setBounds. Bounds not an instance of LatLngBounds.');
          } else {
            if (bounds.isEmpty() === false) {
              if (this.gObject != null) {
                return this.gObject.setBounds(bounds);
              }
            }
          }
        };

        SearchBoxParentModel.prototype.getBounds = function() {
          return this.gObject.getBounds();
        };

        SearchBoxParentModel.prototype.setVisibility = function(val) {
          if (this.attrs.parentdiv != null) {
            if (val === false) {
              this.parentDiv.addClass("ng-hide");
            } else {
              this.parentDiv.removeClass("ng-hide");
            }
          } else {
            if (val === false) {
              this.gMap.controls[google.maps.ControlPosition[this.ctrlPosition]].clear();
            } else {
              this.gMap.controls[google.maps.ControlPosition[this.ctrlPosition]].push(this.input);
            }
          }
          return this.visible = val;
        };

        return SearchBoxParentModel;

      })(BaseObject);
      return SearchBoxParentModel;
    }
  ]);

}).call(this);
;
/*global _,angular */


/*
	WindowsChildModel generator where there are many ChildModels to a parent.
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapWindowsParentModel', [
    'uiGmapIWindowParentModel', 'uiGmapModelsWatcher', 'uiGmapPropMap', 'uiGmapWindowChildModel', 'uiGmapLinked', 'uiGmap_async', 'uiGmapLogger', '$timeout', '$compile', '$http', '$templateCache', '$interpolate', 'uiGmapPromise', 'uiGmapIWindow', 'uiGmapGmapUtil', function(IWindowParentModel, ModelsWatcher, PropMap, WindowChildModel, Linked, _async, $log, $timeout, $compile, $http, $templateCache, $interpolate, uiGmapPromise, IWindow, GmapUtil) {
      var WindowsParentModel;
      WindowsParentModel = (function(superClass) {
        extend(WindowsParentModel, superClass);

        WindowsParentModel.include(ModelsWatcher);

        function WindowsParentModel(scope, element, attrs, ctrls, gMap1, markersScope) {
          this.gMap = gMap1;
          this.markersScope = markersScope;
          this.modelKeyComparison = bind(this.modelKeyComparison, this);
          this.interpolateContent = bind(this.interpolateContent, this);
          this.setChildScope = bind(this.setChildScope, this);
          this.createWindow = bind(this.createWindow, this);
          this.setContentKeys = bind(this.setContentKeys, this);
          this.pieceMeal = bind(this.pieceMeal, this);
          this.createAllNew = bind(this.createAllNew, this);
          this.watchIdKey = bind(this.watchIdKey, this);
          this.createChildScopes = bind(this.createChildScopes, this);
          this.watchOurScope = bind(this.watchOurScope, this);
          this.watchDestroy = bind(this.watchDestroy, this);
          this.onDestroy = bind(this.onDestroy, this);
          this.rebuildAll = bind(this.rebuildAll, this);
          this.doINeedToWipe = bind(this.doINeedToWipe, this);
          this.watchModels = bind(this.watchModels, this);
          this.go = bind(this.go, this);
          WindowsParentModel.__super__.constructor.call(this, scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache);
          this["interface"] = IWindow;
          this.plurals = new PropMap();
          _.each(IWindow.scopeKeys, (function(_this) {
            return function(name) {
              return _this[name + 'Key'] = void 0;
            };
          })(this));
          this.linked = new Linked(scope, element, attrs, ctrls);
          this.contentKeys = void 0;
          this.isIconVisibleOnClick = void 0;
          this.firstTime = true;
          this.firstWatchModels = true;
          this.$log.info(self);
          this.parentScope = void 0;
          this.go(scope);
        }

        WindowsParentModel.prototype.go = function(scope) {
          this.watchOurScope(scope);
          this.doRebuildAll = this.scope.doRebuildAll != null ? this.scope.doRebuildAll : false;
          scope.$watch('doRebuildAll', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue) {
                return _this.doRebuildAll = newValue;
              }
            };
          })(this));
          return this.createChildScopes();
        };

        WindowsParentModel.prototype.watchModels = function(scope) {
          var itemToWatch;
          itemToWatch = this.markersScope != null ? 'pluralsUpdate' : 'models';
          return scope.$watch(itemToWatch, (function(_this) {
            return function(newValue, oldValue) {
              var doScratch;
              if (!_.isEqual(newValue, oldValue) || _this.firstWatchModels) {
                _this.firstWatchModels = false;
                if (_this.doRebuildAll || _this.doINeedToWipe(scope.models)) {
                  return _this.rebuildAll(scope, true, true);
                } else {
                  doScratch = _this.plurals.length === 0;
                  if (_this.existingPieces != null) {
                    return _.last(_this.existingPieces._content).then(function() {
                      return _this.createChildScopes(doScratch);
                    });
                  } else {
                    return _this.createChildScopes(doScratch);
                  }
                }
              }
            };
          })(this), true);
        };

        WindowsParentModel.prototype.doINeedToWipe = function(newValue) {
          var newValueIsEmpty;
          newValueIsEmpty = newValue != null ? newValue.length === 0 : true;
          return this.plurals.length > 0 && newValueIsEmpty;
        };

        WindowsParentModel.prototype.rebuildAll = function(scope, doCreate, doDelete) {
          return this.onDestroy(doDelete).then((function(_this) {
            return function() {
              if (doCreate) {
                return _this.createChildScopes();
              }
            };
          })(this));
        };

        WindowsParentModel.prototype.onDestroy = function(scope) {
          WindowsParentModel.__super__.onDestroy.call(this, this.scope);
          return _async.promiseLock(this, uiGmapPromise.promiseTypes["delete"], void 0, void 0, (function(_this) {
            return function() {
              return _async.each(_this.plurals.values(), function(child) {
                return child.destroy(true);
              }, _async.chunkSizeFrom(_this.scope.cleanchunk, false)).then(function() {
                var ref;
                return (ref = _this.plurals) != null ? ref.removeAll() : void 0;
              });
            };
          })(this));
        };

        WindowsParentModel.prototype.watchDestroy = function(scope) {
          return scope.$on('$destroy', (function(_this) {
            return function() {
              _this.firstWatchModels = true;
              _this.firstTime = true;
              return _this.rebuildAll(scope, false, true);
            };
          })(this));
        };

        WindowsParentModel.prototype.watchOurScope = function(scope) {
          return _.each(IWindow.scopeKeys, (function(_this) {
            return function(name) {
              var nameKey;
              nameKey = name + 'Key';
              return _this[nameKey] = typeof scope[name] === 'function' ? scope[name]() : scope[name];
            };
          })(this));
        };

        WindowsParentModel.prototype.createChildScopes = function(isCreatingFromScratch) {
          var modelsNotDefined, ref, ref1;
          if (isCreatingFromScratch == null) {
            isCreatingFromScratch = true;
          }

          /*
          being that we cannot tell the difference in Key String vs. a normal value string (TemplateUrl)
          we will assume that all scope values are string expressions either pointing to a key (propName) or using
          'self' to point the model as container/object of interest.
          
          This may force redundant information into the model, but this appears to be the most flexible approach.
           */
          this.isIconVisibleOnClick = true;
          if (angular.isDefined(this.linked.attrs.isiconvisibleonclick)) {
            this.isIconVisibleOnClick = this.linked.scope.isIconVisibleOnClick;
          }
          modelsNotDefined = angular.isUndefined(this.linked.scope.models);
          if (modelsNotDefined && (this.markersScope === void 0 || (((ref = this.markersScope) != null ? ref.plurals : void 0) === void 0 || ((ref1 = this.markersScope) != null ? ref1.models : void 0) === void 0))) {
            this.$log.error('No models to create windows from! Need direct models or models derived from markers!');
            return;
          }
          if (this.gMap != null) {
            if (this.linked.scope.models != null) {
              this.watchIdKey(this.linked.scope);
              if (isCreatingFromScratch) {
                return this.createAllNew(this.linked.scope, false);
              } else {
                return this.pieceMeal(this.linked.scope, false);
              }
            } else {
              this.parentScope = this.markersScope;
              this.watchIdKey(this.parentScope);
              if (isCreatingFromScratch) {
                return this.createAllNew(this.markersScope, true, 'plurals', false);
              } else {
                return this.pieceMeal(this.markersScope, true, 'plurals', false);
              }
            }
          }
        };

        WindowsParentModel.prototype.watchIdKey = function(scope) {
          this.setIdKey(scope);
          return scope.$watch('idKey', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue && (newValue == null)) {
                _this.idKey = newValue;
                return _this.rebuildAll(scope, true, true);
              }
            };
          })(this));
        };

        WindowsParentModel.prototype.createAllNew = function(scope, hasGMarker, modelsPropToIterate, isArray) {
          var maybeCanceled;
          if (modelsPropToIterate == null) {
            modelsPropToIterate = 'models';
          }
          if (isArray == null) {
            isArray = false;
          }
          if (this.firstTime) {
            this.watchModels(scope);
            this.watchDestroy(scope);
          }
          this.setContentKeys(scope.models);
          if (this.didQueueInitPromise(this, scope)) {
            return;
          }
          maybeCanceled = null;
          return _async.promiseLock(this, uiGmapPromise.promiseTypes.create, 'createAllNew', (function(canceledMsg) {
            return maybeCanceled = canceledMsg;
          }), (function(_this) {
            return function() {
              return _async.each(scope.models, function(model) {
                var gMarker, ref;
                gMarker = hasGMarker ? (ref = _this.getItem(scope, modelsPropToIterate, model[_this.idKey])) != null ? ref.gObject : void 0 : void 0;
                if (!maybeCanceled) {
                  if (!gMarker && _this.markersScope) {
                    $log.error('Unable to get gMarker from markersScope!');
                  }
                  _this.createWindow(model, gMarker, _this.gMap);
                }
                return maybeCanceled;
              }, _async.chunkSizeFrom(scope.chunk)).then(function() {
                return _this.firstTime = false;
              });
            };
          })(this));
        };

        WindowsParentModel.prototype.pieceMeal = function(scope, hasGMarker, modelsPropToIterate, isArray) {
          var maybeCanceled, payload;
          if (modelsPropToIterate == null) {
            modelsPropToIterate = 'models';
          }
          if (isArray == null) {
            isArray = true;
          }
          if (scope.$$destroyed) {
            return;
          }
          maybeCanceled = null;
          payload = null;
          if ((scope != null) && this.modelsLength() && this.plurals.length) {
            return _async.promiseLock(this, uiGmapPromise.promiseTypes.update, 'pieceMeal', (function(canceledMsg) {
              return maybeCanceled = canceledMsg;
            }), (function(_this) {
              return function() {
                return uiGmapPromise.promise((function() {
                  return _this.figureOutState(_this.idKey, scope, _this.plurals, _this.modelKeyComparison);
                })).then(function(state) {
                  payload = state;
                  return _async.each(payload.removals, function(child) {
                    if (child != null) {
                      _this.plurals.remove(child.id);
                      if (child.destroy != null) {
                        child.destroy(true);
                      }
                      return maybeCanceled;
                    }
                  }, _async.chunkSizeFrom(scope.chunk));
                }).then(function() {
                  return _async.each(payload.adds, function(modelToAdd) {
                    var gMarker, ref;
                    gMarker = (ref = _this.getItem(scope, modelsPropToIterate, modelToAdd[_this.idKey])) != null ? ref.gObject : void 0;
                    if (!gMarker) {
                      throw 'Gmarker undefined';
                    }
                    _this.createWindow(modelToAdd, gMarker, _this.gMap);
                    return maybeCanceled;
                  });
                }).then(function() {
                  return _async.each(payload.updates, function(update) {
                    _this.updateChild(update.child, update.model);
                    return maybeCanceled;
                  }, _async.chunkSizeFrom(scope.chunk));
                });
              };
            })(this));
          } else {
            $log.debug('pieceMeal: rebuildAll');
            return this.rebuildAll(this.scope, true, true);
          }
        };

        WindowsParentModel.prototype.setContentKeys = function(models) {
          if (this.modelsLength(models)) {
            return this.contentKeys = Object.keys(models[0]);
          }
        };

        WindowsParentModel.prototype.createWindow = function(model, gMarker, gMap) {
          var child, childScope, fakeElement, opts, ref, ref1;
          childScope = this.linked.scope.$new(false);
          this.setChildScope(childScope, model);
          childScope.$watch('model', (function(_this) {
            return function(newValue, oldValue) {
              if (newValue !== oldValue) {
                return _this.setChildScope(childScope, newValue);
              }
            };
          })(this), true);
          fakeElement = {
            html: (function(_this) {
              return function() {
                return _this.interpolateContent(_this.linked.element.html(), model);
              };
            })(this)
          };
          this.DEFAULTS = this.scopeOrModelVal(this.optionsKey, this.scope, model) || {};
          opts = this.createWindowOptions(gMarker, childScope, fakeElement.html(), this.DEFAULTS);
          child = new WindowChildModel({
            model: model,
            scope: childScope,
            opts: opts,
            isIconVisibleOnClick: this.isIconVisibleOnClick,
            gMap: gMap,
            markerScope: (ref = this.markersScope) != null ? (ref1 = ref.plurals.get(model[this.idKey])) != null ? ref1.scope : void 0 : void 0,
            element: fakeElement,
            needToManualDestroy: false,
            markerIsVisibleAfterWindowClose: true,
            isScopeModel: true
          });
          if (model[this.idKey] == null) {
            this.$log.error('Window model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.');
            return;
          }
          this.plurals.put(model[this.idKey], child);
          return child;
        };

        WindowsParentModel.prototype.setChildScope = function(childScope, model) {
          _.each(IWindow.scopeKeys, (function(_this) {
            return function(name) {
              var nameKey, newValue;
              nameKey = name + 'Key';
              newValue = _this[nameKey] === 'self' ? model : model[_this[nameKey]];
              if (newValue !== childScope[name]) {
                return childScope[name] = newValue;
              }
            };
          })(this));
          return childScope.model = model;
        };

        WindowsParentModel.prototype.interpolateContent = function(content, model) {
          var exp, i, interpModel, key, len, ref;
          if (this.contentKeys === void 0 || this.contentKeys.length === 0) {
            return;
          }
          exp = $interpolate(content);
          interpModel = {};
          ref = this.contentKeys;
          for (i = 0, len = ref.length; i < len; i++) {
            key = ref[i];
            interpModel[key] = model[key];
          }
          return exp(interpModel);
        };

        WindowsParentModel.prototype.modelKeyComparison = function(model1, model2) {
          var isEqual, scope;
          scope = this.scope.coords != null ? this.scope : this.parentScope;
          if (scope == null) {
            throw 'No scope or parentScope set!';
          }
          isEqual = GmapUtil.equalCoords(this.evalModelHandle(model1, scope.coords), this.evalModelHandle(model2, scope.coords));
          if (!isEqual) {
            return isEqual;
          }
          isEqual = _.every(_.without(this["interface"].scopeKeys, 'coords'), (function(_this) {
            return function(k) {
              return _this.evalModelHandle(model1, scope[k]) === _this.evalModelHandle(model2, scope[k]);
            };
          })(this));
          return isEqual;
        };

        return WindowsParentModel;

      })(IWindowParentModel);
      return WindowsParentModel;
    }
  ]);

}).call(this);
;
/*global angular, _ */

(function() {
  angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapCircle", [
    "uiGmapICircle", "uiGmapCircleParentModel", function(ICircle, CircleParentModel) {
      return _.extend(ICircle, {
        link: function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then(function(gMap) {
            return new CircleParentModel(scope, element, attrs, gMap);
          });
        }
      });
    }
  ]);

}).call(this);
;(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapControl", [
    "uiGmapIControl", "$http", "$templateCache", "$compile", "$controller", 'uiGmapGoogleMapApi', function(IControl, $http, $templateCache, $compile, $controller, GoogleMapApi) {
      var Control;
      return Control = (function(superClass) {
        extend(Control, superClass);

        function Control() {
          this.link = bind(this.link, this);
          Control.__super__.constructor.call(this);
        }

        Control.prototype.transclude = true;

        Control.prototype.link = function(scope, element, attrs, ctrl, transclude) {
          return GoogleMapApi.then((function(_this) {
            return function(maps) {
              var hasTranscludedContent, index, position, transcludedContent;
              transcludedContent = transclude();
              hasTranscludedContent = transclude().length > 0;
              if (!hasTranscludedContent && angular.isUndefined(scope.template)) {
                _this.$log.error('mapControl: could not find a valid template property or elements for transclusion');
                return;
              }
              index = angular.isDefined(scope.index && !isNaN(parseInt(scope.index))) ? parseInt(scope.index) : void 0;
              position = angular.isDefined(scope.position) ? scope.position.toUpperCase().replace(/-/g, '_') : 'TOP_CENTER';
              if (!maps.ControlPosition[position]) {
                _this.$log.error('mapControl: invalid position property');
                return;
              }
              return IControl.mapPromise(scope, ctrl).then(function(map) {
                var control, controlDiv, pushControl;
                control = void 0;
                controlDiv = angular.element('<div></div>');
                pushControl = function(map, control, index) {
                  if (index) {
                    control[0].index = index;
                  }
                  return map.controls[google.maps.ControlPosition[position]].push(control[0]);
                };
                if (hasTranscludedContent) {
                  return transclude(function(transcludeEl) {
                    controlDiv.append(transcludeEl);
                    return pushControl(map, controlDiv, index);
                  });
                } else {
                  return $http.get(scope.template, {
                    cache: $templateCache
                  }).success(function(template) {
                    var templateCtrl, templateScope;
                    templateScope = scope.$new();
                    controlDiv.append(template);
                    if (angular.isDefined(scope.controller)) {
                      templateCtrl = $controller(scope.controller, {
                        $scope: templateScope
                      });
                      controlDiv.children().data('$ngControllerController', templateCtrl);
                    }
                    return control = $compile(controlDiv.children())(templateScope);
                  }).error(function(error) {
                    return _this.$log.error('mapControl: template could not be found');
                  }).then(function() {
                    return pushControl(map, control, index);
                  });
                }
              });
            };
          })(this));
        };

        return Control;

      })(IControl);
    }
  ]);

}).call(this);
;
/*globals angular, _ */

(function() {
  angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapDragZoom', [
    'uiGmapCtrlHandle', 'uiGmapPropertyAction', function(CtrlHandle, PropertyAction) {
      return {
        restrict: 'EMA',
        transclude: true,
        template: '<div class="angular-google-map-dragzoom" ng-transclude style="display: none"></div>',
        require: '^' + 'uiGmapGoogleMap',
        scope: {
          keyboardkey: '=',
          options: '=',
          spec: '='
        },
        controller: [
          '$scope', '$element', function($scope, $element) {
            $scope.ctrlType = 'uiGmapDragZoom';
            return _.extend(this, CtrlHandle.handle($scope, $element));
          }
        ],
        link: function(scope, element, attrs, ctrl) {
          return CtrlHandle.mapPromise(scope, ctrl).then(function(map) {
            var enableKeyDragZoom, setKeyAction, setOptionsAction;
            enableKeyDragZoom = function(opts) {
              return map.enableKeyDragZoom(opts);
            };
            setKeyAction = new PropertyAction(function(key, newVal) {
              if (newVal) {
                return enableKeyDragZoom({
                  key: newVal
                });
              } else {
                return enableKeyDragZoom();
              }
            });
            setOptionsAction = new PropertyAction(function(key, newVal) {
              if (newVal) {
                return enableKeyDragZoom(newVal);
              }
            });
            scope.$watch('keyboardkey', setKeyAction.sic('keyboardkey'));
            setKeyAction.sic(scope.keyboardkey);
            scope.$watch('options', setOptionsAction.sic('options'));
            return setOptionsAction.sic(scope.options);
          });
        }
      };
    }
  ]);

}).call(this);
;(function() {
  angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapDrawingManager", [
    "uiGmapIDrawingManager", "uiGmapDrawingManagerParentModel", function(IDrawingManager, DrawingManagerParentModel) {
      return _.extend(IDrawingManager, {
        link: function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then(function(map) {
            return new DrawingManagerParentModel(scope, element, attrs, map);
          });
        }
      });
    }
  ]);

}).call(this);
;
/*
  - Link up Polygons to be sent back to a controller
  - inject the draw function into a controllers scope so that controller can call the directive to draw on demand
  - draw function creates the DrawFreeHandChildModel which manages itself
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapApiFreeDrawPolygons', [
    'uiGmapLogger', 'uiGmapBaseObject', 'uiGmapCtrlHandle', 'uiGmapDrawFreeHandChildModel', 'uiGmapLodash', function($log, BaseObject, CtrlHandle, DrawFreeHandChildModel, uiGmapLodash) {
      var FreeDrawPolygons;
      return FreeDrawPolygons = (function(superClass) {
        extend(FreeDrawPolygons, superClass);

        function FreeDrawPolygons() {
          this.link = bind(this.link, this);
          return FreeDrawPolygons.__super__.constructor.apply(this, arguments);
        }

        FreeDrawPolygons.include(CtrlHandle);

        FreeDrawPolygons.prototype.restrict = 'EMA';

        FreeDrawPolygons.prototype.replace = true;

        FreeDrawPolygons.prototype.require = '^' + 'uiGmapGoogleMap';

        FreeDrawPolygons.prototype.scope = {
          polygons: '=',
          draw: '='
        };

        FreeDrawPolygons.prototype.link = function(scope, element, attrs, ctrl) {
          return this.mapPromise(scope, ctrl).then((function(_this) {
            return function(map) {
              var freeHand, listener;
              if (!scope.polygons) {
                return $log.error('No polygons to bind to!');
              }
              if (!_.isArray(scope.polygons)) {
                return $log.error('Free Draw Polygons must be of type Array!');
              }
              freeHand = new DrawFreeHandChildModel(map, ctrl.getScope());
              listener = void 0;
              return scope.draw = function() {
                if (typeof listener === "function") {
                  listener();
                }
                return freeHand.engage(scope.polygons).then(function() {
                  var firstTime;
                  firstTime = true;
                  return listener = scope.$watchCollection('polygons', function(newValue, oldValue) {
                    var removals;
                    if (firstTime || newValue === oldValue) {
                      firstTime = false;
                      return;
                    }
                    removals = uiGmapLodash.differenceObjects(oldValue, newValue);
                    return removals.forEach(function(p) {
                      return p.setMap(null);
                    });
                  });
                });
              };
            };
          })(this));
        };

        return FreeDrawPolygons;

      })(BaseObject);
    }
  ]);

}).call(this);
;(function() {
  angular.module("uiGmapgoogle-maps.directives.api").service("uiGmapICircle", [
    function() {
      var DEFAULTS;
      DEFAULTS = {};
      return {
        restrict: "EA",
        replace: true,
        require: '^' + 'uiGmapGoogleMap',
        scope: {
          center: "=center",
          radius: "=radius",
          stroke: "=stroke",
          fill: "=fill",
          clickable: "=",
          draggable: "=",
          editable: "=",
          geodesic: "=",
          icons: "=icons",
          visible: "=",
          events: "=",
          control: "=",
          zIndex: "=zindex"
        }
      };
    }
  ]);

}).call(this);
;
/*
 - interface for all controls to derive from
 - to enforce a minimum set of requirements
	- attributes
		- template
		- position
		- controller
		- index
 */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapIControl", [
    "uiGmapBaseObject", "uiGmapLogger", "uiGmapCtrlHandle", function(BaseObject, Logger, CtrlHandle) {
      var IControl;
      return IControl = (function(superClass) {
        extend(IControl, superClass);

        IControl.extend(CtrlHandle);

        function IControl() {
          this.restrict = 'EA';
          this.replace = true;
          this.require = '^' + 'uiGmapGoogleMap';
          this.scope = {
            template: '@template',
            position: '@position',
            controller: '@controller',
            index: '@index'
          };
          this.$log = Logger;
        }

        IControl.prototype.link = function(scope, element, attrs, ctrl) {
          throw new Exception("Not implemented!!");
        };

        return IControl;

      })(BaseObject);
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapIDrawingManager', [
    function() {
      return {
        restrict: 'EA',
        replace: true,
        require: '^' + 'uiGmapGoogleMap',
        scope: {
          "static": '@',
          control: '=',
          options: '=',
          events: '='
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIMarker', [
    'uiGmapBaseObject', 'uiGmapCtrlHandle', function(BaseObject, CtrlHandle) {
      var IMarker;
      return IMarker = (function(superClass) {
        extend(IMarker, superClass);

        IMarker.scope = {
          coords: '=coords',
          icon: '=icon',
          click: '&click',
          options: '=options',
          events: '=events',
          fit: '=fit',
          idKey: '=idkey',
          control: '=control'
        };

        IMarker.scopeKeys = _.keys(IMarker.scope);

        IMarker.keys = IMarker.scopeKeys;

        IMarker.extend(CtrlHandle);

        function IMarker() {
          this.restrict = 'EMA';
          this.require = '^' + 'uiGmapGoogleMap';
          this.priority = -1;
          this.transclude = true;
          this.replace = true;
          this.scope = _.extend(this.scope || {}, IMarker.scope);
        }

        return IMarker;

      })(BaseObject);
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIPolygon', [
    'uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle', function(GmapUtil, BaseObject, Logger, CtrlHandle) {
      var IPolygon;
      return IPolygon = (function(superClass) {
        extend(IPolygon, superClass);

        IPolygon.scope = {
          path: '=path',
          stroke: '=stroke',
          clickable: '=',
          draggable: '=',
          editable: '=',
          geodesic: '=',
          fill: '=',
          icons: '=icons',
          visible: '=',
          "static": '=',
          events: '=',
          zIndex: '=zindex',
          fit: '=',
          control: '=control'
        };

        IPolygon.scopeKeys = _.keys(IPolygon.scope);

        IPolygon.include(GmapUtil);

        IPolygon.extend(CtrlHandle);

        function IPolygon() {}

        IPolygon.prototype.restrict = 'EMA';

        IPolygon.prototype.replace = true;

        IPolygon.prototype.require = '^' + 'uiGmapGoogleMap';

        IPolygon.prototype.scope = IPolygon.scope;

        IPolygon.prototype.DEFAULTS = {};

        IPolygon.prototype.$log = Logger;

        return IPolygon;

      })(BaseObject);
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIPolyline', [
    'uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle', function(GmapUtil, BaseObject, Logger, CtrlHandle) {
      var IPolyline;
      return IPolyline = (function(superClass) {
        extend(IPolyline, superClass);

        IPolyline.scope = {
          path: '=',
          stroke: '=',
          clickable: '=',
          draggable: '=',
          editable: '=',
          geodesic: '=',
          icons: '=',
          visible: '=',
          "static": '=',
          fit: '=',
          events: '=',
          zIndex: '=zindex'
        };

        IPolyline.scopeKeys = _.keys(IPolyline.scope);

        IPolyline.include(GmapUtil);

        IPolyline.extend(CtrlHandle);

        function IPolyline() {}

        IPolyline.prototype.restrict = 'EMA';

        IPolyline.prototype.replace = true;

        IPolyline.prototype.require = '^' + 'uiGmapGoogleMap';

        IPolyline.prototype.scope = IPolyline.scope;

        IPolyline.prototype.DEFAULTS = {};

        IPolyline.prototype.$log = Logger;

        return IPolyline;

      })(BaseObject);
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapIRectangle', [
    function() {
      'use strict';
      var DEFAULTS;
      DEFAULTS = {};
      return {
        restrict: 'EMA',
        require: '^' + 'uiGmapGoogleMap',
        replace: true,
        scope: {
          bounds: '=',
          stroke: '=',
          clickable: '=',
          draggable: '=',
          editable: '=',
          fill: '=',
          visible: '=',
          events: '='
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIWindow', [
    'uiGmapBaseObject', 'uiGmapChildEvents', 'uiGmapCtrlHandle', function(BaseObject, ChildEvents, CtrlHandle) {
      var IWindow;
      return IWindow = (function(superClass) {
        extend(IWindow, superClass);

        IWindow.scope = {
          coords: '=coords',
          template: '=template',
          templateUrl: '=templateurl',
          templateParameter: '=templateparameter',
          isIconVisibleOnClick: '=isiconvisibleonclick',
          closeClick: '&closeclick',
          options: '=options',
          control: '=control',
          show: '=show'
        };

        IWindow.scopeKeys = _.keys(IWindow.scope);

        IWindow.include(ChildEvents);

        IWindow.extend(CtrlHandle);

        function IWindow() {
          this.restrict = 'EMA';
          this.template = void 0;
          this.transclude = true;
          this.priority = -100;
          this.require = '^' + 'uiGmapGoogleMap';
          this.replace = true;
          this.scope = _.extend(this.scope || {}, IWindow.scope);
        }

        return IWindow;

      })(BaseObject);
    }
  ]);

}).call(this);
;
/*globals angular,_,google */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapMap', ['$timeout', '$q', '$log', 'uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapCtrlHandle', 'uiGmapIsReady', 'uiGmapuuid', 'uiGmapExtendGWin', 'uiGmapExtendMarkerClusterer', 'uiGmapGoogleMapsUtilV3', 'uiGmapGoogleMapApi', 'uiGmapEventsHelper', 'uiGmapGoogleMapObjectManager', function($timeout, $q, $log, uiGmapGmapUtil, uiGmapBaseObject, uiGmapCtrlHandle, uiGmapIsReady, uiGmapuuid, uiGmapExtendGWin, uiGmapExtendMarkerClusterer, uiGmapGoogleMapsUtilV3, uiGmapGoogleMapApi, uiGmapEventsHelper, uiGmapGoogleMapObjectManager) {
    var DEFAULTS, Map, initializeItems;
    DEFAULTS = void 0;
    initializeItems = [uiGmapGoogleMapsUtilV3, uiGmapExtendGWin, uiGmapExtendMarkerClusterer];
    return Map = (function(superClass) {
      extend(Map, superClass);

      Map.include(uiGmapGmapUtil);

      function Map() {
        this.link = bind(this.link, this);
        var ctrlFn;
        ctrlFn = function($scope) {
          var ctrlObj, retCtrl;
          retCtrl = void 0;
          $scope.$on('$destroy', function() {
            return uiGmapIsReady.decrement();
          });
          ctrlObj = uiGmapCtrlHandle.handle($scope);
          $scope.ctrlType = 'Map';
          $scope.deferred.promise.then(function() {
            return initializeItems.forEach(function(i) {
              return i.init();
            });
          });
          ctrlObj.getMap = function() {
            return $scope.map;
          };
          retCtrl = _.extend(this, ctrlObj);
          return retCtrl;
        };
        this.controller = ['$scope', ctrlFn];
      }

      Map.prototype.restrict = 'EMA';

      Map.prototype.transclude = true;

      Map.prototype.replace = false;

      Map.prototype.template = "<div class=\"angular-google-map\"><div class=\"angular-google-map-container\">\n</div><div ng-transclude style=\"display: none\"></div></div>";

      Map.prototype.scope = {
        center: '=',
        zoom: '=',
        dragging: '=',
        control: '=',
        options: '=',
        events: '=',
        eventOpts: '=',
        styles: '=',
        bounds: '=',
        update: '='
      };

      Map.prototype.link = function(scope, element, attrs) {
        var listeners;
        listeners = [];
        scope.$on('$destroy', function() {
          uiGmapEventsHelper.removeEvents(listeners);
          if (attrs.recycleMapInstance === 'true' && scope.map) {
            uiGmapGoogleMapObjectManager.recycleMapInstance(scope.map);
            return scope.map = null;
          }
        });
        scope.idleAndZoomChanged = false;
        return uiGmapGoogleMapApi.then((function(_this) {
          return function(maps) {
            var _gMap, customListeners, disabledEvents, dragging, el, eventName, getEventHandler, mapOptions, maybeHookToEvent, opts, ref, resolveSpawned, settingFromDirective, spawned, type, updateCenter, zoomPromise;
            DEFAULTS = {
              mapTypeId: maps.MapTypeId.ROADMAP
            };
            spawned = uiGmapIsReady.spawn();
            resolveSpawned = function() {
              return spawned.deferred.resolve({
                instance: spawned.instance,
                map: _gMap
              });
            };
            if (!angular.isDefined(scope.center) && !angular.isDefined(scope.bounds)) {
              $log.error('angular-google-maps: a center or bounds property is required');
              return;
            }
            if (!angular.isDefined(scope.center)) {
              scope.center = new google.maps.LatLngBounds(_this.getCoords(scope.bounds.southwest), _this.getCoords(scope.bounds.northeast)).getCenter();
            }
            if (!angular.isDefined(scope.zoom)) {
              scope.zoom = 10;
            }
            el = angular.element(element);
            el.addClass('angular-google-map');
            opts = {
              options: {}
            };
            if (attrs.options) {
              opts.options = scope.options;
            }
            if (attrs.styles) {
              opts.styles = scope.styles;
            }
            if (attrs.type) {
              type = attrs.type.toUpperCase();
              if (google.maps.MapTypeId.hasOwnProperty(type)) {
                opts.mapTypeId = google.maps.MapTypeId[attrs.type.toUpperCase()];
              } else {
                $log.error("angular-google-maps: invalid map type '" + attrs.type + "'");
              }
            }
            mapOptions = angular.extend({}, DEFAULTS, opts, {
              center: _this.getCoords(scope.center),
              zoom: scope.zoom,
              bounds: scope.bounds
            });
            if (attrs.recycleMapInstance === 'true') {
              _gMap = uiGmapGoogleMapObjectManager.createMapInstance(el.find('div')[1], mapOptions);
            } else {
              _gMap = new google.maps.Map(el.find('div')[1], mapOptions);
            }
            _gMap['uiGmap_id'] = uiGmapuuid.generate();
            dragging = false;
            listeners.push(google.maps.event.addListenerOnce(_gMap, 'idle', function() {
              scope.deferred.resolve(_gMap);
              return resolveSpawned();
            }));
            disabledEvents = attrs.events && (((ref = scope.events) != null ? ref.blacklist : void 0) != null) ? scope.events.blacklist : [];
            if (_.isString(disabledEvents)) {
              disabledEvents = [disabledEvents];
            }
            maybeHookToEvent = function(eventName, fn, prefn) {
              if (!_.includes(disabledEvents, eventName)) {
                if (prefn) {
                  prefn();
                }
                return listeners.push(google.maps.event.addListener(_gMap, eventName, function() {
                  var ref1;
                  if (!((ref1 = scope.update) != null ? ref1.lazy : void 0)) {
                    return fn();
                  }
                }));
              }
            };
            if (!_.includes(disabledEvents, 'all')) {
              maybeHookToEvent('dragstart', function() {
                dragging = true;
                return scope.$evalAsync(function(s) {
                  if (s.dragging != null) {
                    return s.dragging = dragging;
                  }
                });
              });
              maybeHookToEvent('dragend', function() {
                dragging = false;
                return scope.$evalAsync(function(s) {
                  if (s.dragging != null) {
                    return s.dragging = dragging;
                  }
                });
              });
              updateCenter = function(c, s) {
                if (c == null) {
                  c = _gMap.center;
                }
                if (s == null) {
                  s = scope;
                }
                if (_.includes(disabledEvents, 'center')) {
                  if (s.center.latitude !== c.lat()) {
                    s.center.latitude = c.lat();
                  }
                  if (s.center.longitude !== c.lng()) {
                    return s.center.longitude = c.lng();
                  }
                }
              };
              settingFromDirective = false;
              maybeHookToEvent('idle', function() {
                var b, ne, sw;
                b = _gMap.getBounds();
                ne = b.getNorthEast();
                sw = b.getSouthWest();
                settingFromDirective = true;
                return scope.$evalAsync(function(s) {
                  updateCenter();
                  if (!_.isUndefined(s.bounds) && !_.includes(disabledEvents, 'bounds')) {
                    s.bounds.northeast = {
                      latitude: ne.lat(),
                      longitude: ne.lng()
                    };
                    s.bounds.southwest = {
                      latitude: sw.lat(),
                      longitude: sw.lng()
                    };
                  }
                  if (!_.includes(disabledEvents, 'zoom')) {
                    s.zoom = _gMap.zoom;
                    scope.idleAndZoomChanged = !scope.idleAndZoomChanged;
                  }
                  return settingFromDirective = false;
                });
              });
            }
            if (angular.isDefined(scope.events) && scope.events !== null && angular.isObject(scope.events)) {
              getEventHandler = function(eventName) {
                return function() {
                  return scope.events[eventName].apply(scope, [_gMap, eventName, arguments]);
                };
              };
              customListeners = [];
              for (eventName in scope.events) {
                if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
                  customListeners.push(google.maps.event.addListener(_gMap, eventName, getEventHandler(eventName)));
                }
              }
              listeners.concat(customListeners);
            }
            _gMap.getOptions = function() {
              return mapOptions;
            };
            scope.map = _gMap;
            if ((attrs.control != null) && (scope.control != null)) {
              scope.control.refresh = function(maybeCoords) {
                var coords, ref1, ref2;
                if (_gMap == null) {
                  return;
                }
                if (((typeof google !== "undefined" && google !== null ? (ref1 = google.maps) != null ? (ref2 = ref1.event) != null ? ref2.trigger : void 0 : void 0 : void 0) != null) && (_gMap != null)) {
                  google.maps.event.trigger(_gMap, 'resize');
                }
                if (((maybeCoords != null ? maybeCoords.latitude : void 0) != null) && ((maybeCoords != null ? maybeCoords.longitude : void 0) != null)) {
                  coords = _this.getCoords(maybeCoords);
                  if (_this.isTrue(attrs.pan)) {
                    return _gMap.panTo(coords);
                  } else {
                    return _gMap.setCenter(coords);
                  }
                }
              };
              scope.control.getGMap = function() {
                return _gMap;
              };
              scope.control.getMapOptions = function() {
                return mapOptions;
              };
              scope.control.getCustomEventListeners = function() {
                return customListeners;
              };
              scope.control.removeEvents = function(yourListeners) {
                return uiGmapEventsHelper.removeEvents(yourListeners);
              };
            }
            scope.$watch('center', function(newValue, oldValue) {
              var coords;
              if (newValue === oldValue || settingFromDirective) {
                return;
              }
              coords = _this.getCoords(scope.center);
              if (coords.lat() === _gMap.center.lat() && coords.lng() === _gMap.center.lng()) {
                return;
              }
              if (!dragging) {
                if (!_this.validateCoords(newValue)) {
                  $log.error("Invalid center for newValue: " + (JSON.stringify(newValue)));
                }
                if (_this.isTrue(attrs.pan) && scope.zoom === _gMap.zoom) {
                  return _gMap.panTo(coords);
                } else {
                  return _gMap.setCenter(coords);
                }
              }
            }, true);
            zoomPromise = null;
            scope.$watch('zoom', function(newValue, oldValue) {
              var ref1, ref2;
              if (newValue == null) {
                return;
              }
              if (_.isEqual(newValue, oldValue) || (_gMap != null ? _gMap.getZoom() : void 0) === (scope != null ? scope.zoom : void 0) || settingFromDirective) {
                return;
              }
              if (zoomPromise != null) {
                $timeout.cancel(zoomPromise);
              }
              return zoomPromise = $timeout(function() {
                return _gMap.setZoom(newValue);
              }, ((ref1 = scope.eventOpts) != null ? (ref2 = ref1.debounce) != null ? ref2.zoomMs : void 0 : void 0) + 20, false);
            });
            scope.$watch('bounds', function(newValue, oldValue) {
              var bounds, ne, ref1, ref2, ref3, ref4, sw;
              if (newValue === oldValue) {
                return;
              }
              if (((newValue != null ? (ref1 = newValue.northeast) != null ? ref1.latitude : void 0 : void 0) == null) || ((newValue != null ? (ref2 = newValue.northeast) != null ? ref2.longitude : void 0 : void 0) == null) || ((newValue != null ? (ref3 = newValue.southwest) != null ? ref3.latitude : void 0 : void 0) == null) || ((newValue != null ? (ref4 = newValue.southwest) != null ? ref4.longitude : void 0 : void 0) == null)) {
                $log.error("Invalid map bounds for new value: " + (JSON.stringify(newValue)));
                return;
              }
              ne = new google.maps.LatLng(newValue.northeast.latitude, newValue.northeast.longitude);
              sw = new google.maps.LatLng(newValue.southwest.latitude, newValue.southwest.longitude);
              bounds = new google.maps.LatLngBounds(sw, ne);
              return _gMap.fitBounds(bounds);
            });
            return ['options', 'styles'].forEach(function(toWatch) {
              return scope.$watch(toWatch, function(newValue, oldValue) {
                if (_.isEqual(newValue, oldValue)) {
                  return;
                }
                if (toWatch === 'options') {
                  opts.options = newValue;
                } else {
                  opts.options[toWatch] = newValue;
                }
                if (_gMap != null) {
                  return _gMap.setOptions(opts);
                }
              }, true);
            });
          };
        })(this));
      };

      return Map;

    })(uiGmapBaseObject);
  }]);

}).call(this);
;
/*global _:true,angular:true */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapMarker", [
    "uiGmapIMarker", "uiGmapMarkerChildModel", "uiGmapMarkerManager", "uiGmapLogger", function(IMarker, MarkerChildModel, MarkerManager, $log) {
      var Marker;
      return Marker = (function(superClass) {
        extend(Marker, superClass);

        function Marker() {
          Marker.__super__.constructor.call(this);
          this.template = '<span class="angular-google-map-marker" ng-transclude></span>';
          $log.info(this);
        }

        Marker.prototype.controller = [
          '$scope', '$element', function($scope, $element) {
            $scope.ctrlType = 'Marker';
            return _.extend(this, IMarker.handle($scope, $element));
          }
        ];

        Marker.prototype.link = function(scope, element, attrs, ctrl) {
          var mapPromise;
          mapPromise = IMarker.mapPromise(scope, ctrl);
          mapPromise.then(function(gMap) {
            var gManager, keys, m;
            gManager = new MarkerManager(gMap);
            keys = _.object(IMarker.keys, IMarker.keys);
            m = new MarkerChildModel({
              scope: scope,
              model: scope,
              keys: keys,
              gMap: gMap,
              doClick: true,
              gManager: gManager,
              doDrawSelf: false,
              trackModel: false
            });
            m.deferred.promise.then(function(gMarker) {
              return scope.deferred.resolve(gMarker);
            });
            if (scope.control != null) {
              return scope.control.getGMarkers = gManager.getGMarkers;
            }
          });
          return scope.$on('$destroy', function() {
            var gManager;
            if (typeof gManager !== "undefined" && gManager !== null) {
              gManager.clear();
            }
            return gManager = null;
          });
        };

        return Marker;

      })(IMarker);
    }
  ]);

}).call(this);
;
/*global _:true,angular:true */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapMarkers", [
    "uiGmapIMarker", "uiGmapPlural", "uiGmapMarkersParentModel", "uiGmap_sync", "uiGmapLogger", function(IMarker, Plural, MarkersParentModel, _sync, $log) {
      var Markers;
      return Markers = (function(superClass) {
        extend(Markers, superClass);

        function Markers() {
          Markers.__super__.constructor.call(this);
          this.template = '<span class="angular-google-map-markers" ng-transclude></span>';
          Plural.extend(this, {
            doCluster: '=?docluster',
            clusterOptions: '=clusteroptions',
            clusterEvents: '=clusterevents',
            modelsByRef: '=modelsbyref',
            type: '=?type',
            typeOptions: '=?typeoptions',
            typeEvents: '=?typeevents'
          });
          $log.info(this);
        }

        Markers.prototype.controller = [
          '$scope', '$element', function($scope, $element) {
            $scope.ctrlType = 'Markers';
            return _.extend(this, IMarker.handle($scope, $element));
          }
        ];

        Markers.prototype.link = function(scope, element, attrs, ctrl) {
          var parentModel, ready;
          parentModel = void 0;
          ready = function() {
            return scope.deferred.resolve();
          };
          return IMarker.mapPromise(scope, ctrl).then(function(map) {
            var mapScope;
            mapScope = ctrl.getScope();
            mapScope.$watch('idleAndZoomChanged', function() {
              return _.defer(parentModel.gManager.draw);
            });
            parentModel = new MarkersParentModel(scope, element, attrs, map);
            Plural.link(scope, parentModel);
            if (scope.control != null) {
              scope.control.getGMarkers = function() {
                var ref;
                return (ref = parentModel.gManager) != null ? ref.getGMarkers() : void 0;
              };
              scope.control.getChildMarkers = function() {
                return parentModel.plurals;
              };
            }
            return _.last(parentModel.existingPieces._content).then(function() {
              return ready();
            });
          });
        };

        return Markers;

      })(IMarker);
    }
  ]);

}).call(this);
;
/*global angular */

(function() {
  angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapPlural', [
    function() {
      var _initControl;
      _initControl = function(scope, parent) {
        if (scope.control == null) {
          return;
        }
        scope.control.updateModels = function(models) {
          scope.models = models;
          return parent.createChildScopes(false);
        };
        scope.control.newModels = function(models) {
          scope.models = models;
          return parent.rebuildAll(scope, true, true);
        };
        scope.control.clean = function() {
          return parent.rebuildAll(scope, false, true);
        };
        scope.control.getPlurals = function() {
          return parent.plurals;
        };
        scope.control.getManager = function() {
          return parent.gManager;
        };
        scope.control.hasManager = function() {
          return (parent.gManager != null) === true;
        };
        return scope.control.managerDraw = function() {
          var ref;
          if (scope.control.hasManager()) {
            return (ref = scope.control.getManager()) != null ? ref.draw() : void 0;
          }
        };
      };
      return {
        extend: function(obj, obj2) {
          return _.extend(obj.scope || {}, obj2 || {}, {
            idKey: '=idkey',
            doRebuildAll: '=dorebuildall',
            models: '=models',
            chunk: '=chunk',
            cleanchunk: '=cleanchunk',
            control: '=control'
          });
        },
        link: function(scope, parent) {
          return _initControl(scope, parent);
        }
      };
    }
  ]);

}).call(this);
;
/*global angular */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolygon', [
    'uiGmapIPolygon', '$timeout', 'uiGmapPolygonChildModel', function(IPolygon, $timeout, PolygonChild) {
      var Polygon;
      return Polygon = (function(superClass) {
        extend(Polygon, superClass);

        function Polygon() {
          this.link = bind(this.link, this);
          return Polygon.__super__.constructor.apply(this, arguments);
        }

        Polygon.prototype.link = function(scope, element, attrs, mapCtrl) {
          var children, promise;
          children = [];
          promise = IPolygon.mapPromise(scope, mapCtrl);
          if (scope.control != null) {
            scope.control.getInstance = this;
            scope.control.polygons = children;
            scope.control.promise = promise;
          }
          return promise.then((function(_this) {
            return function(gMap) {
              return children.push(new PolygonChild({
                scope: scope,
                attrs: attrs,
                gMap: gMap,
                defaults: _this.DEFAULTS
              }));
            };
          })(this));
        };

        return Polygon;

      })(IPolygon);
    }
  ]);

}).call(this);
;
/*global angular:true */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolygons', [
    'uiGmapIPolygon', '$timeout', 'uiGmapPolygonsParentModel', 'uiGmapPlural', function(Interface, $timeout, ParentModel, Plural) {
      var Polygons;
      return Polygons = (function(superClass) {
        extend(Polygons, superClass);

        function Polygons() {
          this.link = bind(this.link, this);
          Polygons.__super__.constructor.call(this);
          Plural.extend(this);
          this.$log.info(this);
        }

        Polygons.prototype.link = function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then((function(_this) {
            return function(map) {
              if (angular.isUndefined(scope.path) || scope.path === null) {
                _this.$log.warn('polygons: no valid path attribute found');
              }
              if (!scope.models) {
                _this.$log.warn('polygons: no models found to create from');
              }
              return Plural.link(scope, new ParentModel(scope, element, attrs, map, _this.DEFAULTS));
            };
          })(this));
        };

        return Polygons;

      })(Interface);
    }
  ]);

}).call(this);
;
/*global angular */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolyline', [
    'uiGmapIPolyline', '$timeout', 'uiGmapPolylineChildModel', function(IPolyline, $timeout, PolylineChildModel) {
      var Polyline;
      return Polyline = (function(superClass) {
        extend(Polyline, superClass);

        function Polyline() {
          this.link = bind(this.link, this);
          return Polyline.__super__.constructor.apply(this, arguments);
        }

        Polyline.prototype.link = function(scope, element, attrs, mapCtrl) {
          return IPolyline.mapPromise(scope, mapCtrl).then((function(_this) {
            return function(gMap) {
              if (angular.isUndefined(scope.path) || scope.path === null || !_this.validatePath(scope.path)) {
                _this.$log.warn('polyline: no valid path attribute found');
              }
              return new PolylineChildModel({
                scope: scope,
                attrs: attrs,
                gMap: gMap,
                defaults: _this.DEFAULTS
              });
            };
          })(this));
        };

        return Polyline;

      })(IPolyline);
    }
  ]);

}).call(this);
;
/*global angular */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolylines', [
    'uiGmapIPolyline', '$timeout', 'uiGmapPolylinesParentModel', 'uiGmapPlural', function(IPolyline, $timeout, PolylinesParentModel, Plural) {
      var Polylines;
      return Polylines = (function(superClass) {
        extend(Polylines, superClass);

        function Polylines() {
          this.link = bind(this.link, this);
          Polylines.__super__.constructor.call(this);
          Plural.extend(this);
          this.$log.info(this);
        }

        Polylines.prototype.link = function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then((function(_this) {
            return function(gMap) {
              if (angular.isUndefined(scope.path) || scope.path === null) {
                _this.$log.warn('polylines: no valid path attribute found');
              }
              if (!scope.models) {
                _this.$log.warn('polylines: no models found to create from');
              }
              return Plural.link(scope, new PolylinesParentModel(scope, element, attrs, gMap, _this.DEFAULTS));
            };
          })(this));
        };

        return Polylines;

      })(IPolyline);
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapRectangle', [
    'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapIRectangle', 'uiGmapRectangleParentModel', function($log, GmapUtil, IRectangle, RectangleParentModel) {
      return _.extend(IRectangle, {
        link: function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then(function(gMap) {
            return new RectangleParentModel(scope, element, attrs, gMap);
          });
        }
      });
    }
  ]);

}).call(this);
;
/*global angular:true */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapWindow', [
    'uiGmapIWindow', 'uiGmapGmapUtil', 'uiGmapWindowChildModel', 'uiGmapLodash', 'uiGmapLogger', function(IWindow, GmapUtil, WindowChildModel, uiGmapLodash, $log) {
      var Window;
      return Window = (function(superClass) {
        extend(Window, superClass);

        Window.include(GmapUtil);

        function Window() {
          this.link = bind(this.link, this);
          Window.__super__.constructor.call(this);
          this.require = ['^' + 'uiGmapGoogleMap', '^?' + 'uiGmapMarker'];
          this.template = '<span class="angular-google-maps-window" ng-transclude></span>';
          $log.debug(this);
          this.childWindows = [];
        }

        Window.prototype.link = function(scope, element, attrs, ctrls) {
          var markerCtrl, markerScope;
          markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1] : void 0;
          markerScope = markerCtrl != null ? markerCtrl.getScope() : void 0;
          this.mapPromise = IWindow.mapPromise(scope, ctrls[0]);
          return this.mapPromise.then((function(_this) {
            return function(gMap) {
              var isIconVisibleOnClick;
              isIconVisibleOnClick = true;
              if (angular.isDefined(attrs.isiconvisibleonclick)) {
                isIconVisibleOnClick = scope.isIconVisibleOnClick;
              }
              if (!markerCtrl) {
                _this.init(scope, element, isIconVisibleOnClick, gMap);
                return;
              }
              return markerScope.deferred.promise.then(function(gMarker) {
                return _this.init(scope, element, isIconVisibleOnClick, gMap, markerScope);
              });
            };
          })(this));
        };

        Window.prototype.init = function(scope, element, isIconVisibleOnClick, gMap, markerScope) {
          var childWindow, defaults, gMarker, hasScopeCoords, opts;
          defaults = scope.options != null ? scope.options : {};
          hasScopeCoords = (scope != null) && this.validateCoords(scope.coords);
          if ((markerScope != null ? markerScope['getGMarker'] : void 0) != null) {
            gMarker = markerScope.getGMarker();
          }
          opts = hasScopeCoords ? this.createWindowOptions(gMarker, scope, element.html(), defaults) : defaults;
          if (gMap != null) {
            childWindow = new WindowChildModel({
              scope: scope,
              opts: opts,
              isIconVisibleOnClick: isIconVisibleOnClick,
              gMap: gMap,
              markerScope: markerScope,
              element: element
            });
            this.childWindows.push(childWindow);
            scope.$on('$destroy', (function(_this) {
              return function() {
                _this.childWindows = uiGmapLodash.withoutObjects(_this.childWindows, [childWindow], function(child1, child2) {
                  return child1.scope.$id === child2.scope.$id;
                });
                return _this.childWindows.length = 0;
              };
            })(this));
          }
          if (scope.control != null) {
            scope.control.getGWindows = (function(_this) {
              return function() {
                return _this.childWindows.map(function(child) {
                  return child.gObject;
                });
              };
            })(this);
            scope.control.getChildWindows = (function(_this) {
              return function() {
                return _this.childWindows;
              };
            })(this);
            scope.control.getPlurals = scope.control.getChildWindows;
            scope.control.showWindow = (function(_this) {
              return function() {
                return _this.childWindows.map(function(child) {
                  return child.showWindow();
                });
              };
            })(this);
            scope.control.hideWindow = (function(_this) {
              return function() {
                return _this.childWindows.map(function(child) {
                  return child.hideWindow();
                });
              };
            })(this);
          }
          if ((this.onChildCreation != null) && (childWindow != null)) {
            return this.onChildCreation(childWindow);
          }
        };

        return Window;

      })(IWindow);
    }
  ]);

}).call(this);
;
/*global angular */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapWindows', [
    'uiGmapIWindow', 'uiGmapPlural', 'uiGmapWindowsParentModel', 'uiGmapPromise', 'uiGmapLogger', function(IWindow, Plural, WindowsParentModel, uiGmapPromise, $log) {

      /*
      Windows directive where many windows map to the models property
       */
      var Windows;
      return Windows = (function(superClass) {
        extend(Windows, superClass);

        function Windows() {
          this.link = bind(this.link, this);
          Windows.__super__.constructor.call(this);
          this.require = ['^' + 'uiGmapGoogleMap', '^?' + 'uiGmapMarkers'];
          this.template = '<span class="angular-google-maps-windows" ng-transclude></span>';
          Plural.extend(this);
          $log.debug(this);
        }

        Windows.prototype.link = function(scope, element, attrs, ctrls) {
          var mapScope, markerCtrl, markerScope;
          mapScope = ctrls[0].getScope();
          markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1] : void 0;
          markerScope = markerCtrl != null ? markerCtrl.getScope() : void 0;
          return mapScope.deferred.promise.then((function(_this) {
            return function(map) {
              var promise, ref;
              promise = (markerScope != null ? (ref = markerScope.deferred) != null ? ref.promise : void 0 : void 0) || uiGmapPromise.resolve();
              return promise.then(function() {
                var pieces, ref1;
                pieces = (ref1 = _this.parentModel) != null ? ref1.existingPieces : void 0;
                if (pieces) {
                  return pieces.then(function() {
                    return _this.init(scope, element, attrs, ctrls, map, markerScope);
                  });
                } else {
                  return _this.init(scope, element, attrs, ctrls, map, markerScope);
                }
              });
            };
          })(this));
        };

        Windows.prototype.init = function(scope, element, attrs, ctrls, map, additionalScope) {
          var parentModel;
          parentModel = new WindowsParentModel(scope, element, attrs, ctrls, map, additionalScope);
          Plural.link(scope, parentModel);
          if (scope.control != null) {
            scope.control.getGWindows = function() {
              return parentModel.plurals.map(function(child) {
                return child.gObject;
              });
            };
            return scope.control.getChildWindows = function() {
              return parentModel.plurals;
            };
          }
        };

        return Windows;

      })(IWindow);
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
Nick Baugh - https://github.com/niftylettuce
 */


/*globals angular */

(function() {
  angular.module("uiGmapgoogle-maps").directive("uiGmapGoogleMap", ['uiGmapMap', function(uiGmapMap) {
    return new uiGmapMap();
  }]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */


/*
Map marker directive

This directive is used to create a marker on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute icon optional}    string url to image used for marker icon
{attribute animate optional} if set to false, the marker won't be animated (on by default)
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapMarker', [
    '$timeout', 'uiGmapMarker', function($timeout, Marker) {
      return new Marker($timeout);
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */


/*
Map marker directive

This directive is used to create a marker on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute icon optional}    string url to image used for marker icon
{attribute animate optional} if set to false, the marker won't be animated (on by default)
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapMarkers', [
    '$timeout', 'uiGmapMarkers', function($timeout, Markers) {
      return new Markers($timeout);
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
Rick Huizinga - https://plus.google.com/+RickHuizinga
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapPolygon', [
    'uiGmapPolygon', function(Polygon) {
      return new Polygon();
    }
  ]);

}).call(this);
;
/*
@authors
Julian Popescu - https://github.com/jpopesculian
Rick Huizinga - https://plus.google.com/+RickHuizinga
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive("uiGmapCircle", [
    "uiGmapCircle", function(Circle) {
      return Circle;
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */

(function() {
  angular.module("uiGmapgoogle-maps").directive("uiGmapPolyline", [
    "uiGmapPolyline", function(Polyline) {
      return new Polyline();
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapPolylines', [
    'uiGmapPolylines', function(Polylines) {
      return new Polylines();
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
Chentsu Lin - https://github.com/ChenTsuLin
 */

(function() {
  angular.module("uiGmapgoogle-maps").directive("uiGmapRectangle", [
    "uiGmapLogger", "uiGmapRectangle", function($log, Rectangle) {
      return Rectangle;
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */


/*
Map info window directive

This directive is used to create an info window on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute show optional}    map will show when this expression returns true
 */

(function() {
  angular.module("uiGmapgoogle-maps").directive("uiGmapWindow", [
    "$timeout", "$compile", "$http", "$templateCache", "uiGmapWindow", function($timeout, $compile, $http, $templateCache, Window) {
      return new Window($timeout, $compile, $http, $templateCache);
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
 */


/*
Map info window directive

This directive is used to create an info window on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute show optional}    map will show when this expression returns true
 */

(function() {
  angular.module("uiGmapgoogle-maps").directive("uiGmapWindows", [
    "$timeout", "$compile", "$http", "$templateCache", "$interpolate", "uiGmapWindows", function($timeout, $compile, $http, $templateCache, $interpolate, Windows) {
      return new Windows($timeout, $compile, $http, $templateCache, $interpolate);
    }
  ]);

}).call(this);
;
/*
@authors:
- Nicolas Laplante https://plus.google.com/108189012221374960701
- Nicholas McCready - https://twitter.com/nmccready
 */


/*
Map Layer directive

This directive is used to create any type of Layer from the google maps sdk.
This directive creates a new scope.

{attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('uiGmapgoogle-maps').directive('uiGmapLayer', [
    '$timeout', 'uiGmapLogger', 'uiGmapLayerParentModel', function($timeout, Logger, LayerParentModel) {
      var Layer;
      Layer = (function() {
        function Layer() {
          this.link = bind(this.link, this);
          this.$log = Logger;
          this.restrict = 'EMA';
          this.require = '^' + 'uiGmapGoogleMap';
          this.priority = -1;
          this.transclude = true;
          this.template = '<span class=\'angular-google-map-layer\' ng-transclude></span>';
          this.replace = true;
          this.scope = {
            show: '=show',
            type: '=type',
            namespace: '=namespace',
            options: '=options',
            onCreated: '&oncreated'
          };
        }

        Layer.prototype.link = function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then((function(_this) {
            return function(map) {
              if (scope.onCreated != null) {
                return new LayerParentModel(scope, element, attrs, map, scope.onCreated);
              } else {
                return new LayerParentModel(scope, element, attrs, map);
              }
            };
          })(this));
        };

        return Layer;

      })();
      return new Layer();
    }
  ]);

}).call(this);
;
/*
@authors
Adam Kreitals, kreitals@hotmail.com
 */


/*
mapControl directive

This directive is used to create a custom control element on an existing map.
This directive creates a new scope.

{attribute template required}  	string url of the template to be used for the control
{attribute position optional}  	string position of the control of the form top-left or TOP_LEFT defaults to TOP_CENTER
{attribute controller optional}	string controller to be applied to the template
{attribute index optional}		number index for controlling the order of similarly positioned mapControl elements
 */

(function() {
  angular.module("uiGmapgoogle-maps").directive("uiGmapMapControl", [
    "uiGmapControl", function(Control) {
      return new Control();
    }
  ]);

}).call(this);
;
/*
@authors
Nicholas McCready - https://twitter.com/nmccready
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapDragZoom', [
    'uiGmapDragZoom', function(DragZoom) {
      return DragZoom;
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps').directive("uiGmapDrawingManager", [
    "uiGmapDrawingManager", function(DrawingManager) {
      return DrawingManager;
    }
  ]);

}).call(this);
;
/*
@authors
Nicholas McCready - https://twitter.com/nmccready
 * Brunt of the work is in DrawFreeHandChildModel
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapFreeDrawPolygons', [
    'uiGmapApiFreeDrawPolygons', function(FreeDrawPolygons) {
      return new FreeDrawPolygons();
    }
  ]);

}).call(this);
;
/*
Map Layer directive

This directive is used to create any type of Layer from the google maps sdk.
This directive creates a new scope.

{attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module("uiGmapgoogle-maps").directive("uiGmapMapType", [
    "$timeout", "uiGmapLogger", "uiGmapMapTypeParentModel", function($timeout, Logger, MapTypeParentModel) {
      var MapType;
      MapType = (function() {
        function MapType() {
          this.link = bind(this.link, this);
          this.$log = Logger;
          this.restrict = "EMA";
          this.require = '^' + 'uiGmapGoogleMap';
          this.priority = -1;
          this.transclude = true;
          this.template = '<span class=\"angular-google-map-layer\" ng-transclude></span>';
          this.replace = true;
          this.scope = {
            show: "=show",
            options: '=options',
            refresh: '=refresh',
            id: '@'
          };
        }

        MapType.prototype.link = function(scope, element, attrs, mapCtrl) {
          return mapCtrl.getScope().deferred.promise.then((function(_this) {
            return function(map) {
              return new MapTypeParentModel(scope, element, attrs, map);
            };
          })(this));
        };

        return MapType;

      })();
      return new MapType();
    }
  ]);

}).call(this);
;
/*
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
Rick Huizinga - https://plus.google.com/+RickHuizinga
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapPolygons', [
    'uiGmapPolygons', function(Polygons) {
      return new Polygons();
    }
  ]);

}).call(this);
;
/*
@authors:
- Nicolas Laplante https://plus.google.com/108189012221374960701
- Nicholas McCready - https://twitter.com/nmccready
- Carrie Kengle - http://about.me/carrie
 */


/*
Places Search Box directive

This directive is used to create a Places Search Box.
This directive creates a new scope.

{attribute input required}  HTMLInputElement
{attribute options optional} The options that can be set on a SearchBox object (google.maps.places.SearchBoxOptions object specification)
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('uiGmapgoogle-maps').directive('uiGmapSearchBox', [
    'uiGmapGoogleMapApi', 'uiGmapLogger', 'uiGmapSearchBoxParentModel', '$http', '$templateCache', '$compile', function(GoogleMapApi, Logger, SearchBoxParentModel, $http, $templateCache, $compile) {
      var SearchBox;
      SearchBox = (function() {
        SearchBox.prototype.require = 'ngModel';

        function SearchBox() {
          this.link = bind(this.link, this);
          this.$log = Logger;
          this.restrict = 'EMA';
          this.require = '^' + 'uiGmapGoogleMap';
          this.priority = -1;
          this.transclude = true;
          this.template = '<span class=\'angular-google-map-search\' ng-transclude></span>';
          this.replace = true;
          this.scope = {
            template: '=template',
            events: '=events',
            position: '=?position',
            options: '=?options',
            parentdiv: '=?parentdiv',
            ngModel: "=?"
          };
        }

        SearchBox.prototype.link = function(scope, element, attrs, mapCtrl) {
          return GoogleMapApi.then((function(_this) {
            return function(maps) {
              if (scope.template == null) {
                $templateCache.put('uigmap-searchbox-default.tpl.html', '<input type="text">');
                scope.template = 'uigmap-searchbox-default.tpl.html';
              }
              return $http.get(scope.template, {
                cache: $templateCache
              }).success(function(template) {
                if (angular.isUndefined(scope.events)) {
                  _this.$log.error('searchBox: the events property is required');
                  return;
                }
                return mapCtrl.getScope().deferred.promise.then(function(map) {
                  var ctrlPosition;
                  ctrlPosition = angular.isDefined(scope.position) ? scope.position.toUpperCase().replace(/-/g, '_') : 'TOP_LEFT';
                  if (!maps.ControlPosition[ctrlPosition]) {
                    _this.$log.error('searchBox: invalid position property');
                    return;
                  }
                  return new SearchBoxParentModel(scope, element, attrs, map, ctrlPosition, $compile(template)(scope));
                });
              });
            };
          })(this));
        };

        return SearchBox;

      })();
      return new SearchBox();
    }
  ]);

}).call(this);
;(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapShow', [
    '$animate', 'uiGmapLogger', function($animate, $log) {
      return {
        scope: {
          'uiGmapShow': '=',
          'uiGmapAfterShow': '&',
          'uiGmapAfterHide': '&'
        },
        link: function(scope, element) {
          var angular_post_1_3_handle, angular_pre_1_3_handle, handle;
          angular_post_1_3_handle = function(animateAction, cb) {
            return $animate[animateAction](element, 'ng-hide').then(function() {
              return cb();
            });
          };
          angular_pre_1_3_handle = function(animateAction, cb) {
            return $animate[animateAction](element, 'ng-hide', cb);
          };
          handle = function(animateAction, cb) {
            if (angular.version.major > 1) {
              return $log.error("uiGmapShow is not supported for Angular Major greater than 1.\nYour Major is " + angular.version.major + "\"");
            }
            if (angular.version.major === 1 && angular.version.minor < 3) {
              return angular_pre_1_3_handle(animateAction, cb);
            }
            return angular_post_1_3_handle(animateAction, cb);
          };
          return scope.$watch('uiGmapShow', function(show) {
            if (show) {
              handle('removeClass', scope.uiGmapAfterShow);
            }
            if (!show) {
              return handle('addClass', scope.uiGmapAfterHide);
            }
          });
        }
      };
    }
  ]);

}).call(this);
;
/*
@authors:
- Nicholas McCready - https://twitter.com/nmccready
 */


/*
StreetViewPanorama Directive to care of basic initialization of StreetViewPanorama
 */

(function() {
  angular.module('uiGmapgoogle-maps').directive('uiGmapStreetViewPanorama', [
    'uiGmapGoogleMapApi', 'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapEventsHelper', function(GoogleMapApi, $log, GmapUtil, EventsHelper) {
      var name;
      name = 'uiGmapStreetViewPanorama';
      return {
        restrict: 'EMA',
        template: '<div class="angular-google-map-street-view-panorama"></div>',
        replace: true,
        scope: {
          focalcoord: '=',
          radius: '=?',
          events: '=?',
          options: '=?',
          control: '=?',
          povoptions: '=?',
          imagestatus: '='
        },
        link: function(scope, element, attrs) {
          return GoogleMapApi.then((function(_this) {
            return function(maps) {
              var clean, create, didCreateOptionsFromDirective, firstTime, handleSettings, listeners, opts, pano, povOpts, sv;
              pano = void 0;
              sv = void 0;
              didCreateOptionsFromDirective = false;
              listeners = void 0;
              opts = null;
              povOpts = null;
              clean = function() {
                EventsHelper.removeEvents(listeners);
                if (pano != null) {
                  pano.unbind('position');
                  pano.setVisible(false);
                }
                if (sv != null) {
                  if ((sv != null ? sv.setVisible : void 0) != null) {
                    sv.setVisible(false);
                  }
                  return sv = void 0;
                }
              };
              handleSettings = function(perspectivePoint, focalPoint) {
                var heading;
                heading = google.maps.geometry.spherical.computeHeading(perspectivePoint, focalPoint);
                didCreateOptionsFromDirective = true;
                scope.radius = scope.radius || 50;
                povOpts = angular.extend({
                  heading: heading,
                  zoom: 1,
                  pitch: 0
                }, scope.povoptions || {});
                opts = opts = angular.extend({
                  navigationControl: false,
                  addressControl: false,
                  linksControl: false,
                  position: perspectivePoint,
                  pov: povOpts,
                  visible: true
                }, scope.options || {});
                return didCreateOptionsFromDirective = false;
              };
              create = function() {
                var focalPoint;
                if (!scope.focalcoord) {
                  $log.error(name + ": focalCoord needs to be defined");
                  return;
                }
                if (!scope.radius) {
                  $log.error(name + ": needs a radius to set the camera view from its focal target.");
                  return;
                }
                clean();
                if (sv == null) {
                  sv = new google.maps.StreetViewService();
                }
                if (scope.events) {
                  listeners = EventsHelper.setEvents(sv, scope, scope);
                }
                focalPoint = GmapUtil.getCoords(scope.focalcoord);
                return sv.getPanoramaByLocation(focalPoint, scope.radius, function(streetViewPanoramaData, status) {
                  var ele, perspectivePoint, ref;
                  if (scope.imagestatus != null) {
                    scope.imagestatus = status;
                  }
                  if (((ref = scope.events) != null ? ref.image_status_changed : void 0) != null) {
                    scope.events.image_status_changed(sv, 'image_status_changed', scope, status);
                  }
                  if (status === "OK") {
                    perspectivePoint = streetViewPanoramaData.location.latLng;
                    handleSettings(perspectivePoint, focalPoint);
                    ele = element[0];
                    return pano = new google.maps.StreetViewPanorama(ele, opts);
                  }
                });
              };
              if (scope.control != null) {
                scope.control.getOptions = function() {
                  return opts;
                };
                scope.control.getPovOptions = function() {
                  return povOpts;
                };
                scope.control.getGObject = function() {
                  return sv;
                };
                scope.control.getGPano = function() {
                  return pano;
                };
              }
              scope.$watch('options', function(newValue, oldValue) {
                if (newValue === oldValue || newValue === opts || didCreateOptionsFromDirective) {
                  return;
                }
                return create();
              });
              firstTime = true;
              scope.$watch('focalcoord', function(newValue, oldValue) {
                if (newValue === oldValue && !firstTime) {
                  return;
                }
                if (newValue == null) {
                  return;
                }
                firstTime = false;
                return create();
              });
              return scope.$on('$destroy', function() {
                return clean();
              });
            };
          })(this));
        }
      };
    }
  ]);

}).call(this);
;angular.module('uiGmapgoogle-maps.wrapped')
.service('uiGmapuuid', function() {
  //BEGIN REPLACE
  /* istanbul ignore next */
  /*
 Version: core-1.0
 The MIT License: Copyright (c) 2012 LiosK.
*/
function UUID(){}UUID.generate=function(){var a=UUID._gri,b=UUID._ha;return b(a(32),8)+"-"+b(a(16),4)+"-"+b(16384|a(12),4)+"-"+b(32768|a(14),4)+"-"+b(a(48),12)};UUID._gri=function(a){return 0>a?NaN:30>=a?0|Math.random()*(1<<a):53>=a?(0|1073741824*Math.random())+1073741824*(0|Math.random()*(1<<a-30)):NaN};UUID._ha=function(a,b){for(var c=a.toString(16),d=b-c.length,e="0";0<d;d>>>=1,e+=e)d&1&&(c=e+c);return c};

  //END REPLACE
return UUID;
});
;// wrap the utility libraries needed in ./lib
// http://google-maps-utility-library-v3.googlecode.com/svn/
angular.module('uiGmapgoogle-maps.wrapped')
.service('uiGmapGoogleMapsUtilV3', function () {
  return {
    init: _.once(function () {
      //BEGIN REPLACE
      /* istanbul ignore next */
      +function(){
      

        //TODO: export / passthese on in the service instead of window
        window.InfoBox = InfoBox;
        window.Cluster = Cluster;
        window.ClusterIcon = ClusterIcon;
        window.MarkerClusterer = MarkerClusterer;
        window.MarkerLabel_ = MarkerLabel_;
        window.MarkerWithLabel = MarkerWithLabel;
        window.RichMarker = RichMarker;
      }();
      //END REPLACE
    })
  };
});
;/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* istanbul ignore next */
	angular.module('uiGmapgoogle-maps.wrapped')
	.service('uiGmapDataStructures', function() {
	return {
	  Graph: __webpack_require__(1).Graph,
	  Queue: __webpack_require__(1).Queue
	};
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  module.exports = {
	    Graph: __webpack_require__(2),
	    Heap: __webpack_require__(3),
	    LinkedList: __webpack_require__(4),
	    Map: __webpack_require__(5),
	    Queue: __webpack_require__(6),
	    RedBlackTree: __webpack_require__(7),
	    Trie: __webpack_require__(8)
	  };

	}).call(this);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	Graph implemented as a modified incidence list. O(1) for every typical
	operation except `removeNode()` at O(E) where E is the number of edges.

	## Overview example:

	```js
	var graph = new Graph;
	graph.addNode('A'); // => a node object. For more info, log the output or check
	                    // the documentation for addNode
	graph.addNode('B');
	graph.addNode('C');
	graph.addEdge('A', 'C'); // => an edge object
	graph.addEdge('A', 'B');
	graph.getEdge('B', 'A'); // => undefined. Directed edge!
	graph.getEdge('A', 'B'); // => the edge object previously added
	graph.getEdge('A', 'B').weight = 2 // weight is the only built-in handy property
	                                   // of an edge object. Feel free to attach
	                                   // other properties
	graph.getInEdgesOf('B'); // => array of edge objects, in this case only one;
	                         // connecting A to B
	graph.getOutEdgesOf('A'); // => array of edge objects, one to B and one to C
	graph.getAllEdgesOf('A'); // => all the in and out edges. Edge directed toward
	                          // the node itself are only counted once
	forEachNode(function(nodeObject) {
	  console.log(node);
	});
	forEachEdge(function(edgeObject) {
	  console.log(edgeObject);
	});
	graph.removeNode('C'); // => 'C'. The edge between A and C also removed
	graph.removeEdge('A', 'B'); // => the edge object removed
	```

	## Properties:

	- nodeSize: total number of nodes.
	- edgeSize: total number of edges.
	*/


	(function() {
	  var Graph,
	    __hasProp = {}.hasOwnProperty;

	  Graph = (function() {
	    function Graph() {
	      this._nodes = {};
	      this.nodeSize = 0;
	      this.edgeSize = 0;
	    }

	    Graph.prototype.addNode = function(id) {
	      /*
	      The `id` is a unique identifier for the node, and should **not** change
	      after it's added. It will be used for adding, retrieving and deleting
	      related edges too.
	      
	      **Note** that, internally, the ids are kept in an object. JavaScript's
	      object hashes the id `'2'` and `2` to the same key, so please stick to a
	      simple id data type such as number or string.
	      
	      _Returns:_ the node object. Feel free to attach additional custom properties
	      on it for graph algorithms' needs. **Undefined if node id already exists**,
	      as to avoid accidental overrides.
	      */

	      if (!this._nodes[id]) {
	        this.nodeSize++;
	        return this._nodes[id] = {
	          _outEdges: {},
	          _inEdges: {}
	        };
	      }
	    };

	    Graph.prototype.getNode = function(id) {
	      /*
	      _Returns:_ the node object. Feel free to attach additional custom properties
	      on it for graph algorithms' needs.
	      */

	      return this._nodes[id];
	    };

	    Graph.prototype.removeNode = function(id) {
	      /*
	      _Returns:_ the node object removed, or undefined if it didn't exist in the
	      first place.
	      */

	      var inEdgeId, nodeToRemove, outEdgeId, _ref, _ref1;
	      nodeToRemove = this._nodes[id];
	      if (!nodeToRemove) {
	        return;
	      } else {
	        _ref = nodeToRemove._outEdges;
	        for (outEdgeId in _ref) {
	          if (!__hasProp.call(_ref, outEdgeId)) continue;
	          this.removeEdge(id, outEdgeId);
	        }
	        _ref1 = nodeToRemove._inEdges;
	        for (inEdgeId in _ref1) {
	          if (!__hasProp.call(_ref1, inEdgeId)) continue;
	          this.removeEdge(inEdgeId, id);
	        }
	        this.nodeSize--;
	        delete this._nodes[id];
	      }
	      return nodeToRemove;
	    };

	    Graph.prototype.addEdge = function(fromId, toId, weight) {
	      var edgeToAdd, fromNode, toNode;
	      if (weight == null) {
	        weight = 1;
	      }
	      /*
	      `fromId` and `toId` are the node id specified when it was created using
	      `addNode()`. `weight` is optional and defaults to 1. Ignoring it effectively
	      makes this an unweighted graph. Under the hood, `weight` is just a normal
	      property of the edge object.
	      
	      _Returns:_ the edge object created. Feel free to attach additional custom
	      properties on it for graph algorithms' needs. **Or undefined** if the nodes
	      of id `fromId` or `toId` aren't found, or if an edge already exists between
	      the two nodes.
	      */

	      if (this.getEdge(fromId, toId)) {
	        return;
	      }
	      fromNode = this._nodes[fromId];
	      toNode = this._nodes[toId];
	      if (!fromNode || !toNode) {
	        return;
	      }
	      edgeToAdd = {
	        weight: weight
	      };
	      fromNode._outEdges[toId] = edgeToAdd;
	      toNode._inEdges[fromId] = edgeToAdd;
	      this.edgeSize++;
	      return edgeToAdd;
	    };

	    Graph.prototype.getEdge = function(fromId, toId) {
	      /*
	      _Returns:_ the edge object, or undefined if the nodes of id `fromId` or
	      `toId` aren't found.
	      */

	      var fromNode, toNode;
	      fromNode = this._nodes[fromId];
	      toNode = this._nodes[toId];
	      if (!fromNode || !toNode) {

	      } else {
	        return fromNode._outEdges[toId];
	      }
	    };

	    Graph.prototype.removeEdge = function(fromId, toId) {
	      /*
	      _Returns:_ the edge object removed, or undefined of edge wasn't found.
	      */

	      var edgeToDelete, fromNode, toNode;
	      fromNode = this._nodes[fromId];
	      toNode = this._nodes[toId];
	      edgeToDelete = this.getEdge(fromId, toId);
	      if (!edgeToDelete) {
	        return;
	      }
	      delete fromNode._outEdges[toId];
	      delete toNode._inEdges[fromId];
	      this.edgeSize--;
	      return edgeToDelete;
	    };

	    Graph.prototype.getInEdgesOf = function(nodeId) {
	      /*
	      _Returns:_ an array of edge objects that are directed toward the node, or
	      empty array if no such edge or node exists.
	      */

	      var fromId, inEdges, toNode, _ref;
	      toNode = this._nodes[nodeId];
	      inEdges = [];
	      _ref = toNode != null ? toNode._inEdges : void 0;
	      for (fromId in _ref) {
	        if (!__hasProp.call(_ref, fromId)) continue;
	        inEdges.push(this.getEdge(fromId, nodeId));
	      }
	      return inEdges;
	    };

	    Graph.prototype.getOutEdgesOf = function(nodeId) {
	      /*
	      _Returns:_ an array of edge objects that go out of the node, or empty array
	      if no such edge or node exists.
	      */

	      var fromNode, outEdges, toId, _ref;
	      fromNode = this._nodes[nodeId];
	      outEdges = [];
	      _ref = fromNode != null ? fromNode._outEdges : void 0;
	      for (toId in _ref) {
	        if (!__hasProp.call(_ref, toId)) continue;
	        outEdges.push(this.getEdge(nodeId, toId));
	      }
	      return outEdges;
	    };

	    Graph.prototype.getAllEdgesOf = function(nodeId) {
	      /*
	      **Note:** not the same as concatenating `getInEdgesOf()` and
	      `getOutEdgesOf()`. Some nodes might have an edge pointing toward itself.
	      This method solves that duplication.
	      
	      _Returns:_ an array of edge objects linked to the node, no matter if they're
	      outgoing or coming. Duplicate edge created by self-pointing nodes are
	      removed. Only one copy stays. Empty array if node has no edge.
	      */

	      var i, inEdges, outEdges, selfEdge, _i, _ref, _ref1;
	      inEdges = this.getInEdgesOf(nodeId);
	      outEdges = this.getOutEdgesOf(nodeId);
	      if (inEdges.length === 0) {
	        return outEdges;
	      }
	      selfEdge = this.getEdge(nodeId, nodeId);
	      for (i = _i = 0, _ref = inEdges.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
	        if (inEdges[i] === selfEdge) {
	          _ref1 = [inEdges[inEdges.length - 1], inEdges[i]], inEdges[i] = _ref1[0], inEdges[inEdges.length - 1] = _ref1[1];
	          inEdges.pop();
	          break;
	        }
	      }
	      return inEdges.concat(outEdges);
	    };

	    Graph.prototype.forEachNode = function(operation) {
	      /*
	      Traverse through the graph in an arbitrary manner, visiting each node once.
	      Pass a function of the form `fn(nodeObject, nodeId)`.
	      
	      _Returns:_ undefined.
	      */

	      var nodeId, nodeObject, _ref;
	      _ref = this._nodes;
	      for (nodeId in _ref) {
	        if (!__hasProp.call(_ref, nodeId)) continue;
	        nodeObject = _ref[nodeId];
	        operation(nodeObject, nodeId);
	      }
	    };

	    Graph.prototype.forEachEdge = function(operation) {
	      /*
	      Traverse through the graph in an arbitrary manner, visiting each edge once.
	      Pass a function of the form `fn(edgeObject)`.
	      
	      _Returns:_ undefined.
	      */

	      var edgeObject, nodeId, nodeObject, toId, _ref, _ref1;
	      _ref = this._nodes;
	      for (nodeId in _ref) {
	        if (!__hasProp.call(_ref, nodeId)) continue;
	        nodeObject = _ref[nodeId];
	        _ref1 = nodeObject._outEdges;
	        for (toId in _ref1) {
	          if (!__hasProp.call(_ref1, toId)) continue;
	          edgeObject = _ref1[toId];
	          operation(edgeObject);
	        }
	      }
	    };

	    return Graph;

	  })();

	  module.exports = Graph;

	}).call(this);


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	Minimum heap, i.e. smallest node at root.

	**Note:** does not accept null or undefined. This is by design. Those values
	cause comparison problems and might report false negative during extraction.

	## Overview example:

	```js
	var heap = new Heap([5, 6, 3, 4]);
	heap.add(10); // => 10
	heap.removeMin(); // => 3
	heap.peekMin(); // => 4
	```

	## Properties:

	- size: total number of items.
	*/


	(function() {
	  var Heap, _leftChild, _parent, _rightChild;

	  Heap = (function() {
	    function Heap(dataToHeapify) {
	      var i, item, _i, _j, _len, _ref;
	      if (dataToHeapify == null) {
	        dataToHeapify = [];
	      }
	      /*
	      Pass an optional array to be heapified. Takes only O(n) time.
	      */

	      this._data = [void 0];
	      for (_i = 0, _len = dataToHeapify.length; _i < _len; _i++) {
	        item = dataToHeapify[_i];
	        if (item != null) {
	          this._data.push(item);
	        }
	      }
	      if (this._data.length > 1) {
	        for (i = _j = 2, _ref = this._data.length; 2 <= _ref ? _j < _ref : _j > _ref; i = 2 <= _ref ? ++_j : --_j) {
	          this._upHeap(i);
	        }
	      }
	      this.size = this._data.length - 1;
	    }

	    Heap.prototype.add = function(value) {
	      /*
	      **Remember:** rejects null and undefined for mentioned reasons.
	      
	      _Returns:_ the value added.
	      */

	      if (value == null) {
	        return;
	      }
	      this._data.push(value);
	      this._upHeap(this._data.length - 1);
	      this.size++;
	      return value;
	    };

	    Heap.prototype.removeMin = function() {
	      /*
	      _Returns:_ the smallest item (the root).
	      */

	      var min;
	      if (this._data.length === 1) {
	        return;
	      }
	      this.size--;
	      if (this._data.length === 2) {
	        return this._data.pop();
	      }
	      min = this._data[1];
	      this._data[1] = this._data.pop();
	      this._downHeap();
	      return min;
	    };

	    Heap.prototype.peekMin = function() {
	      /*
	      Check the smallest item without removing it.
	      
	      _Returns:_ the smallest item (the root).
	      */

	      return this._data[1];
	    };

	    Heap.prototype._upHeap = function(index) {
	      var valueHolder, _ref;
	      valueHolder = this._data[index];
	      while (this._data[index] < this._data[_parent(index)] && index > 1) {
	        _ref = [this._data[_parent(index)], this._data[index]], this._data[index] = _ref[0], this._data[_parent(index)] = _ref[1];
	        index = _parent(index);
	      }
	    };

	    Heap.prototype._downHeap = function() {
	      var currentIndex, smallerChildIndex, _ref;
	      currentIndex = 1;
	      while (_leftChild(currentIndex < this._data.length)) {
	        smallerChildIndex = _leftChild(currentIndex);
	        if (smallerChildIndex < this._data.length - 1) {
	          if (this._data[_rightChild(currentIndex)] < this._data[smallerChildIndex]) {
	            smallerChildIndex = _rightChild(currentIndex);
	          }
	        }
	        if (this._data[smallerChildIndex] < this._data[currentIndex]) {
	          _ref = [this._data[currentIndex], this._data[smallerChildIndex]], this._data[smallerChildIndex] = _ref[0], this._data[currentIndex] = _ref[1];
	          currentIndex = smallerChildIndex;
	        } else {
	          break;
	        }
	      }
	    };

	    return Heap;

	  })();

	  _parent = function(index) {
	    return index >> 1;
	  };

	  _leftChild = function(index) {
	    return index << 1;
	  };

	  _rightChild = function(index) {
	    return (index << 1) + 1;
	  };

	  module.exports = Heap;

	}).call(this);


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
	Doubly Linked.

	## Overview example:

	```js
	var list = new LinkedList([5, 4, 9]);
	list.add(12); // => 12
	list.head.next.value; // => 4
	list.tail.value; // => 12
	list.at(-1); // => 12
	list.removeAt(2); // => 9
	list.remove(4); // => 4
	list.indexOf(5); // => 0
	list.add(5, 1); // => 5. Second 5 at position 1.
	list.indexOf(5, 1); // => 1
	```

	## Properties:

	- head: first item.
	- tail: last item.
	- size: total number of items.
	- item.value: value passed to the item when calling `add()`.
	- item.prev: previous item.
	- item.next: next item.
	*/


	(function() {
	  var LinkedList;

	  LinkedList = (function() {
	    function LinkedList(valuesToAdd) {
	      var value, _i, _len;
	      if (valuesToAdd == null) {
	        valuesToAdd = [];
	      }
	      /*
	      Can pass an array of elements to link together during `new LinkedList()`
	      initiation.
	      */

	      this.head = {
	        prev: void 0,
	        value: void 0,
	        next: void 0
	      };
	      this.tail = {
	        prev: void 0,
	        value: void 0,
	        next: void 0
	      };
	      this.size = 0;
	      for (_i = 0, _len = valuesToAdd.length; _i < _len; _i++) {
	        value = valuesToAdd[_i];
	        this.add(value);
	      }
	    }

	    LinkedList.prototype.at = function(position) {
	      /*
	      Get the item at `position` (optional). Accepts negative index:
	      
	      ```js
	      myList.at(-1); // Returns the last element.
	      ```
	      However, passing a negative index that surpasses the boundary will return
	      undefined:
	      
	      ```js
	      myList = new LinkedList([2, 6, 8, 3])
	      myList.at(-5); // Undefined.
	      myList.at(-4); // 2.
	      ```
	      _Returns:_ item gotten, or undefined if not found.
	      */

	      var currentNode, i, _i, _j, _ref;
	      if (!((-this.size <= position && position < this.size))) {
	        return;
	      }
	      position = this._adjust(position);
	      if (position * 2 < this.size) {
	        currentNode = this.head;
	        for (i = _i = 1; _i <= position; i = _i += 1) {
	          currentNode = currentNode.next;
	        }
	      } else {
	        currentNode = this.tail;
	        for (i = _j = 1, _ref = this.size - position - 1; _j <= _ref; i = _j += 1) {
	          currentNode = currentNode.prev;
	        }
	      }
	      return currentNode;
	    };

	    LinkedList.prototype.add = function(value, position) {
	      var currentNode, nodeToAdd, _ref, _ref1, _ref2;
	      if (position == null) {
	        position = this.size;
	      }
	      /*
	      Add a new item at `position` (optional). Defaults to adding at the end.
	      `position`, just like in `at()`, can be negative (within the negative
	      boundary). Position specifies the place the value's going to be, and the old
	      node will be pushed higher. `add(-2)` on list of size 7 is the same as
	      `add(5)`.
	      
	      _Returns:_ item added.
	      */

	      if (!((-this.size <= position && position <= this.size))) {
	        return;
	      }
	      nodeToAdd = {
	        value: value
	      };
	      position = this._adjust(position);
	      if (this.size === 0) {
	        this.head = nodeToAdd;
	      } else {
	        if (position === 0) {
	          _ref = [nodeToAdd, this.head, nodeToAdd], this.head.prev = _ref[0], nodeToAdd.next = _ref[1], this.head = _ref[2];
	        } else {
	          currentNode = this.at(position - 1);
	          _ref1 = [currentNode.next, nodeToAdd, nodeToAdd, currentNode], nodeToAdd.next = _ref1[0], (_ref2 = currentNode.next) != null ? _ref2.prev = _ref1[1] : void 0, currentNode.next = _ref1[2], nodeToAdd.prev = _ref1[3];
	        }
	      }
	      if (position === this.size) {
	        this.tail = nodeToAdd;
	      }
	      this.size++;
	      return value;
	    };

	    LinkedList.prototype.removeAt = function(position) {
	      var currentNode, valueToReturn, _ref;
	      if (position == null) {
	        position = this.size - 1;
	      }
	      /*
	      Remove an item at index `position` (optional). Defaults to the last item.
	      Index can be negative (within the boundary).
	      
	      _Returns:_ item removed.
	      */

	      if (!((-this.size <= position && position < this.size))) {
	        return;
	      }
	      if (this.size === 0) {
	        return;
	      }
	      position = this._adjust(position);
	      if (this.size === 1) {
	        valueToReturn = this.head.value;
	        this.head.value = this.tail.value = void 0;
	      } else {
	        if (position === 0) {
	          valueToReturn = this.head.value;
	          this.head = this.head.next;
	          this.head.prev = void 0;
	        } else {
	          currentNode = this.at(position);
	          valueToReturn = currentNode.value;
	          currentNode.prev.next = currentNode.next;
	          if ((_ref = currentNode.next) != null) {
	            _ref.prev = currentNode.prev;
	          }
	          if (position === this.size - 1) {
	            this.tail = currentNode.prev;
	          }
	        }
	      }
	      this.size--;
	      return valueToReturn;
	    };

	    LinkedList.prototype.remove = function(value) {
	      /*
	      Remove the item using its value instead of position. **Will remove the fist
	      occurrence of `value`.**
	      
	      _Returns:_ the value, or undefined if value's not found.
	      */

	      var currentNode;
	      if (value == null) {
	        return;
	      }
	      currentNode = this.head;
	      while (currentNode && currentNode.value !== value) {
	        currentNode = currentNode.next;
	      }
	      if (!currentNode) {
	        return;
	      }
	      if (this.size === 1) {
	        this.head.value = this.tail.value = void 0;
	      } else if (currentNode === this.head) {
	        this.head = this.head.next;
	        this.head.prev = void 0;
	      } else if (currentNode === this.tail) {
	        this.tail = this.tail.prev;
	        this.tail.next = void 0;
	      } else {
	        currentNode.prev.next = currentNode.next;
	        currentNode.next.prev = currentNode.prev;
	      }
	      this.size--;
	      return value;
	    };

	    LinkedList.prototype.indexOf = function(value, startingPosition) {
	      var currentNode, position;
	      if (startingPosition == null) {
	        startingPosition = 0;
	      }
	      /*
	      Find the index of an item, similarly to `array.indexOf()`. Defaults to start
	      searching from the beginning, by can start at another position by passing
	      `startingPosition`. This parameter can also be negative; but unlike the
	      other methods of this class, `startingPosition` (optional) can be as small
	      as desired; a value of -999 for a list of size 5 will start searching
	      normally, at the beginning.
	      
	      **Note:** searches forwardly, **not** backwardly, i.e:
	      
	      ```js
	      var myList = new LinkedList([2, 3, 1, 4, 3, 5])
	      myList.indexOf(3, -3); // Returns 4, not 1
	      ```
	      _Returns:_ index of item found, or -1 if not found.
	      */

	      if (((this.head.value == null) && !this.head.next) || startingPosition >= this.size) {
	        return -1;
	      }
	      startingPosition = Math.max(0, this._adjust(startingPosition));
	      currentNode = this.at(startingPosition);
	      position = startingPosition;
	      while (currentNode) {
	        if (currentNode.value === value) {
	          break;
	        }
	        currentNode = currentNode.next;
	        position++;
	      }
	      if (position === this.size) {
	        return -1;
	      } else {
	        return position;
	      }
	    };

	    LinkedList.prototype._adjust = function(position) {
	      if (position < 0) {
	        return this.size + position;
	      } else {
	        return position;
	      }
	    };

	    return LinkedList;

	  })();

	  module.exports = LinkedList;

	}).call(this);


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	Kind of a stopgap measure for the upcoming [JavaScript
	Map](http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets)

	**Note:** due to JavaScript's limitations, hashing something other than Boolean,
	Number, String, Undefined, Null, RegExp, Function requires a hack that inserts a
	hidden unique property into the object. This means `set`, `get`, `has` and
	`delete` must employ the same object, and not a mere identical copy as in the
	case of, say, a string.

	## Overview example:

	```js
	var map = new Map({'alice': 'wonderland', 20: 'ok'});
	map.set('20', 5); // => 5
	map.get('20'); // => 5
	map.has('alice'); // => true
	map.delete(20) // => true
	var arr = [1, 2];
	map.add(arr, 'goody'); // => 'goody'
	map.has(arr); // => true
	map.has([1, 2]); // => false. Needs to compare by reference
	map.forEach(function(key, value) {
	  console.log(key, value);
	});
	```

	## Properties:

	- size: The total number of `(key, value)` pairs.
	*/


	(function() {
	  var Map, SPECIAL_TYPE_KEY_PREFIX, _extractDataType, _isSpecialType,
	    __hasProp = {}.hasOwnProperty;

	  SPECIAL_TYPE_KEY_PREFIX = '_mapId_';

	  Map = (function() {
	    Map._mapIdTracker = 0;

	    Map._newMapId = function() {
	      return this._mapIdTracker++;
	    };

	    function Map(objectToMap) {
	      /*
	      Pass an optional object whose (key, value) pair will be hashed. **Careful**
	      not to pass something like {5: 'hi', '5': 'hello'}, since JavaScript's
	      native object behavior will crush the first 5 property before it gets to
	      constructor.
	      */

	      var key, value;
	      this._content = {};
	      this._itemId = 0;
	      this._id = Map._newMapId();
	      this.size = 0;
	      for (key in objectToMap) {
	        if (!__hasProp.call(objectToMap, key)) continue;
	        value = objectToMap[key];
	        this.set(key, value);
	      }
	    }

	    Map.prototype.hash = function(key, makeHash) {
	      var propertyForMap, type;
	      if (makeHash == null) {
	        makeHash = false;
	      }
	      /*
	      The hash function for hashing keys is public. Feel free to replace it with
	      your own. The `makeHash` parameter is optional and accepts a boolean
	      (defaults to `false`) indicating whether or not to produce a new hash (for
	      the first use, naturally).
	      
	      _Returns:_ the hash.
	      */

	      type = _extractDataType(key);
	      if (_isSpecialType(key)) {
	        propertyForMap = SPECIAL_TYPE_KEY_PREFIX + this._id;
	        if (makeHash && !key[propertyForMap]) {
	          key[propertyForMap] = this._itemId++;
	        }
	        return propertyForMap + '_' + key[propertyForMap];
	      } else {
	        return type + '_' + key;
	      }
	    };

	    Map.prototype.set = function(key, value) {
	      /*
	      _Returns:_ value.
	      */

	      if (!this.has(key)) {
	        this.size++;
	      }
	      this._content[this.hash(key, true)] = [value, key];
	      return value;
	    };

	    Map.prototype.get = function(key) {
	      /*
	      _Returns:_ value corresponding to the key, or undefined if not found.
	      */

	      var _ref;
	      return (_ref = this._content[this.hash(key)]) != null ? _ref[0] : void 0;
	    };

	    Map.prototype.has = function(key) {
	      /*
	      Check whether a value exists for the key.
	      
	      _Returns:_ true or false.
	      */

	      return this.hash(key) in this._content;
	    };

	    Map.prototype["delete"] = function(key) {
	      /*
	      Remove the (key, value) pair.
	      
	      _Returns:_ **true or false**. Unlike most of this library, this method
	      doesn't return the deleted value. This is so that it conforms to the future
	      JavaScript `map.delete()`'s behavior.
	      */

	      var hashedKey;
	      hashedKey = this.hash(key);
	      if (hashedKey in this._content) {
	        delete this._content[hashedKey];
	        if (_isSpecialType(key)) {
	          delete key[SPECIAL_TYPE_KEY_PREFIX + this._id];
	        }
	        this.size--;
	        return true;
	      }
	      return false;
	    };

	    Map.prototype.forEach = function(operation) {
	      /*
	      Traverse through the map. Pass a function of the form `fn(key, value)`.
	      
	      _Returns:_ undefined.
	      */

	      var key, value, _ref;
	      _ref = this._content;
	      for (key in _ref) {
	        if (!__hasProp.call(_ref, key)) continue;
	        value = _ref[key];
	        operation(value[1], value[0]);
	      }
	    };

	    return Map;

	  })();

	  _isSpecialType = function(key) {
	    var simpleHashableTypes, simpleType, type, _i, _len;
	    simpleHashableTypes = ['Boolean', 'Number', 'String', 'Undefined', 'Null', 'RegExp', 'Function'];
	    type = _extractDataType(key);
	    for (_i = 0, _len = simpleHashableTypes.length; _i < _len; _i++) {
	      simpleType = simpleHashableTypes[_i];
	      if (type === simpleType) {
	        return false;
	      }
	    }
	    return true;
	  };

	  _extractDataType = function(type) {
	    return Object.prototype.toString.apply(type).match(/\[object (.+)\]/)[1];
	  };

	  module.exports = Map;

	}).call(this);


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
	Amortized O(1) dequeue!

	## Overview example:

	```js
	var queue = new Queue([1, 6, 4]);
	queue.enqueue(10); // => 10
	queue.dequeue(); // => 1
	queue.dequeue(); // => 6
	queue.dequeue(); // => 4
	queue.peek(); // => 10
	queue.dequeue(); // => 10
	queue.peek(); // => undefined
	```

	## Properties:

	- size: The total number of items.
	*/


	(function() {
	  var Queue;

	  Queue = (function() {
	    function Queue(initialArray) {
	      if (initialArray == null) {
	        initialArray = [];
	      }
	      /*
	      Pass an optional array to be transformed into a queue. The item at index 0
	      is the first to be dequeued.
	      */

	      this._content = initialArray;
	      this._dequeueIndex = 0;
	      this.size = this._content.length;
	    }

	    Queue.prototype.enqueue = function(item) {
	      /*
	      _Returns:_ the item.
	      */

	      this.size++;
	      this._content.push(item);
	      return item;
	    };

	    Queue.prototype.dequeue = function() {
	      /*
	      _Returns:_ the dequeued item.
	      */

	      var itemToDequeue;
	      if (this.size === 0) {
	        return;
	      }
	      this.size--;
	      itemToDequeue = this._content[this._dequeueIndex];
	      this._dequeueIndex++;
	      if (this._dequeueIndex * 2 > this._content.length) {
	        this._content = this._content.slice(this._dequeueIndex);
	        this._dequeueIndex = 0;
	      }
	      return itemToDequeue;
	    };

	    Queue.prototype.peek = function() {
	      /*
	      Check the next item to be dequeued, without removing it.
	      
	      _Returns:_ the item.
	      */

	      return this._content[this._dequeueIndex];
	    };

	    return Queue;

	  })();

	  module.exports = Queue;

	}).call(this);


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	Credit to Wikipedia's article on [Red-black
	tree](http://en.wikipedia.org/wiki/Red–black_tree)

	**Note:** doesn't handle duplicate entries, undefined and null. This is by
	design.

	## Overview example:

	```js
	var rbt = new RedBlackTree([7, 5, 1, 8]);
	rbt.add(2); // => 2
	rbt.add(10); // => 10
	rbt.has(5); // => true
	rbt.peekMin(); // => 1
	rbt.peekMax(); // => 10
	rbt.removeMin(); // => 1
	rbt.removeMax(); // => 10
	rbt.remove(8); // => 8
	```

	## Properties:

	- size: The total number of items.
	*/


	(function() {
	  var BLACK, NODE_FOUND, NODE_TOO_BIG, NODE_TOO_SMALL, RED, RedBlackTree, STOP_SEARCHING, _findNode, _grandParentOf, _isLeft, _leftOrRight, _peekMaxNode, _peekMinNode, _siblingOf, _uncleOf;

	  NODE_FOUND = 0;

	  NODE_TOO_BIG = 1;

	  NODE_TOO_SMALL = 2;

	  STOP_SEARCHING = 3;

	  RED = 1;

	  BLACK = 2;

	  RedBlackTree = (function() {
	    function RedBlackTree(valuesToAdd) {
	      var value, _i, _len;
	      if (valuesToAdd == null) {
	        valuesToAdd = [];
	      }
	      /*
	      Pass an optional array to be turned into binary tree. **Note:** does not
	      accept duplicate, undefined and null.
	      */

	      this._root;
	      this.size = 0;
	      for (_i = 0, _len = valuesToAdd.length; _i < _len; _i++) {
	        value = valuesToAdd[_i];
	        if (value != null) {
	          this.add(value);
	        }
	      }
	    }

	    RedBlackTree.prototype.add = function(value) {
	      /*
	      Again, make sure to not pass a value already in the tree, or undefined, or
	      null.
	      
	      _Returns:_ value added.
	      */

	      var currentNode, foundNode, nodeToInsert, _ref;
	      if (value == null) {
	        return;
	      }
	      this.size++;
	      nodeToInsert = {
	        value: value,
	        _color: RED
	      };
	      if (!this._root) {
	        this._root = nodeToInsert;
	      } else {
	        foundNode = _findNode(this._root, function(node) {
	          if (value === node.value) {
	            return NODE_FOUND;
	          } else {
	            if (value < node.value) {
	              if (node._left) {
	                return NODE_TOO_BIG;
	              } else {
	                nodeToInsert._parent = node;
	                node._left = nodeToInsert;
	                return STOP_SEARCHING;
	              }
	            } else {
	              if (node._right) {
	                return NODE_TOO_SMALL;
	              } else {
	                nodeToInsert._parent = node;
	                node._right = nodeToInsert;
	                return STOP_SEARCHING;
	              }
	            }
	          }
	        });
	        if (foundNode != null) {
	          return;
	        }
	      }
	      currentNode = nodeToInsert;
	      while (true) {
	        if (currentNode === this._root) {
	          currentNode._color = BLACK;
	          break;
	        }
	        if (currentNode._parent._color === BLACK) {
	          break;
	        }
	        if (((_ref = _uncleOf(currentNode)) != null ? _ref._color : void 0) === RED) {
	          currentNode._parent._color = BLACK;
	          _uncleOf(currentNode)._color = BLACK;
	          _grandParentOf(currentNode)._color = RED;
	          currentNode = _grandParentOf(currentNode);
	          continue;
	        }
	        if (!_isLeft(currentNode) && _isLeft(currentNode._parent)) {
	          this._rotateLeft(currentNode._parent);
	          currentNode = currentNode._left;
	        } else if (_isLeft(currentNode) && !_isLeft(currentNode._parent)) {
	          this._rotateRight(currentNode._parent);
	          currentNode = currentNode._right;
	        }
	        currentNode._parent._color = BLACK;
	        _grandParentOf(currentNode)._color = RED;
	        if (_isLeft(currentNode)) {
	          this._rotateRight(_grandParentOf(currentNode));
	        } else {
	          this._rotateLeft(_grandParentOf(currentNode));
	        }
	        break;
	      }
	      return value;
	    };

	    RedBlackTree.prototype.has = function(value) {
	      /*
	      _Returns:_ true or false.
	      */

	      var foundNode;
	      foundNode = _findNode(this._root, function(node) {
	        if (value === node.value) {
	          return NODE_FOUND;
	        } else if (value < node.value) {
	          return NODE_TOO_BIG;
	        } else {
	          return NODE_TOO_SMALL;
	        }
	      });
	      if (foundNode) {
	        return true;
	      } else {
	        return false;
	      }
	    };

	    RedBlackTree.prototype.peekMin = function() {
	      /*
	      Check the minimum value without removing it.
	      
	      _Returns:_ the minimum value.
	      */

	      var _ref;
	      return (_ref = _peekMinNode(this._root)) != null ? _ref.value : void 0;
	    };

	    RedBlackTree.prototype.peekMax = function() {
	      /*
	      Check the maximum value without removing it.
	      
	      _Returns:_ the maximum value.
	      */

	      var _ref;
	      return (_ref = _peekMaxNode(this._root)) != null ? _ref.value : void 0;
	    };

	    RedBlackTree.prototype.remove = function(value) {
	      /*
	      _Returns:_ the value removed, or undefined if the value's not found.
	      */

	      var foundNode;
	      foundNode = _findNode(this._root, function(node) {
	        if (value === node.value) {
	          return NODE_FOUND;
	        } else if (value < node.value) {
	          return NODE_TOO_BIG;
	        } else {
	          return NODE_TOO_SMALL;
	        }
	      });
	      if (!foundNode) {
	        return;
	      }
	      this._removeNode(this._root, foundNode);
	      this.size--;
	      return value;
	    };

	    RedBlackTree.prototype.removeMin = function() {
	      /*
	      _Returns:_ smallest item removed, or undefined if tree's empty.
	      */

	      var nodeToRemove, valueToReturn;
	      nodeToRemove = _peekMinNode(this._root);
	      if (!nodeToRemove) {
	        return;
	      }
	      valueToReturn = nodeToRemove.value;
	      this._removeNode(this._root, nodeToRemove);
	      return valueToReturn;
	    };

	    RedBlackTree.prototype.removeMax = function() {
	      /*
	      _Returns:_ biggest item removed, or undefined if tree's empty.
	      */

	      var nodeToRemove, valueToReturn;
	      nodeToRemove = _peekMaxNode(this._root);
	      if (!nodeToRemove) {
	        return;
	      }
	      valueToReturn = nodeToRemove.value;
	      this._removeNode(this._root, nodeToRemove);
	      return valueToReturn;
	    };

	    RedBlackTree.prototype._removeNode = function(root, node) {
	      var sibling, successor, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
	      if (node._left && node._right) {
	        successor = _peekMinNode(node._right);
	        node.value = successor.value;
	        node = successor;
	      }
	      successor = node._left || node._right;
	      if (!successor) {
	        successor = {
	          color: BLACK,
	          _right: void 0,
	          _left: void 0,
	          isLeaf: true
	        };
	      }
	      successor._parent = node._parent;
	      if ((_ref = node._parent) != null) {
	        _ref[_leftOrRight(node)] = successor;
	      }
	      if (node._color === BLACK) {
	        if (successor._color === RED) {
	          successor._color = BLACK;
	          if (!successor._parent) {
	            this._root = successor;
	          }
	        } else {
	          while (true) {
	            if (!successor._parent) {
	              if (!successor.isLeaf) {
	                this._root = successor;
	              } else {
	                this._root = void 0;
	              }
	              break;
	            }
	            sibling = _siblingOf(successor);
	            if ((sibling != null ? sibling._color : void 0) === RED) {
	              successor._parent._color = RED;
	              sibling._color = BLACK;
	              if (_isLeft(successor)) {
	                this._rotateLeft(successor._parent);
	              } else {
	                this._rotateRight(successor._parent);
	              }
	            }
	            sibling = _siblingOf(successor);
	            if (successor._parent._color === BLACK && (!sibling || (sibling._color === BLACK && (!sibling._left || sibling._left._color === BLACK) && (!sibling._right || sibling._right._color === BLACK)))) {
	              if (sibling != null) {
	                sibling._color = RED;
	              }
	              if (successor.isLeaf) {
	                successor._parent[_leftOrRight(successor)] = void 0;
	              }
	              successor = successor._parent;
	              continue;
	            }
	            if (successor._parent._color === RED && (!sibling || (sibling._color === BLACK && (!sibling._left || ((_ref1 = sibling._left) != null ? _ref1._color : void 0) === BLACK) && (!sibling._right || ((_ref2 = sibling._right) != null ? _ref2._color : void 0) === BLACK)))) {
	              if (sibling != null) {
	                sibling._color = RED;
	              }
	              successor._parent._color = BLACK;
	              break;
	            }
	            if ((sibling != null ? sibling._color : void 0) === BLACK) {
	              if (_isLeft(successor) && (!sibling._right || sibling._right._color === BLACK) && ((_ref3 = sibling._left) != null ? _ref3._color : void 0) === RED) {
	                sibling._color = RED;
	                if ((_ref4 = sibling._left) != null) {
	                  _ref4._color = BLACK;
	                }
	                this._rotateRight(sibling);
	              } else if (!_isLeft(successor) && (!sibling._left || sibling._left._color === BLACK) && ((_ref5 = sibling._right) != null ? _ref5._color : void 0) === RED) {
	                sibling._color = RED;
	                if ((_ref6 = sibling._right) != null) {
	                  _ref6._color = BLACK;
	                }
	                this._rotateLeft(sibling);
	              }
	              break;
	            }
	            sibling = _siblingOf(successor);
	            sibling._color = successor._parent._color;
	            if (_isLeft(successor)) {
	              sibling._right._color = BLACK;
	              this._rotateRight(successor._parent);
	            } else {
	              sibling._left._color = BLACK;
	              this._rotateLeft(successor._parent);
	            }
	          }
	        }
	      }
	      if (successor.isLeaf) {
	        return (_ref7 = successor._parent) != null ? _ref7[_leftOrRight(successor)] = void 0 : void 0;
	      }
	    };

	    RedBlackTree.prototype._rotateLeft = function(node) {
	      var _ref, _ref1;
	      if ((_ref = node._parent) != null) {
	        _ref[_leftOrRight(node)] = node._right;
	      }
	      node._right._parent = node._parent;
	      node._parent = node._right;
	      node._right = node._right._left;
	      node._parent._left = node;
	      if ((_ref1 = node._right) != null) {
	        _ref1._parent = node;
	      }
	      if (node._parent._parent == null) {
	        return this._root = node._parent;
	      }
	    };

	    RedBlackTree.prototype._rotateRight = function(node) {
	      var _ref, _ref1;
	      if ((_ref = node._parent) != null) {
	        _ref[_leftOrRight(node)] = node._left;
	      }
	      node._left._parent = node._parent;
	      node._parent = node._left;
	      node._left = node._left._right;
	      node._parent._right = node;
	      if ((_ref1 = node._left) != null) {
	        _ref1._parent = node;
	      }
	      if (node._parent._parent == null) {
	        return this._root = node._parent;
	      }
	    };

	    return RedBlackTree;

	  })();

	  _isLeft = function(node) {
	    return node === node._parent._left;
	  };

	  _leftOrRight = function(node) {
	    if (_isLeft(node)) {
	      return '_left';
	    } else {
	      return '_right';
	    }
	  };

	  _findNode = function(startingNode, comparator) {
	    var comparisonResult, currentNode, foundNode;
	    currentNode = startingNode;
	    foundNode = void 0;
	    while (currentNode) {
	      comparisonResult = comparator(currentNode);
	      if (comparisonResult === NODE_FOUND) {
	        foundNode = currentNode;
	        break;
	      }
	      if (comparisonResult === NODE_TOO_BIG) {
	        currentNode = currentNode._left;
	      } else if (comparisonResult === NODE_TOO_SMALL) {
	        currentNode = currentNode._right;
	      } else if (comparisonResult === STOP_SEARCHING) {
	        break;
	      }
	    }
	    return foundNode;
	  };

	  _peekMinNode = function(startingNode) {
	    return _findNode(startingNode, function(node) {
	      if (node._left) {
	        return NODE_TOO_BIG;
	      } else {
	        return NODE_FOUND;
	      }
	    });
	  };

	  _peekMaxNode = function(startingNode) {
	    return _findNode(startingNode, function(node) {
	      if (node._right) {
	        return NODE_TOO_SMALL;
	      } else {
	        return NODE_FOUND;
	      }
	    });
	  };

	  _grandParentOf = function(node) {
	    var _ref;
	    return (_ref = node._parent) != null ? _ref._parent : void 0;
	  };

	  _uncleOf = function(node) {
	    if (!_grandParentOf(node)) {
	      return;
	    }
	    if (_isLeft(node._parent)) {
	      return _grandParentOf(node)._right;
	    } else {
	      return _grandParentOf(node)._left;
	    }
	  };

	  _siblingOf = function(node) {
	    if (_isLeft(node)) {
	      return node._parent._right;
	    } else {
	      return node._parent._left;
	    }
	  };

	  module.exports = RedBlackTree;

	}).call(this);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Good for fast insertion/removal/lookup of strings.

	## Overview example:

	```js
	var trie = new Trie(['bear', 'beer']);
	trie.add('hello'); // => 'hello'
	trie.add('helloha!'); // => 'helloha!'
	trie.has('bears'); // => false
	trie.longestPrefixOf('beatrice'); // => 'bea'
	trie.wordsWithPrefix('hel'); // => ['hello', 'helloha!']
	trie.remove('beers'); // => undefined. 'beer' still exists
	trie.remove('Beer') // => undefined. Case-sensitive
	trie.remove('beer') // => 'beer'. Removed
	```

	## Properties:

	- size: The total number of words.
	*/


	(function() {
	  var Queue, Trie, WORD_END, _hasAtLeastNChildren,
	    __hasProp = {}.hasOwnProperty;

	  Queue = __webpack_require__(6);

	  WORD_END = 'end';

	  Trie = (function() {
	    function Trie(words) {
	      var word, _i, _len;
	      if (words == null) {
	        words = [];
	      }
	      /*
	      Pass an optional array of strings to be inserted initially.
	      */

	      this._root = {};
	      this.size = 0;
	      for (_i = 0, _len = words.length; _i < _len; _i++) {
	        word = words[_i];
	        this.add(word);
	      }
	    }

	    Trie.prototype.add = function(word) {
	      /*
	      Add a whole string to the trie.
	      
	      _Returns:_ the word added. Will return undefined (without adding the value)
	      if the word passed is null or undefined.
	      */

	      var currentNode, letter, _i, _len;
	      if (word == null) {
	        return;
	      }
	      this.size++;
	      currentNode = this._root;
	      for (_i = 0, _len = word.length; _i < _len; _i++) {
	        letter = word[_i];
	        if (currentNode[letter] == null) {
	          currentNode[letter] = {};
	        }
	        currentNode = currentNode[letter];
	      }
	      currentNode[WORD_END] = true;
	      return word;
	    };

	    Trie.prototype.has = function(word) {
	      /*
	      __Returns:_ true or false.
	      */

	      var currentNode, letter, _i, _len;
	      if (word == null) {
	        return false;
	      }
	      currentNode = this._root;
	      for (_i = 0, _len = word.length; _i < _len; _i++) {
	        letter = word[_i];
	        if (currentNode[letter] == null) {
	          return false;
	        }
	        currentNode = currentNode[letter];
	      }
	      if (currentNode[WORD_END]) {
	        return true;
	      } else {
	        return false;
	      }
	    };

	    Trie.prototype.longestPrefixOf = function(word) {
	      /*
	      Find all words containing the prefix. The word itself counts as a prefix.
	      
	      ```js
	      var trie = new Trie;
	      trie.add('hello');
	      trie.longestPrefixOf('he'); // 'he'
	      trie.longestPrefixOf('hello'); // 'hello'
	      trie.longestPrefixOf('helloha!'); // 'hello'
	      ```
	      
	      _Returns:_ the prefix string, or empty string if no prefix found.
	      */

	      var currentNode, letter, prefix, _i, _len;
	      if (word == null) {
	        return '';
	      }
	      currentNode = this._root;
	      prefix = '';
	      for (_i = 0, _len = word.length; _i < _len; _i++) {
	        letter = word[_i];
	        if (currentNode[letter] == null) {
	          break;
	        }
	        prefix += letter;
	        currentNode = currentNode[letter];
	      }
	      return prefix;
	    };

	    Trie.prototype.wordsWithPrefix = function(prefix) {
	      /*
	      Find all words containing the prefix. The word itself counts as a prefix.
	      **Watch out for edge cases.**
	      
	      ```js
	      var trie = new Trie;
	      trie.wordsWithPrefix(''); // []. Check later case below.
	      trie.add('');
	      trie.wordsWithPrefix(''); // ['']
	      trie.add('he');
	      trie.add('hello');
	      trie.add('hell');
	      trie.add('bear');
	      trie.add('z');
	      trie.add('zebra');
	      trie.wordsWithPrefix('hel'); // ['hell', 'hello']
	      ```
	      
	      _Returns:_ an array of strings, or empty array if no word found.
	      */

	      var accumulatedLetters, currentNode, letter, node, queue, subNode, words, _i, _len, _ref;
	      if (prefix == null) {
	        return [];
	      }
	      (prefix != null) || (prefix = '');
	      words = [];
	      currentNode = this._root;
	      for (_i = 0, _len = prefix.length; _i < _len; _i++) {
	        letter = prefix[_i];
	        currentNode = currentNode[letter];
	        if (currentNode == null) {
	          return [];
	        }
	      }
	      queue = new Queue();
	      queue.enqueue([currentNode, '']);
	      while (queue.size !== 0) {
	        _ref = queue.dequeue(), node = _ref[0], accumulatedLetters = _ref[1];
	        if (node[WORD_END]) {
	          words.push(prefix + accumulatedLetters);
	        }
	        for (letter in node) {
	          if (!__hasProp.call(node, letter)) continue;
	          subNode = node[letter];
	          queue.enqueue([subNode, accumulatedLetters + letter]);
	        }
	      }
	      return words;
	    };

	    Trie.prototype.remove = function(word) {
	      /*
	      _Returns:_ the string removed, or undefined if the word in its whole doesn't
	      exist. **Note:** this means removing `beers` when only `beer` exists will
	      return undefined and conserve `beer`.
	      */

	      var currentNode, i, letter, prefix, _i, _j, _len, _ref;
	      if (word == null) {
	        return;
	      }
	      currentNode = this._root;
	      prefix = [];
	      for (_i = 0, _len = word.length; _i < _len; _i++) {
	        letter = word[_i];
	        if (currentNode[letter] == null) {
	          return;
	        }
	        currentNode = currentNode[letter];
	        prefix.push([letter, currentNode]);
	      }
	      if (!currentNode[WORD_END]) {
	        return;
	      }
	      this.size--;
	      delete currentNode[WORD_END];
	      if (_hasAtLeastNChildren(currentNode, 1)) {
	        return word;
	      }
	      for (i = _j = _ref = prefix.length - 1; _ref <= 1 ? _j <= 1 : _j >= 1; i = _ref <= 1 ? ++_j : --_j) {
	        if (!_hasAtLeastNChildren(prefix[i][1], 1)) {
	          delete prefix[i - 1][1][prefix[i][0]];
	        } else {
	          break;
	        }
	      }
	      if (!_hasAtLeastNChildren(this._root[prefix[0][0]], 1)) {
	        delete this._root[prefix[0][0]];
	      }
	      return word;
	    };

	    return Trie;

	  })();

	  _hasAtLeastNChildren = function(node, n) {
	    var child, childCount;
	    if (n === 0) {
	      return true;
	    }
	    childCount = 0;
	    for (child in node) {
	      if (!__hasProp.call(node, child)) continue;
	      childCount++;
	      if (childCount >= n) {
	        return true;
	      }
	    }
	    return false;
	  };

	  module.exports = Trie;

	}).call(this);


/***/ }
/******/ ]);;angular.module('uiGmapgoogle-maps.wrapped')
.service('uiGmapMarkerSpiderfier', [ 'uiGmapGoogleMapApi', function(GoogleMapApi) {
  var self = this;
  /* istanbul ignore next */
  +function(){
    
/** @preserve OverlappingMarkerSpiderfier
https://github.com/jawj/OverlappingMarkerSpiderfier
Copyright (c) 2011 - 2013 George MacKerron
Released under the MIT licence: http://opensource.org/licenses/mit-license
Note: The Google Maps API v3 must be included *before* this code
 */
var hasProp = {}.hasOwnProperty,
  slice = [].slice;

this['OverlappingMarkerSpiderfier'] = (function() {
  var ge, gm, j, lcH, lcU, len, mt, p, ref, twoPi, x;

  p = _Class.prototype;

  ref = [_Class, p];
  for (j = 0, len = ref.length; j < len; j++) {
    x = ref[j];
    x['VERSION'] = '0.3.3';
  }

  gm = void 0;

  ge = void 0;

  mt = void 0;

  twoPi = Math.PI * 2;

  p['keepSpiderfied'] = false;

  p['markersWontHide'] = false;

  p['markersWontMove'] = false;

  p['nearbyDistance'] = 20;

  p['circleSpiralSwitchover'] = 9;

  p['circleFootSeparation'] = 23;

  p['circleStartAngle'] = twoPi / 12;

  p['spiralFootSeparation'] = 26;

  p['spiralLengthStart'] = 11;

  p['spiralLengthFactor'] = 4;

  p['spiderfiedZIndex'] = 1000;

  p['usualLegZIndex'] = 10;

  p['highlightedLegZIndex'] = 20;

  p['event'] = 'click';

  p['minZoomLevel'] = false;

  p['legWeight'] = 1.5;

  p['legColors'] = {
    'usual': {},
    'highlighted': {}
  };

  lcU = p['legColors']['usual'];

  lcH = p['legColors']['highlighted'];

  _Class['initializeGoogleMaps'] = function(google) {
    gm = google.maps;
    ge = gm.event;
    mt = gm.MapTypeId;
    lcU[mt.HYBRID] = lcU[mt.SATELLITE] = '#fff';
    lcH[mt.HYBRID] = lcH[mt.SATELLITE] = '#f00';
    lcU[mt.TERRAIN] = lcU[mt.ROADMAP] = '#444';
    lcH[mt.TERRAIN] = lcH[mt.ROADMAP] = '#f00';
    this.ProjHelper = function(map) {
      return this.setMap(map);
    };
    this.ProjHelper.prototype = new gm.OverlayView();
    return this.ProjHelper.prototype['draw'] = function() {};
  };

  function _Class(map1, opts) {
    var e, k, l, len1, ref1, v;
    this.map = map1;
    if (opts == null) {
      opts = {};
    }
    for (k in opts) {
      if (!hasProp.call(opts, k)) continue;
      v = opts[k];
      this[k] = v;
    }
    this.projHelper = new this.constructor.ProjHelper(this.map);
    this.initMarkerArrays();
    this.listeners = {};
    ref1 = ['click', 'zoom_changed', 'maptypeid_changed'];
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      e = ref1[l];
      ge.addListener(this.map, e, (function(_this) {
        return function() {
          return _this['unspiderfy']();
        };
      })(this));
    }
  }

  p.initMarkerArrays = function() {
    this.markers = [];
    return this.markerListenerRefs = [];
  };

  p['addMarker'] = function(marker) {
    var listenerRefs;
    if (marker['_oms'] != null) {
      return this;
    }
    marker['_oms'] = true;
    listenerRefs = [
      ge.addListener(marker, this['event'], (function(_this) {
        return function(event) {
          return _this.spiderListener(marker, event);
        };
      })(this))
    ];
    if (!this['markersWontHide']) {
      listenerRefs.push(ge.addListener(marker, 'visible_changed', (function(_this) {
        return function() {
          return _this.markerChangeListener(marker, false);
        };
      })(this)));
    }
    if (!this['markersWontMove']) {
      listenerRefs.push(ge.addListener(marker, 'position_changed', (function(_this) {
        return function() {
          return _this.markerChangeListener(marker, true);
        };
      })(this)));
    }
    this.markerListenerRefs.push(listenerRefs);
    this.markers.push(marker);
    return this;
  };

  p.markerChangeListener = function(marker, positionChanged) {
    if ((marker['_omsData'] != null) && (positionChanged || !marker.getVisible()) && !((this.spiderfying != null) || (this.unspiderfying != null))) {
      return this['unspiderfy'](positionChanged ? marker : null);
    }
  };

  p['getMarkers'] = function() {
    return this.markers.slice(0);
  };

  p['removeMarker'] = function(marker) {
    var i, l, len1, listenerRef, listenerRefs;
    if (marker['_omsData'] != null) {
      this['unspiderfy']();
    }
    i = this.arrIndexOf(this.markers, marker);
    if (i < 0) {
      return this;
    }
    listenerRefs = this.markerListenerRefs.splice(i, 1)[0];
    for (l = 0, len1 = listenerRefs.length; l < len1; l++) {
      listenerRef = listenerRefs[l];
      ge.removeListener(listenerRef);
    }
    delete marker['_oms'];
    this.markers.splice(i, 1);
    return this;
  };

  p['clearMarkers'] = function() {
    var i, l, len1, len2, listenerRef, listenerRefs, marker, n, ref1;
    this['unspiderfy']();
    ref1 = this.markers;
    for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
      marker = ref1[i];
      listenerRefs = this.markerListenerRefs[i];
      for (n = 0, len2 = listenerRefs.length; n < len2; n++) {
        listenerRef = listenerRefs[n];
        ge.removeListener(listenerRef);
      }
      delete marker['_oms'];
    }
    this.initMarkerArrays();
    return this;
  };

  p['addListener'] = function(event, func) {
    var base;
    ((base = this.listeners)[event] != null ? base[event] : base[event] = []).push(func);
    return this;
  };

  p['removeListener'] = function(event, func) {
    var i;
    i = this.arrIndexOf(this.listeners[event], func);
    if (!(i < 0)) {
      this.listeners[event].splice(i, 1);
    }
    return this;
  };

  p['clearListeners'] = function(event) {
    this.listeners[event] = [];
    return this;
  };

  p.trigger = function() {
    var args, event, func, l, len1, ref1, ref2, results;
    event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    ref2 = (ref1 = this.listeners[event]) != null ? ref1 : [];
    results = [];
    for (l = 0, len1 = ref2.length; l < len1; l++) {
      func = ref2[l];
      results.push(func.apply(null, args));
    }
    return results;
  };

  p.generatePtsCircle = function(count, centerPt) {
    var angle, angleStep, circumference, i, l, legLength, ref1, results;
    circumference = this['circleFootSeparation'] * (2 + count);
    legLength = circumference / twoPi;
    angleStep = twoPi / count;
    results = [];
    for (i = l = 0, ref1 = count; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
      angle = this['circleStartAngle'] + i * angleStep;
      results.push(new gm.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle)));
    }
    return results;
  };

  p.generatePtsSpiral = function(count, centerPt) {
    var angle, i, l, legLength, pt, ref1, results;
    legLength = this['spiralLengthStart'];
    angle = 0;
    results = [];
    for (i = l = 0, ref1 = count; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
      angle += this['spiralFootSeparation'] / legLength + i * 0.0005;
      pt = new gm.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle));
      legLength += twoPi * this['spiralLengthFactor'] / angle;
      results.push(pt);
    }
    return results;
  };

  p.spiderListener = function(marker, event) {
    var $this, clear, l, len1, m, mPt, markerPt, markerSpiderfied, nDist, nearbyMarkerData, nonNearbyMarkers, pxSq, ref1;
    markerSpiderfied = marker['_omsData'] != null;
    if (!(markerSpiderfied && this['keepSpiderfied'])) {
      if (this['event'] === 'mouseover') {
        $this = this;
        clear = function() {
          return $this['unspiderfy']();
        };
        window.clearTimeout(p.timeout);
        p.timeout = setTimeout(clear, 3000);
      } else {
        this['unspiderfy']();
      }
    }
    if (markerSpiderfied || this.map.getStreetView().getVisible() || this.map.getMapTypeId() === 'GoogleEarthAPI') {
      return this.trigger('click', marker, event);
    } else {
      nearbyMarkerData = [];
      nonNearbyMarkers = [];
      nDist = this['nearbyDistance'];
      pxSq = nDist * nDist;
      markerPt = this.llToPt(marker.position);
      ref1 = this.markers;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        m = ref1[l];
        if (!((m.map != null) && m.getVisible())) {
          continue;
        }
        mPt = this.llToPt(m.position);
        if (this.ptDistanceSq(mPt, markerPt) < pxSq) {
          nearbyMarkerData.push({
            marker: m,
            markerPt: mPt
          });
        } else {
          nonNearbyMarkers.push(m);
        }
      }
      if (nearbyMarkerData.length === 1) {
        return this.trigger('click', marker, event);
      } else {
        return this.spiderfy(nearbyMarkerData, nonNearbyMarkers);
      }
    }
  };

  p['markersNearMarker'] = function(marker, firstOnly) {
    var l, len1, m, mPt, markerPt, markers, nDist, pxSq, ref1, ref2, ref3;
    if (firstOnly == null) {
      firstOnly = false;
    }
    if (this.projHelper.getProjection() == null) {
      throw "Must wait for 'idle' event on map before calling markersNearMarker";
    }
    nDist = this['nearbyDistance'];
    pxSq = nDist * nDist;
    markerPt = this.llToPt(marker.position);
    markers = [];
    ref1 = this.markers;
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      m = ref1[l];
      if (m === marker || (m.map == null) || !m.getVisible()) {
        continue;
      }
      mPt = this.llToPt((ref2 = (ref3 = m['_omsData']) != null ? ref3.usualPosition : void 0) != null ? ref2 : m.position);
      if (this.ptDistanceSq(mPt, markerPt) < pxSq) {
        markers.push(m);
        if (firstOnly) {
          break;
        }
      }
    }
    return markers;
  };

  p['markersNearAnyOtherMarker'] = function() {
    var i, i1, i2, l, len1, len2, len3, m, m1, m1Data, m2, m2Data, mData, n, nDist, pxSq, q, ref1, ref2, ref3, results;
    if (this.projHelper.getProjection() == null) {
      throw "Must wait for 'idle' event on map before calling markersNearAnyOtherMarker";
    }
    nDist = this['nearbyDistance'];
    pxSq = nDist * nDist;
    mData = (function() {
      var l, len1, ref1, ref2, ref3, results;
      ref1 = this.markers;
      results = [];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        m = ref1[l];
        results.push({
          pt: this.llToPt((ref2 = (ref3 = m['_omsData']) != null ? ref3.usualPosition : void 0) != null ? ref2 : m.position),
          willSpiderfy: false
        });
      }
      return results;
    }).call(this);
    ref1 = this.markers;
    for (i1 = l = 0, len1 = ref1.length; l < len1; i1 = ++l) {
      m1 = ref1[i1];
      if (!((m1.map != null) && m1.getVisible())) {
        continue;
      }
      m1Data = mData[i1];
      if (m1Data.willSpiderfy) {
        continue;
      }
      ref2 = this.markers;
      for (i2 = n = 0, len2 = ref2.length; n < len2; i2 = ++n) {
        m2 = ref2[i2];
        if (i2 === i1) {
          continue;
        }
        if (!((m2.map != null) && m2.getVisible())) {
          continue;
        }
        m2Data = mData[i2];
        if (i2 < i1 && !m2Data.willSpiderfy) {
          continue;
        }
        if (this.ptDistanceSq(m1Data.pt, m2Data.pt) < pxSq) {
          m1Data.willSpiderfy = m2Data.willSpiderfy = true;
          break;
        }
      }
    }
    ref3 = this.markers;
    results = [];
    for (i = q = 0, len3 = ref3.length; q < len3; i = ++q) {
      m = ref3[i];
      if (mData[i].willSpiderfy) {
        results.push(m);
      }
    }
    return results;
  };

  p.makeHighlightListenerFuncs = function(marker) {
    return {
      highlight: (function(_this) {
        return function() {
          return marker['_omsData'].leg.setOptions({
            strokeColor: _this['legColors']['highlighted'][_this.map.mapTypeId],
            zIndex: _this['highlightedLegZIndex']
          });
        };
      })(this),
      unhighlight: (function(_this) {
        return function() {
          return marker['_omsData'].leg.setOptions({
            strokeColor: _this['legColors']['usual'][_this.map.mapTypeId],
            zIndex: _this['usualLegZIndex']
          });
        };
      })(this)
    };
  };

  p.spiderfy = function(markerData, nonNearbyMarkers) {
    var bodyPt, footLl, footPt, footPts, highlightListenerFuncs, leg, marker, md, nearestMarkerDatum, numFeet, spiderfiedMarkers;
    if (this['minZoomLevel'] && this.map.getZoom() < this['minZoomLevel']) {
      return false;
    }
    this.spiderfying = true;
    numFeet = markerData.length;
    bodyPt = this.ptAverage((function() {
      var l, len1, results;
      results = [];
      for (l = 0, len1 = markerData.length; l < len1; l++) {
        md = markerData[l];
        results.push(md.markerPt);
      }
      return results;
    })());
    footPts = numFeet >= this['circleSpiralSwitchover'] ? this.generatePtsSpiral(numFeet, bodyPt).reverse() : this.generatePtsCircle(numFeet, bodyPt);
    spiderfiedMarkers = (function() {
      var l, len1, results;
      results = [];
      for (l = 0, len1 = footPts.length; l < len1; l++) {
        footPt = footPts[l];
        footLl = this.ptToLl(footPt);
        nearestMarkerDatum = this.minExtract(markerData, (function(_this) {
          return function(md) {
            return _this.ptDistanceSq(md.markerPt, footPt);
          };
        })(this));
        marker = nearestMarkerDatum.marker;
        leg = new gm.Polyline({
          map: this.map,
          path: [marker.position, footLl],
          strokeColor: this['legColors']['usual'][this.map.mapTypeId],
          strokeWeight: this['legWeight'],
          zIndex: this['usualLegZIndex']
        });
        marker['_omsData'] = {
          usualPosition: marker.position,
          leg: leg
        };
        if (this['legColors']['highlighted'][this.map.mapTypeId] !== this['legColors']['usual'][this.map.mapTypeId]) {
          highlightListenerFuncs = this.makeHighlightListenerFuncs(marker);
          marker['_omsData'].hightlightListeners = {
            highlight: ge.addListener(marker, 'mouseover', highlightListenerFuncs.highlight),
            unhighlight: ge.addListener(marker, 'mouseout', highlightListenerFuncs.unhighlight)
          };
        }
        marker.setPosition(footLl);
        marker.setZIndex(Math.round(this['spiderfiedZIndex'] + footPt.y));
        results.push(marker);
      }
      return results;
    }).call(this);
    delete this.spiderfying;
    this.spiderfied = true;
    return this.trigger('spiderfy', spiderfiedMarkers, nonNearbyMarkers);
  };

  p['unspiderfy'] = function(markerNotToMove) {
    var l, len1, listeners, marker, nonNearbyMarkers, ref1, unspiderfiedMarkers;
    if (markerNotToMove == null) {
      markerNotToMove = null;
    }
    if (this.spiderfied == null) {
      return this;
    }
    this.unspiderfying = true;
    unspiderfiedMarkers = [];
    nonNearbyMarkers = [];
    ref1 = this.markers;
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      marker = ref1[l];
      if (marker['_omsData'] != null) {
        marker['_omsData'].leg.setMap(null);
        if (marker !== markerNotToMove) {
          marker.setPosition(marker['_omsData'].usualPosition);
        }
        marker.setZIndex(null);
        listeners = marker['_omsData'].hightlightListeners;
        if (listeners != null) {
          ge.removeListener(listeners.highlight);
          ge.removeListener(listeners.unhighlight);
        }
        delete marker['_omsData'];
        unspiderfiedMarkers.push(marker);
      } else {
        nonNearbyMarkers.push(marker);
      }
    }
    delete this.unspiderfying;
    delete this.spiderfied;
    this.trigger('unspiderfy', unspiderfiedMarkers, nonNearbyMarkers);
    return this;
  };

  p.ptDistanceSq = function(pt1, pt2) {
    var dx, dy;
    dx = pt1.x - pt2.x;
    dy = pt1.y - pt2.y;
    return dx * dx + dy * dy;
  };

  p.ptAverage = function(pts) {
    var l, len1, numPts, pt, sumX, sumY;
    sumX = sumY = 0;
    for (l = 0, len1 = pts.length; l < len1; l++) {
      pt = pts[l];
      sumX += pt.x;
      sumY += pt.y;
    }
    numPts = pts.length;
    return new gm.Point(sumX / numPts, sumY / numPts);
  };

  p.llToPt = function(ll) {
    return this.projHelper.getProjection().fromLatLngToDivPixel(ll);
  };

  p.ptToLl = function(pt) {
    return this.projHelper.getProjection().fromDivPixelToLatLng(pt);
  };

  p.minExtract = function(set, func) {
    var bestIndex, bestVal, index, item, l, len1, val;
    for (index = l = 0, len1 = set.length; l < len1; index = ++l) {
      item = set[index];
      val = func(item);
      if ((typeof bestIndex === "undefined" || bestIndex === null) || val < bestVal) {
        bestVal = val;
        bestIndex = index;
      }
    }
    return set.splice(bestIndex, 1)[0];
  };

  p.arrIndexOf = function(arr, obj) {
    var i, l, len1, o;
    if (arr.indexOf != null) {
      return arr.indexOf(obj);
    }
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      o = arr[i];
      if (o === obj) {
        return i;
      }
    }
    return -1;
  };

  return _Class;

})();

  }.apply(self);

  GoogleMapApi.then(function(){
    self.OverlappingMarkerSpiderfier.initializeGoogleMaps(window.google);
  });
  return this.OverlappingMarkerSpiderfier;
}]);
;/**
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
}( window,angular));