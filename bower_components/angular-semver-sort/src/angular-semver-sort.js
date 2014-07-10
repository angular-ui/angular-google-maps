;angular.module('semverSort', []).factory('semverSortArrayHelpers', function() {
  'use strict';

  var clone = function(collection) {
    return (collection || []).slice(0);
  };

  var sortAlphabetically = function(collection, prop) {
    var items = clone(collection);
    return !prop ? items.sort() : items.sort(function(A, B) {
      var a = A[prop], b = B[prop];
      if ( a > b ) return 1;
      if ( a < b ) return -1;
      return 0;
    });
  };

  var reverse = function(collection) {
    return clone(collection).reverse();
  };

  return {
    clone: clone,
    sortAlphabetically: sortAlphabetically,
    reverse: reverse
  };

}).filter('semverSort', [
  '$window', '$log', 'semverSortArrayHelpers', function($window, $log, _) {
    'use strict';

    var semver = $window.semver;

    var WARNING_FALLBACK = '`semverSort` will fall back to alphabetical sorting.';
    var WARNING_UNAVAILABLE = 'Semver library is unvailable. ' + WARNING_FALLBACK;
    var WARNING_NONSEMVER = 'This collection contains non-semver strings. ' + WARNING_FALLBACK;

    if ( !(semver && 'SEMVER_SPEC_VERSION' in semver) ) {
      $log.warn(WARNING_UNAVAILABLE);
      return _.sortAlphabetically;
    }

    var isItemValid = function(item) {
      return semver.valid(item, true);
    };

    var areItemsValid = function(collection, prop) {
      if ( !collection ) return false;
      return !prop ? collection.every(isItemValid) : collection.every(function(item) {
        return isItemValid(item[prop]);
      });
    };

    return function(collection, prop) {
      if ( !areItemsValid(collection, prop) ) {
        $log.warn(WARNING_NONSEMVER);
        return _.sortAlphabetically(collection, prop);
      }

      var items = _.clone(collection);
      return !prop ? semver.sort(items, true) : items.sort(function(A, B) {
        return semver.compare(A[prop], B[prop], true);
      });
    };
  }
]).filter('semverReverseSort', [
  '$filter', 'semverSortArrayHelpers', function($filter, _) {
    'use strict';

    return function(collection, prop) {
      return _.reverse($filter('semverSort')(collection, prop));
    };
  }
]);
