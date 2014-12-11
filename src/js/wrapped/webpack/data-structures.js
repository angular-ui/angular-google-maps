angular.module('uiGmapgoogle-maps.wrapped')
.service('uiGmapDataStructures', function() {
return {
  Graph: require('data-structures').Graph,
  Queue: require('data-structures').Queue
};
});
