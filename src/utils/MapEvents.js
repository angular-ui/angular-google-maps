angular.module('google-maps').factory('add-events', ['$timeout',function($timeout){

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
            angular.forEach(remove,function(fn){fn()});
            remove = null;
        }
    }

    return addEvents;

}]);