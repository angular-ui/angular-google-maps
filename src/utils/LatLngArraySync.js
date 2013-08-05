angular.module("google-maps")
    .factory('array-sync',['add-events',function(mapEvents){

        return function LatLngArraySync(mapArray,scope,pathEval){
            var scopeArray = scope.$eval(pathEval);

            var mapArrayListener = mapEvents(mapArray,{
               'set_at':function(index){
                   var value = mapArray.getAt(index);
                   scopeArray[index].latitude = value.lat();
                   scopeArray[index].longitude = value.lng();
                  // scope.$apply();
               },
               'insert_at':function(index){
                   var value = mapArray.getAt(index);
                   scopeArray.splice(index,0,{latitude:value.lat(),longitude:value.lng()});
                //   scope.$apply();
               },
               'remove_at':function(index){
                   scopeArray.splice(index,1);
               //    scope.$apply();
               }
            });
                                  /*
            var mapSetAtListener = google.maps.event.addListener(mapArray,'set_at',function(index){
                var value = mapArray.getAt(index);
                scopeArray[index].latitude = value.lat();
                scopeArray[index].longitude = value.lng();
                scope.$apply();
            });

            var mapInsertAtListener = google.maps.event.addListener(mapArray,'insert_at',function(index){
                var value = mapArray.getAt(index);
                scopeArray.splice(index,0,{latitude:value.lat(),longitude:value.lng()});
                scope.$apply();
            });

            var mapRemoveAtListener = google.maps.event.addListener(mapArray,'remove_at',function(index){
                scopeArray.splice(index,1);
                scope.$apply();
            });                          */


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
               /* if(mapSetAtListener){
                    mapSetAtListener();
                    mapSetAtListener = null;
                }
                if(mapInsertAtListener){
                    mapInsertAtListener();
                    mapInsertAtListener = null;
                }
                if(mapRemoveAtListener){
                    mapRemoveAtListener();
                    mapRemoveAtListener = null;
                }   */
                if(mapArrayListener){
                    mapArrayListener();
                    mapArrayListener = null;
                }
                if(watchListener){
                    watchListener();
                    watchListener = null;
                }
            }
        }
    }]);